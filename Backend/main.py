# main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from controller.ping import run_ping_check
from apscheduler.schedulers.background import BackgroundScheduler
from controller.registrar_user import ver_usuarios
from controller.login import login_usuario
from controller.port_clear import test_ssh_connection, register_port_clear,log_message
from model.ip_model import Clearport, SessionLocal
from fastapi.responses import StreamingResponse
import json
import asyncio

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




@app.get("/limpiar_ports")
async def port_clear_stream():
    def generate_progress():
        db = SessionLocal()
        try:
            dispositivos = db.query(Clearport).all()
            if not dispositivos:
                yield f"data: {json.dumps({'error': 'No hay IPs registradas'})}\n\n"
                return

            total = len(dispositivos)
            
            for index, equipo in enumerate(dispositivos):
                # Ejecutamos la conexión (Asegúrate que test_ssh_connection sea rápida o usa hilos)
                exito = test_ssh_connection(equipo.ip_port, equipo.user_ip, equipo.pass_ip)
                
                status = "OK" if exito else "Error"
                progreso = int(((index + 1) / total) * 100)

                # Construimos el mensaje de actualización
                payload = {
                    "progress": progreso,
                    "nombre": equipo.nombre,
                    "ip": equipo.ip_port,
                    "status": status,
                    "current": index + 1,
                    "total": total
                }
                
                # Enviamos el dato al frontend
                yield f"data: {json.dumps(payload)}\n\n"
                
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            db.close()

    return StreamingResponse(generate_progress(), media_type="text/event-stream")

@app.get("/limpiar_ports/{ip}")
async def port_clear_individual(ip: str): 
    # Definimos el generador dentro
    async def generate_event():
        db = SessionLocal()
        try:
            # 1. Buscamos el equipo
            equipo = db.query(Clearport).filter(Clearport.ip_port == ip).first()
            
            if not equipo:
                yield f"data: {json.dumps({'error': 'Dispositivo no encontrado'})}\n\n"
                return

            # Al ser individual, definimos pasos manuales para la barra de progreso
            # Paso 1: Conectando
            yield f"data: {json.dumps({'progress': 20, 'nombre': equipo.nombre, 'status': 'Iniciando SSH...'})}\n\n"
            
            # Paso 2: Ejecución (Tu lógica de SSH)
            exito = test_ssh_connection(equipo.ip_port, equipo.user_ip, equipo.pass_ip)
            
            # Paso 3: Resultado final
            status = "OK" if exito else "Error"
            payload = {
                "progress": 100,
                "nombre": equipo.nombre,
                "ip": equipo.ip_port,
                "status": status,
                "current": 1,
                "total": 1
            }
            yield f"data: {json.dumps(payload)}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            db.close()

    # IMPORTANTE: Retornar StreamingResponse
    return StreamingResponse(generate_event(), media_type="text/event-stream")
    
          
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