# controller/usuario_controller.py
from model.ip_model import SessionLocal, Usuario
from sqlalchemy.orm import Session
from schemas.schemas import UserSchema  
from passlib.context import CryptContext
import bcrypt # Asegúrate de tenerlo instalado (pip install bcrypt)

def registrar_usuario(datos: UserSchema):
    db = SessionLocal()
    try:
        # 1. Convertir la contraseña a bytes (necesario para bcrypt)
        password_plano = datos.password.encode('utf-8')
        
        # 2. Generar el hash directamente con bcrypt
        # Esto evita los errores internos de passlib
        salt = bcrypt.gensalt()
        password_hasheada = bcrypt.hashpw(password_plano, salt).decode('utf-8')

        # 3. Crear el usuario
        nuevo_usuario = Usuario(
            nombre=datos.nombre,
            gmail=datos.gmail,
            usuario=datos.usuario,
            id_rol=datos.roles,
            password=password_hasheada # Guardamos el string del hash
        )
        
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        
        return {
            "status": "success",
            "message": "Usuario registrado correctamente",
            "id": nuevo_usuario.id
        }
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": f"Error al registrar: {str(e)}"}
    finally:
        db.close()

def ver_usuarios():
    db = SessionLocal()
    try:
        usuarios = db.query(Usuario).all()
        # Convertimos los objetos de SQLAlchemy a una lista de dicts pura
        lista_usuarios = [
            {"id": user.id, "nombre": user.nombre,"usuario": user.usuario, "gmail": user.gmail, "roles": user.rol.nombre_rol , "permisos": [p.nombre_permiso for p in user.rol.permisos]} 
            for user in usuarios
        ]
        return {"status": "success", "data": lista_usuarios}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()

def crud_eliminar_usuario(db: Session, user_id: int):
    try:
        usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
        if not usuario:
            return {"status": "error", "message": "Usuario no encontrado"}
        
        db.delete(usuario)
        db.commit()
        return {"status": "success", "message": "Usuario eliminado"}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}