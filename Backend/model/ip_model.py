from sqlalchemy import Column, Integer, String, create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,relationship

# 1. URL corregida: usuario:password@host:puerto/nombre_base_de_datos
# Asegúrate de que 'config_ping' sea el nombre de tu DB en phpMyAdmin
SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root:123456@localhost:3306/config_ping"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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


Base.metadata.create_all(bind=engine)