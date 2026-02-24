from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from controller.login import SECRET_KEY, ALGORITHM

# Esto le dice a FastAPI dónde buscar el token (en el header Authorization)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def obtener_usuario_actual(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar el token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decodificamos el token usando tu SECRET_KEY
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario: str = payload.get("sub")
        if usuario is None:
            raise credentials_exception
        return usuario # Retornamos el usuario (puedes buscarlo en la DB si prefieres)
    except JWTError:
        raise credentials_exception