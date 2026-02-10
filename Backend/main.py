# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler

# Importamos los routers desde la carpeta routers
from routers import ports, auth, bot 
from controller.ping import run_ping_check

# Esta es la lista que compartiremos con el scheduler
historial_real = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Lógica de Inicio (Startup) ---
    scheduler = BackgroundScheduler()
    # Programamos la tarea de ping
    scheduler.add_job(run_ping_check, 'cron', hour='08,15,16', args=[historial_real])
    scheduler.start()
    
    yield  # Aquí es donde la aplicación "vive" y atiende peticiones
    
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

# Ruta base para verificar el estado de los pings
@app.get("/status", tags=["Estado"])
async def get_latest_pings():
    return historial_real