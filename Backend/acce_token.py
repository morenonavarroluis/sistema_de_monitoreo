from fastapi import Depends, HTTPException, status, Request # Importamos Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from controller.login import SECRET_KEY, ALGORITHM
from model.ip_model import Usuario
from sqlalchemy.orm import Session
from dependencies import get_db

# Añadimos auto_error=False para que no bloquee la petición si falta el header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

async def obtener_usuario_actual(
    request: Request, # Recibimos la petición para revisar los parámetros de la URL
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar el token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Lógica de recuperación de token híbrida
    final_token = token
    
    # Si no hay token en el header (caso de EventSource), lo buscamos en la URL (?token=...)
    if not final_token:
        final_token = request.query_params.get("token")

    if not final_token:
        raise credentials_exception

    try:
        payload = jwt.decode(final_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
            
        # Búsqueda del usuario en la base de datos
        user = db.query(Usuario).filter(Usuario.usuario == username).first()
        
        if user is None:
            raise credentials_exception
            
        return user 
    except JWTError:
        raise credentials_exception