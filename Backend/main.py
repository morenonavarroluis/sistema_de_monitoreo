# main.py
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from controller.ping import run_ping_check
from apscheduler.schedulers.background import BackgroundScheduler
from controller.registrar_user import ver_usuarios
from controller.login import login_usuario
from controller.port_clear import test_ssh_connection, register_port_clear
from model.ip_model import Clearport, SessionLocal

app = FastAPI()

# Esta es la única lista de verdad
historial_real = []

class UserSchema(BaseModel):
    nombre: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class IpPortSchema(BaseModel):
    ip: str
    nombre: str
    user_ip: str
    pass_ip: str
    description: str = ""

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    scheduler = BackgroundScheduler()
    scheduler.add_job(run_ping_check, 'cron', hour='8,16', args=[historial_real])
    scheduler.start()
    
    
    # run_ping_check(historial_real) 

@app.post("/login")
async def usuario_login(datos: UserLogin):
    resultado = login_usuario(datos.email, datos.password)
    return resultado

@app.get("/status")
async def get_latest_pings():
    return historial_real

@app.post("/user")
async def usuario_registro(datos: UserSchema):
    from controller.registrar_user import registrar_usuario
    resultado = registrar_usuario(datos.nombre, datos.email, datos.password)
    return resultado


@app.get("/view_user")
async def get_usuarios(): 
    view_user = ver_usuarios() 
    return view_user


from fastapi import HTTPException

@app.post("/limpiar_ports") # 1. Cambiamos a POST
async def port_clear(): 
    ips = ['10.20.100.12', '10.30.2.8', '10.20.100.54', '10.20.100.52']
    USER = "M3rc@l"
    PASS = "R3DM3RC@L22"
    
    resultados = []
    fallos = 0

    for ip in ips:
        clear = test_ssh_connection(ip, USER, PASS)
        status = "OK" if clear else "Error"
        if not clear:
            fallos += 1
        resultados.append({"ip": ip, "status": status}) 

    # 2. Si fallaron todas, podemos mandar un error real de servidor (500)
    if fallos == len(ips):
        raise HTTPException(status_code=500, detail="No se pudo conectar a ninguna IP")

    return {
        "message": f"Proceso terminado. Exitos: {len(ips)-fallos}, Fallos: {fallos}",
        "detalles": resultados
    }

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/registrar_ports_db")
async def port_clear_db(datos: IpPortSchema):
    clear_port = register_port_clear(datos.ip, datos.nombre, datos.user_ip, datos.pass_ip, datos.description)
    return {"message": "Puerto registrado exitosamente", "registro": clear_port}

@app.get("/view_clearports")    
async def view_clearports(db: Session = Depends(get_db)):
    clearport_entries = db.query(Clearport).all()
    return clearport_entries