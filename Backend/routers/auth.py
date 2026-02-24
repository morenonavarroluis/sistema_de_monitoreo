from fastapi import APIRouter,status
from dependencies import get_db
from schemas.schemas import UserLogin, UserSchema
from controller.login import login_usuario
from controller.registrar_user import registrar_usuario, ver_usuarios, crud_eliminar_usuario
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from acce_token import obtener_usuario_actual

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/login")
async def usuario_login(datos: UserLogin):
    resultado = login_usuario(datos.usuario, datos.password)
    
    # Si login_usuario devuelve un error (según tu lógica previa)
    if resultado.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=resultado.get("message"),
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return resultado

@router.post("/user")
async def usuario_registro(datos: UserSchema):
    return registrar_usuario(datos)
@router.get("/view_user")
async def get_usuarios(user = Depends(obtener_usuario_actual)): 
    return ver_usuarios()

@router.delete("/user/{user_id}")
async def delete_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    # Llamamos a la lógica pasándole la sesión
    resultado = crud_eliminar_usuario(db, user_id)
    
    if resultado["status"] == "error":
        raise HTTPException(status_code=404, detail=resultado["message"])
        
    return resultado
    