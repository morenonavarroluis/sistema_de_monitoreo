from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base, engine ,SessionLocal


# 2. Modelo de la tabla
class Categoria(Base):
    __tablename__ = "categoria"

    id_categoria = Column(Integer, primary_key=True, index=True)
    nombre_categoria = Column(String(100), nullable=False)

    # Relación inversa: Permite acceder a todas las IPs de una categoría
    # Ejemplo: mi_categoria.ips
    ips = relationship("ConfigPing", back_populates="categoria_rel")

class ConfigPing(Base):
    __tablename__ = "ip"

    id_ip = Column(Integer, primary_key=True, index=True)
    ip = Column(String(200), nullable=False)
    name = Column(String(200), nullable=True)
    
    # 1. Creamos la llave foránea que apunta al ID de la tabla categoria
    id_categoria = Column(Integer, ForeignKey("categoria.id_categoria"), nullable=False)

    # 2. Creamos la relación para acceder al objeto Categoria directamente
    # Ejemplo: mi_ip.categoria_rel.nombre_categoria
    categoria_rel = relationship("Categoria", back_populates="ips")

# 3. Forma correcta de crear las tablas

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100), index=True)


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