from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base, engine, SessionLocal

# --- CATEGORÍAS E IPs ---
class Categoria(Base):
    __tablename__ = "categoria"
    id_categoria = Column(Integer, primary_key=True, index=True)
    nombre_categoria = Column(String(100), nullable=False)
    
    ips = relationship("ConfigPing", back_populates="categoria_rel")

class ConfigPing(Base):
    __tablename__ = "ip"
    id_ip = Column(Integer, primary_key=True, index=True)
    ip = Column(String(200), nullable=False)
    name = Column(String(200), nullable=True)
    id_categoria = Column(Integer, ForeignKey("categoria.id_categoria"), nullable=False)
    
    categoria_rel = relationship("Categoria", back_populates="ips")

# --- USUARIOS Y ROLES ---

class RolPermiso(Base):
    __tablename__ = "rol_permisos"
    id_rol_permiso = Column(Integer, primary_key=True, index=True)
    id_rol = Column(Integer, ForeignKey("roles.id_rol"), nullable=False)
    id_permiso = Column(Integer, ForeignKey("permisos.id_permiso"), nullable=False)

class Rol(Base):
    __tablename__ = "roles"
    id_rol = Column(Integer, primary_key=True, index=True)
    nombre_rol = Column(String(100), nullable=False)
    
    usuarios = relationship("Usuario", back_populates="rol")
    
    # RELACIÓN CLAVE: Permite acceder a los permisos directamente
    # mi_rol.permisos -> devolverá una lista de objetos Permiso
    permisos = relationship("Permiso", secondary="rol_permisos", back_populates="roles")

class Permiso(Base):
    __tablename__ = "permisos"
    id_permiso = Column(Integer, primary_key=True, index=True)
    nombre_permiso = Column(String(100), nullable=False)
    
    roles = relationship("Rol", secondary="rol_permisos", back_populates="permisos")

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    usuario = Column(String(100), unique=True, index=True)
    password = Column(String(255)) # TIP: Usa 255 para hashes de contraseñas
    gmail = Column(String(100), unique=True, index=True)
    id_rol = Column(Integer, ForeignKey("roles.id_rol"), nullable=False)
    
    rol = relationship("Rol", back_populates="usuarios")

# --- OTRAS TABLAS (Sin cambios) ---
class Clearport(Base):
    __tablename__ = "clearport"
    id = Column(Integer, primary_key=True, index=True)
    ip_port = Column(String(100), nullable=False)
    nombre = Column(String(100), nullable=False)
    user_ip = Column(String(100), nullable=False)
    pass_ip = Column(String(100), nullable=False)
    description = Column(String(200), nullable=True)

class Boot(Base):
    __tablename__ = "boot"
    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(String(100), nullable=False)
    token = Column(String(200), nullable=False)

class Alert(Base):
    __tablename__ = "alert"
    id_time = Column(Integer, primary_key=True, index=True)
    time = Column(String(100), nullable=False)

Base.metadata.create_all(bind=engine)