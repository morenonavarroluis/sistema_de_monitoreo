from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base, engine, SessionLocal

# --- TABLAS DE CATEGORÍAS E IPs ---
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

# --- TABLAS DE USUARIOS Y ROLES ---
# Definimos Rol PRIMERO y con nombre estándar (Rol)
class Rol(Base):
    __tablename__ = "roles"
    id_rol = Column(Integer, primary_key=True, index=True)
    nombre_rol = Column(String(100), nullable=False)
    
    # Apunta a la clase "Usuario"
    usuarios = relationship("Usuario", back_populates="rol")

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    usuario = Column(String(100), unique=True, index=True)
    password = Column(String(100)) 
    gmail = Column(String(100), unique=True, index=True)
    id_rol = Column(Integer, ForeignKey("roles.id_rol"), nullable=False)
    
    # Ahora coincide con el nombre de la clase de arriba: "Rol"
    rol = relationship("Rol", back_populates="usuarios")

# --- OTRAS TABLAS ---
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

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)