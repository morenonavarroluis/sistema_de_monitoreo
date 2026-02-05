import paramiko
import time
import re
from model.ip_model import Clearport, SessionLocal


db = SessionLocal()

def get_all_clearports():
    db = SessionLocal()
    try:
        clearports = db.query(Clearport).all()
        return clearports
    except Exception as e:
        print(f"Error al obtener registros: {e}")
        raise e
    finally:        
        db.close()

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
def register_port_clear(ip, nombre, user_ip, pass_ip, description=""):
    db = SessionLocal()
    try:
        nuevo_registro = Clearport(
            ip_port=ip,
            nombre=nombre,
            user_ip=user_ip,
            pass_ip=pass_ip,
            description=description
        )
        db.add(nuevo_registro)
        db.commit()
        db.refresh(nuevo_registro) # Opcional: para tener el ID generado
        print(f"Registro de limpieza de puerto guardado para {ip}")
        return nuevo_registro
    except Exception as e:
        db.rollback() # Si hay error, deshace los cambios
        print(f"Error al registrar: {e}")
        raise e
    finally:
        db.close()
    
if __name__ == "__main__":
   
    dispositivos = get_all_clearports()
    
    if not dispositivos:
        print("No se encontraron dispositivos en la base de datos.")
    
    for dispositivo in dispositivos:
        # Usamos los atributos del modelo: ip_port, user_ip y pass_ip
        print(f"\n--- Iniciando proceso en: {dispositivo.nombre} ({dispositivo.ip_port}) ---")
        
        exito = test_ssh_connection(
            hostname=dispositivo.ip_port, 
            username=dispositivo.user_ip, 
            password=dispositivo.pass_ip
        )
        
        if exito:
            log_message(dispositivo.ip_port, "Proceso completado con éxito.")
        else:
            log_message(dispositivo.ip_port, "El proceso falló.")