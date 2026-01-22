# controller/ping.py
import os
import platform
import requests
from datetime import datetime
from model.ip_model import SessionLocal, ConfigPing

CHAT_ID = "5909631520" 
TOKEN = "8593251070:AAG_nx3e_8fzVQAG3YQD4d_kPxx6lTkX9Ws"

def enviar_telegram(mensaje):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    requests.post(url, data={"chat_id": CHAT_ID, "text": mensaje, "parse_mode": "HTML"})

def run_ping_check(historial_referencia):
    db = SessionLocal()
    try:
        ips_db = db.query(ConfigPing).all()
        resultados_ahora = []
        
        # Agrupamos los resultados por categoría en un diccionario
        categorias = {}
        for registro in ips_db:
            param = "-n 1 -w 1000" if platform.system().lower() == "windows" else "-c 1 -W 1"
            response = os.system(f"ping {param} {registro.ip}")
            estado = "Online" if response == 0 else "Offline"
            
            res_data = {
                "name": registro.name,
                "ip": registro.ip,
                "status": estado,
                "categoria": registro.categoria # Obtenemos la categoría de la DB
            }
            resultados_ahora.append(res_data)
            
            # Clasificar para el reporte
            cat_nombre = registro.categoria.upper()
            if cat_nombre not in categorias:
                categorias[cat_nombre] = []
            categorias[cat_nombre].append(res_data)

        # Construir el cuerpo del mensaje tal cual lo pediste
        reporte_texto = f"📊 <b>REPORTE DE INFRAESTRUCTURA</b>\n"
        reporte_texto += f"📅 {datetime.now().strftime('%d/%m/%Y')} | ⏰ {datetime.now().strftime('%I:%M %p')}\n"
        reporte_texto += "--------------------------------\n\n"

        for cat, items in categorias.items():
            reporte_texto += f"🌐 <b>{cat}</b>\n"
            reporte_texto += "--------------------------------\n"
            for item in items:
                icon = "✅" if item['status'] == "Online" else "❌"
                reporte_texto += f"{icon} {item['name']} ({item['ip']})\n"
            reporte_texto += "\n"

        historial_referencia.clear()
        historial_referencia.extend(resultados_ahora)
        
        enviar_telegram(reporte_texto)
        
    finally:
        db.close()