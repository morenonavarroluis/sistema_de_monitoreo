import paramiko
import time
import re

ips =['10.20.100.12','10.30.2.8','10.20.100.54','10.20.100.52']

HOST = ips 
USER = "M3rc@l"
PASS = "R3DM3RC@L22"

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

if __name__ == "__main__":
   for ip in HOST:
        print(f"\n--- Iniciando proceso en: {ip} ---")
        exito = test_ssh_connection(ip, USER, PASS)
        
        if exito:
            log_message(ip, "Proceso completado con éxito.")
        else:
            log_message(ip, "El proceso falló o fue incompleto.")