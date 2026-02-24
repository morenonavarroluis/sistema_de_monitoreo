from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from model.ip_model import SessionLocal,Usuario
import os
import bcrypt
SECRET_KEY = os.getenv("SECRET_KEY", "tu_llave_super_secreta_aqui")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def login_usuario(usuario: str, password: str):
    db = SessionLocal()
    try:
        # 1. Buscar al usuario
        usuario_db = db.query(Usuario).filter(Usuario.usuario == usuario).first()
        print(f"Usuario encontrado: {usuario_db}") 

        # 1. Verificar si el usuario existe
        if not usuario_db:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario o contraseña incorrectos",
            )

        # 2. Validar la contraseña hasheada
        # Convertimos ambos a bytes para que bcrypt pueda compararlos
        password_valida = bcrypt.checkpw(
            password.encode('utf-8'),           # Contraseña plana que viene del login
            usuario_db.password.encode('utf-8') # Hash guardado en la DB
        )

        if not password_valida:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario o contraseña incorrectos",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # 3. Generar el Token
        # El campo "sub" (subject) suele llevar el identificador único (email o ID)
        access_token = create_access_token(data={"sub": usuario_db.usuario})

        # 4. Respuesta estándar de OAuth2
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user_name": usuario_db.nombre # Opcional, para tu frontend
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
