from pydantic import BaseModel
from typing import Optional

class UserSchema(BaseModel):
    usuario: str
    password: str

class PersonaSchema(BaseModel):
       usuario: str
       password: str
       nombre: str
       gmail: str
       roles: int
       activo: int = 1

class UserLogin(BaseModel):
    usuario: str
    password: str

class IpPortSchema(BaseModel):
    ip_port: str
    nombre: str
    user_ip: str
    pass_ip: str
    description: Optional[str] = ""

class BootSchema(BaseModel):
    token: str
    chat_id: str
    
class AlertTimeSchema(BaseModel):
    time: int