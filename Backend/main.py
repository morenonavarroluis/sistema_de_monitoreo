# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from controller.ping import run_ping_check
from apscheduler.schedulers.background import BackgroundScheduler
from controller.registrar_user import ver_usuarios
from controller.login import login_usuario

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