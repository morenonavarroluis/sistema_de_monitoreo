# controller/usuario_controller.py
from model.ip_model import SessionLocal, Usuario

def registrar_usuario(nombre: str, email: str , password: str):
    db = SessionLocal()
    try:
        nuevo_usuario = Usuario(nombre=nombre, email=email , password=password)
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        return {"status": "success", "user": nuevo_usuario.nombre}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        db.close()


def ver_usuarios():
    db = SessionLocal()
    try:
        usuarios = db.query(Usuario).all()
        lista_usuarios = [{"id": user.id, "nombre": user.nombre, "email": user.email} for user in usuarios]
        return {"status": "success", "usuarios": lista_usuarios}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()