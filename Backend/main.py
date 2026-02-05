# main.py
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from controller.ping import run_ping_check
from apscheduler.schedulers.background import BackgroundScheduler
from controller.registrar_user import ver_usuarios
from controller.login import login_usuario
from controller.port_clear import test_ssh_connection, register_port_clear,log_message
from model.ip_model import Clearport, SessionLocal
from fastapi import HTTPException
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
    scheduler.add_job(run_ping_check, 'cron', hour='08,15,16', args=[historial_real])
    scheduler.start()
    
    
    run_ping_check(historial_real) 

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




@app.post("/limpiar_ports")
async def port_clear():
    # 1. Abrir conexión a la DB
    db = SessionLocal()
    try:
        # 2. Consultar todos los dispositivos registrados
        dispositivos = db.query(Clearport).all()
        
        if not dispositivos:
            raise HTTPException(status_code=404, detail="No hay IPs registradas en la base de datos")

        resultados = []
        fallos = 0

        # 3. Iterar usando los datos de la DB
        for equipo in dispositivos:
            # Usamos los campos específicos de cada fila: ip_port, user_ip, pass_ip
            exito = test_ssh_connection(equipo.ip_port, equipo.user_ip, equipo.pass_ip)
            
            status = "OK" if exito else "Error"
            if not exito:
                fallos += 1
            
            resultados.append({
                "nombre": equipo.nombre,
                "ip": equipo.ip_port, 
                "status": status
            })

        # 4. Manejo de errores si todo falla
        if fallos == len(dispositivos):
            raise HTTPException(status_code=500, detail="No se pudo conectar a ningún dispositivo")

        return {
            "message": f"Proceso terminado. Éxitos: {len(dispositivos)-fallos}, Fallos: {fallos}",
            "detalles": resultados
        }
    
    except Exception as e:
        # Capturar errores inesperados de DB o ejecución
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")
    
    finally:
        # 5. Siempre cerrar la sesión de la DB
        db.close()

@app.post("/limpiar_ports/{ip}")
async def port_clear_individual(ip: str): 
    db = SessionLocal()
    try:
        # 1. Buscamos específicamente el equipo que coincida con esa IP
        equipo = db.query(Clearport).filter(Clearport.ip_port == ip).first()
        
        # 2. Si no existe en la DB, lanzamos error 404
        if not equipo:
            raise HTTPException(
                status_code=404, 
                detail=f"La IP {ip} no está registrada en la base de datos"
            )

        # 3. Ejecutamos la conexión usando los datos de ese registro
        exito = test_ssh_connection(
            hostname=equipo.ip_port, 
            username=equipo.user_ip, 
            password=equipo.pass_ip
        )
        
        if not exito:
            raise HTTPException(
                status_code=500, 
                detail=f"Error de conexión SSH con el equipo {equipo.nombre} ({ip})"
            )

        return {
            "status": "success",
            "message": f"Limpieza completada en {equipo.nombre}",
            "datos": {
                "nombre": equipo.nombre,
                "ip": equipo.ip_port,
                "descripcion": equipo.description
            }
        }

    finally:
        db.close()
          
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