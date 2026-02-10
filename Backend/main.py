# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from pytz import timezone

# 1. Definimos la zona horaria y el scheduler GLOBALMENTE
vzl_tz = timezone('America/Caracas')
scheduler = BackgroundScheduler(timezone=vzl_tz)

from routers import ports, auth, bot 
from controller.ping import run_ping_check,get_telegram_config

historial_real = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Lógica de Inicio (Startup) ---
    
    # Programamos la tarea: 08 y 16 (8am y 4pm)
    # No vuelvas a declarar 'scheduler = ...' aquí
    scheduler.add_job(
        run_ping_check, 
        'cron', 
        hour='08,16', 
        minute=0, 
        args=[historial_real]
    )
    
    scheduler.start()
    
    # Ejecutamos una vez al arrancar para probar que funcione
    run_ping_check(historial_real)
    
    yield  
    
    # --- Lógica de Cierre (Shutdown) ---
    scheduler.shutdown()

# Inicializamos FastAPI con el ciclo de vida (lifespan)
app = FastAPI(
    title="Sistema de Gestión de IPs",
    description="API modular para limpieza de puertos y monitoreo",
    lifespan=lifespan
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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