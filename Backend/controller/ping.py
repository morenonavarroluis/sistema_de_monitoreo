import subprocess
import platform
import requests
from datetime import datetime
from model.ip_model import SessionLocal, ConfigPing,Boot,Alert
from sqlalchemy.orm import joinedload 

# CHAT_ID = "5909631520" 
# TOKEN = "8593251070:AAG_nx3e_8fzVQAG3YQD4d_kPxx6lTkX9Ws"

def get_telegram_config():
    db = SessionLocal()
    try:
        boot_config = db.query(Boot).first()
        if boot_config and boot_config.chat_id and boot_config.token:
            return boot_config.chat_id, boot_config.token
        else:
            raise ValueError("Configuración de Telegram no encontrada en la base de datos.")
    except Exception as e:
        print(f"Error obteniendo configuración de Telegram: {e}")
        return None, None
    finally:
        db.close()


CHAT_ID, TOKEN = get_telegram_config()

if not TOKEN:
    print("⚠️ ¡Advertencia! No se pudo cargar la configuración de Telegram.")

def enviar_telegram(mensaje):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    try:
        requests.post(url, data={"chat_id": CHAT_ID, "text": mensaje, "parse_mode": "HTML"}, timeout=10)
    except Exception as e:
        print(f"Error enviando a Telegram: {e}")

def run_ping_check(historial_referencia):
    db = SessionLocal()
    try:
        # Usamos joinedload para traer la categoría de una sola vez
        ips_db = db.query(ConfigPing).options(joinedload(ConfigPing.categoria_rel)).all()
        
        resultados_ahora = []
        categorias = {}
        
        for registro in ips_db:
            # VALIDACIÓN CRÍTICA: Si la IP es None o vacía, saltar
            if not registro.ip or registro.ip.strip() == "":
                print(f"⚠️ Saltando ID {registro.id_ip}: Campo IP vacío en DB")
                continue

            # Configuración del comando según el OS
            if platform.system().lower() == "windows":
                comando = ["ping", "-n", "1", "-w", "1000", registro.ip.strip()]
            else:
                comando = ["ping", "-c", "1", "-W", "2", registro.ip.strip()]

            # Ejecutar ping sin mostrar salida en consola (capture_output=True)
            proceso = subprocess.run(comando, capture_output=True, text=True)
            
            # Código 0 es éxito (Online)
            estado = "Online" if proceso.returncode == 0 else "Offline"
            
            # Obtener nombre de categoría desde la relación
            nombre_cat = registro.categoria_rel.nombre_categoria if registro.categoria_rel else "SIN CATEGORÍA"
            
            res_data = {
                "name": registro.name or "Sin nombre",
                "ip": registro.ip,
                "status": estado,
                "categoria": nombre_cat
            }
            resultados_ahora.append(res_data)
            
            # Agrupar para el reporte
            cat_key = nombre_cat.upper()
            if cat_key not in categorias:
                categorias[cat_key] = []
            categorias[cat_key].append(res_data)

        # --- Construcción del Reporte ---
        reporte_texto = f"📊 <b>REPORTE DE INFRAESTRUCTURA</b>\n"
        reporte_texto += f"📅 {datetime.now().strftime('%d/%m/%Y')} | ⏰ {datetime.now().strftime('%I:%M %p')}\n"
        reporte_texto += "--------------------------------\n\n"

        for cat, items in categorias.items():
            reporte_texto += f"🌐 <b>{cat}</b>\n"
            for item in items:
                icon = "✅" if item['status'] == "Online" else "❌"
                reporte_texto += f"{icon} {item['name']} ({item['ip']})\n"
            reporte_texto += "\n"

        historial_referencia.clear()
        historial_referencia.extend(resultados_ahora)
        
        enviar_telegram(reporte_texto)
        print("✅ Chequeo completado y reporte enviado.")
        
    except Exception as e:
        print(f"❌ Error en run_ping_check: {e}")
    finally:
        db.close()


def registrar_token(token, chat_id):
    db = SessionLocal()
    try:
        boot_config = db.query(Boot).first()
        if not boot_config:
            boot_config = Boot(token=token, chat_id=chat_id)
            db.add(boot_config)
        else:
            boot_config.token = token
            boot_config.chat_id = chat_id
        db.commit()
        print("✅ Configuración de Telegram registrada/actualizada en DB.")
    except Exception as e:
        print(f"❌ Error registrando token en DB: {e}")
    finally:
        db.close()
        
def registrar_alert_time(time_int:int):
    db = SessionLocal()
    try:
        new_register = Alert(time=time_int)
        db.add(new_register)
        db.commit()
        print("Nuevo registro exitoso")
    except Exception as e:
        print(f"❌ Error registrando tiempo de alerta en DB: {e}")
    finally:
        db.close()

def view_alert():
    db =  SessionLocal()
    try:
       db = SessionLocal()
       try:
            
            registros = db.query(Alert).all()
            
            if not registros:
                return None
            return registros
       except Exception as e:
            print(f"Error al ver los registros: {e}")
            return None
       finally:
            db.close()
    except Exception as e:
        print(f"Error al ver los registros")
        
    