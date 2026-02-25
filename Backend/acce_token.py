from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from controller.login import SECRET_KEY, ALGORITHM
from model.ip_model import Usuario
from sqlalchemy.orm import Session
from dependencies import get_db
# Esto le dice a FastAPI dónde buscar el token (en el header Authorization)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def obtener_usuario_actual(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db) # Agregamos la DB
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar el token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
            
        # CAMBIO CLAVE: Buscamos el objeto completo en la DB
        user = db.query(Usuario).filter(Usuario.usuario == username).first()
        
        if user is None:
            raise credentials_exception
            
        return user # Ahora retornamos el objeto Usuario (con su id_rol, etc.)
    except JWTError:
        raise credentials_exception
    
    

# def requiere_permiso(permiso: str):
#     def permiso_checker(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
#         if not tiene_permiso(permiso, db, current_user.id):
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail=f"No tienes el permiso necesario: {permiso}"
#             )
#         return current_user
#     return permiso_checker