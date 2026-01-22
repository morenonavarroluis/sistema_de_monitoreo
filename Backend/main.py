# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controller.ping import run_ping_check
from apscheduler.schedulers.background import BackgroundScheduler

app = FastAPI()

# Esta es la única lista de verdad
historial_real = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    scheduler = BackgroundScheduler()
    # Pasamos 'historial_real' dentro de una lista en el argumento 'args'
    scheduler.add_job(run_ping_check, 'interval', minutes=27, args=[historial_real])
    scheduler.add_job(run_ping_check, 'cron', hour='14', minute='10', args=[historial_real])
    scheduler.start()
    
    # Ejecutamos el primer ping manualmente al arrancar
    #run_ping_check(historial_real) 

@app.get("/status")
async def get_latest_pings():
    # Retornamos la lista que el scheduler está llenando
    return historial_real