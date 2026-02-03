from model.ip_model import SessionLocal, Usuario

db = SessionLocal()

def login_usuario(email: str, password: str):
    try:
        usuario = db.query(Usuario).filter(Usuario.email == email, Usuario.password == password).first()
        if usuario:
            return {"status": "success", "message": "Login successful", "user": usuario.nombre}
        else:
            return {"status": "error", "message": "Invalid email or password"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()
     
