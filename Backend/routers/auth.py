from fastapi import APIRouter
from dependencies import get_db
from schemas.schemas import UserLogin, UserSchema
from controller.login import login_usuario
from controller.registrar_user import registrar_usuario, ver_usuarios, crud_eliminar_usuario
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

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

@router.delete("/user/{user_id}")
async def delete_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    # Llamamos a la lógica pasándole la sesión
    resultado = crud_eliminar_usuario(db, user_id)
    
    if resultado["status"] == "error":
        raise HTTPException(status_code=404, detail=resultado["message"])
        
    return resultado
    