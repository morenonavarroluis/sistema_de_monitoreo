# controller/usuario_controller.py
from model.ip_model import SessionLocal, Usuario

def registrar_usuario(nombre: str, email: str, password: str):
    db = SessionLocal()
    try:
        # 1. Crear la instancia
        nuevo_usuario = Usuario(nombre=nombre, email=email, password=password)
        db.add(nuevo_usuario)
        
        # 2. Confirmar cambios
        db.commit()
        
        # 3. Refrescar para obtener el ID generado (opcional si solo devuelves el nombre)
        db.refresh(nuevo_usuario)
        
        return {
            "status": "success", 
            "message": "Usuario registrado correctamente",
            "user": {
                "id": nuevo_usuario.id,
                "nombre": nuevo_usuario.nombre,
                "email": nuevo_usuario.email
            }
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
            {"id": user.id, "nombre": user.nombre, "email": user.email} 
            for user in usuarios
        ]
        return {"status": "success", "data": lista_usuarios}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()