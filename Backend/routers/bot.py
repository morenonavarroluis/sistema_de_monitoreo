from fastapi import APIRouter
from schemas.schemas import BootSchema
from controller.ping import registrar_token

router = APIRouter(prefix="/bot", tags=["Configuración Bot"])

@router.post("/registrar_boot")
async def registrar_boot(datos: BootSchema):
    registrar_token(datos.token, datos.chat_id)
    return {"message": "Boot registrado exitosamente"}