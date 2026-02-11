import paramiko
import time
import re
from schemas.schemas import IpPortSchema
from model.ip_model import *
from dependencies import get_db
from fastapi import Depends
from sqlalchemy.orm import Session

def log_message(hostname, msg, **kwargs):
    """Versión que acepta argumentos extra sin fallar"""
    print(f"[{time.strftime('%H:%M:%S')}] SSH ({hostname}): {msg}")

def test_ssh_connection(hostname, username, password):
    client = None
    # Es buena práctica envolver todo en un try/except para capturar fallos de red
    try:
        log_message(hostname, "Intentando conectar...")
        
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        client.connect(
            hostname=hostname, 
            username=username, 
            password=password, 
            timeout=10 
        )
        log_message(hostname, "✅ Conexión establecida.")
        
        shell = client.invoke_shell()
        time.sleep(1) # Esperar a que el banner de bienvenida cargue
        
        commands = [
            "clear port-security all",
            "clear port-security sticky",
            "clear port-security dynamic",
            "clear port-security all"
        ]

        for command in commands:
            log_message(hostname, f"Enviando comando: '{command}'...")
            shell.send(command + "\n")
            
            # Esperamos un poco a que el dispositivo procese
            time.sleep(1.5)
            
            # Capturamos la salida
            current_output = ""
            if shell.recv_ready():
                current_output = shell.recv(65535).decode('utf-8', errors='ignore')
            
            log_message(hostname, f"Respuesta:\n{current_output.strip()}")
            
            # Lógica de confirmación (Uso de re.search directamente)
            if re.search(r'(confirm|continuar|\[Y/N\])', current_output, re.IGNORECASE):
                log_message(hostname, "Detectada solicitud de confirmación. Enviando 'Enter'...")
                shell.send("\n")
                time.sleep(1)
                if shell.recv_ready():
                    shell.recv(65535) # Limpiar buffer

        # Limpieza final de buffer y asegurar que los comandos se aplicaron
        for _ in range(3):
            shell.send("\n")
            time.sleep(0.3)

        log_message(hostname, f"✅ Limpieza de Port-Security finalizada.")
        return True

    except Exception as e:
        log_message(hostname, f"❌ Error: {str(e)}")
        return False
    finally:
        if client:
            client.close()
            
            
def register_port_clear(db: Session, datos: IpPortSchema):
    try:
        nuevo_registro = Clearport(
            ip_port=datos.ip_port,
            nombre=datos.nombre,
            user_ip=datos.user_ip,
            pass_ip=datos.pass_ip,
            description=datos.description
        )
        db.add(nuevo_registro)
        db.commit()
        db.refresh(nuevo_registro)
        return nuevo_registro
    except Exception as e:
        db.rollback()
        print(f"Error en la base de datos: {e}")
        raise e
            

def delete_port_clear(record_id: int, db):
    try:
        # 1. Buscamos el registro
        registro = db.query(Clearport).filter(Clearport.id == record_id).first()
        
        if registro:
            db.delete(registro)
            db.commit()
            # Es mejor devolver un diccionario simple o una respuesta FastAPI
            return {"status": 200, "message": f'Registro con ID {record_id} eliminado exitosamente.'}
        else:
            return {"status": 404, "message": f'No se encontró el registro con ID {record_id}.'}
            
    except Exception as e:
        db.rollback()
        print(f"Error al eliminar en controlador: {e}")
        raise e       



def actualizar_port_clear(id_port, datos, db): 

    db_item = db.query(Clearport).filter(Clearport.id == id_port).first()
    
    if not db_item:
        return {"error": "No encontrado"} 

    
    db_item.ip_port = datos.ip_port
    db_item.nombre = datos.nombre
    db_item.user_ip = datos.user_ip
    db_item.pass_ip = datos.pass_ip
    db_item.description = datos.description

    db.commit()
    db.refresh(db_item)
    return {"message": "Actualizado correctamente", "data": db_item}
    
