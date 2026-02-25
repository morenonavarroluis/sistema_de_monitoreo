from fastapi import APIRouter
from schemas.schemas import BootSchema,AlertTimeSchema
from controller.ping import registrar_token,get_telegram_config,registrar_alert_time,view_alert
from fastapi import APIRouter, HTTPException
import httpx # Recomendado para FastAPI asíncrono
from acce_token import obtener_usuario_actual
from fastapi import Depends

router = APIRouter(prefix="/bot", tags=["Configuración Bot"])

@router.post("/registrar_boot")
async def registrar_boot(datos: BootSchema, user = Depends(obtener_usuario_actual)):
    registrar_token(datos.token, datos.chat_id)
    return {"message": "Boot registrado exitosamente"}


@router.post("/send-test-telegram")
async def send_test_telegram():
    # 1. Forzamos la lectura de la DB para tener lo último configurado
    chat_id, token = get_telegram_config()
    
    if not token or not chat_id:
        raise HTTPException(
            status_code=400, 
            detail="No hay configuración válida en la base de datos."
        )

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": "⚡ <b>¡Prueba de Conexión Exitosa!</b>\nEste es un mensaje de validación desde tu panel de Reportes.",
        "parse_mode": "HTML"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=10.0)
            
        if response.status_code != 200:
            return {"status": "error", "message": f"Telegram respondió: {response.text}"}
            
        return {"status": 200, "message": "Mensaje enviado"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de red: {str(e)}")
    
@router.post("/registrar_time")
def registrar_time(datos: AlertTimeSchema, user = Depends(obtener_usuario_actual)):
    try:
        registrar_alert_time(datos.time)
        return {"status": "success", "message": f"Tiempo actualizado a {datos.time}"}
    except Exception:
        raise HTTPException(status_code=500, detail="Error interno al registrar el tiempo")


@router.get("/ver_time")
def ver_time(user = Depends(obtener_usuario_actual)):
    try:
        registros = view_alert()
        
        if registros is None:
            return {"status": 404, "message": "No hay registros disponibles"}
            
        return {
            "status": 200, 
            "message": "Registros recuperados con éxito",
            "data": registros
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Error interno al registrar el tiempo")
    