from fastapi import APIRouter
from schemas.schemas import UserLogin, UserSchema
from controller.login import login_usuario
from controller.registrar_user import registrar_usuario, ver_usuarios

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/login")
async def usuario_login(datos: UserLogin):
    return login_usuario(datos.email, datos.password)

@router.post("/user")
async def usuario_registro(datos: UserSchema):
    return registrar_usuario(datos.nombre, datos.email, datos.password)

@router.get("/view_user")
async def get_usuarios(): 
    return ver_usuarios()