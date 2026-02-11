# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from pytz import timezone


vzl_tz = timezone('America/Caracas')
scheduler = BackgroundScheduler(timezone=vzl_tz)

from routers import ports, auth, bot 
from controller.ping import run_ping_check,get_telegram_config

historial_real = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.add_job(
        run_ping_check, 
        'cron', 
        hour='08,12,16', 
        minute=0, 
        args=[historial_real]
    )
    scheduler.start()
    
    # run_ping_check(historial_real)
    yield  
    
   
    scheduler.shutdown()


app = FastAPI(
    title="Sistema de Gestión de IPs",
    description="API modular para limpieza de puertos y monitoreo",
    lifespan=lifespan
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Registro de Routers ---
app.include_router(ports.router)
app.include_router(auth.router)
app.include_router(bot.router)

@app.get("/status", tags=["Estado"])
async def get_latest_pings():
    # 1. Obtenemos la config actual de la DB
    chat_id, token = get_telegram_config()
    
    # 2. Retornamos un objeto compuesto
    return {
        "dispositivos": historial_real, # Los 41 elementos para la tabla
        "config_bot": {
            "token": token,
            "chat_id": chat_id
        } if token else None,
        "total_monitoreo": len(historial_real)
    }