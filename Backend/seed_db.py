from model.ip_model import SessionLocal, Rol, Permiso, RolPermiso, Usuario
import bcrypt

def seed_data():
    db = SessionLocal()
    try:
        # 1. Definir lista de todos los permisos necesarios para el sistema
        permisos_nombres = [
            "ver_usuarios",
            "registrar_usuarios",
            "eliminar_usuarios",
            "gestionar_puertos",
            "configurar_bot",
            "ver_reportes_ping"
        ]
        
        objetos_permisos = {}
        for nombre in permisos_nombres:
            permiso = db.query(Permiso).filter(Permiso.nombre_permiso == nombre).first()
            if not permiso:
                permiso = Permiso(nombre_permiso=nombre)
                db.add(permiso)
                db.flush() # Para obtener el ID sin cerrar la transacción
            objetos_permisos[nombre] = permiso

        # 2. Crear Roles (Admin y Operador)
        admin_rol = db.query(Rol).filter(Rol.nombre_rol == "Administrador").first()
        if not admin_rol:
            admin_rol = Rol(nombre_rol="Administrador")
            db.add(admin_rol)
            db.flush()

        # 3. Vincular TODOS los permisos al Rol Administrador
        for p in objetos_permisos.values():
            existe_vinculo = db.query(RolPermiso).filter_by(
                id_rol=admin_rol.id_rol, 
                id_permiso=p.id_permiso
            ).first()
            
            if not existe_vinculo:
                vinculo = RolPermiso(id_rol=admin_rol.id_rol, id_permiso=p.id_permiso)
                db.add(vinculo)

        # 4. Crear un Usuario Administrador inicial (opcional)
        user_admin = db.query(Usuario).filter(Usuario.usuario == "admin").first()
        if not user_admin:
            password_plano = "admin123".encode('utf-8')
            salt = bcrypt.gensalt()
            password_hasheada = bcrypt.hashpw(password_plano, salt).decode('utf-8')
            
            user_admin = Usuario(
                nombre="Administrador Sistema",
                usuario="admin",
                gmail="admin@sistema.com",
                password=password_hasheada,
                id_rol=admin_rol.id_rol
            )
            db.add(user_admin)

        db.commit()
        print("✅ Base de datos inicializada con éxito (Permisos, Roles y Admin).")

    except Exception as e:
        db.rollback()
        print(f"❌ Error al inicializar: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()