from pydantic import BaseModel
from typing import Optional

class UserSchema(BaseModel):
    nombre: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
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