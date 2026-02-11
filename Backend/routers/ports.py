from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import json
from dependencies import get_db
from model.ip_model import Clearport
from schemas.schemas import IpPortSchema
from controller.port_clear import test_ssh_connection, register_port_clear,actualizar_port_clear,delete_port_clear

router = APIRouter(prefix="/ports", tags=["Gestión de Puertos"])

@router.get("/limpiar_ports")
async def port_clear_stream(db: Session = Depends(get_db)):
    def generate_progress():
        # Usamos la 'db' que viene por parámetro, no creamos SessionLocal() aquí
        try:
            dispositivos = db.query(Clearport).all()
            if not dispositivos:
                yield f"data: {json.dumps({'error': 'No hay IPs registradas'})}\n\n"
                return

            total = len(dispositivos)
            
            for index, equipo in enumerate(dispositivos):
                # OJO: test_ssh_connection suele ser síncrono. 
                # Si tienes muchos equipos, esto bloqueará el event loop.
                exito = test_ssh_connection(equipo.ip_port, equipo.user_ip, equipo.pass_ip)
                
                status = "OK" if exito else "Error"
                progreso = int(((index + 1) / total) * 100)

                payload = {
                    "progress": progreso,
                    "nombre": equipo.nombre,
                    "ip": equipo.ip_port,
                    "status": status,
                    "current": index + 1,
                    "total": total
                }
                
                yield f"data: {json.dumps(payload)}\n\n"
                
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        # No hace falta db.close() aquí porque Depends(get_db) lo hace por ti
        
    return StreamingResponse(generate_progress(), media_type="text/event-stream")

@router.get("/limpiar_ports/{ip}")
async def port_clear_individual(ip: str, db: Session = Depends(get_db)): 
    async def generate_event():
        try:
            equipo = db.query(Clearport).filter(Clearport.ip_port == ip).first()
            if not equipo:
                yield f"data: {json.dumps({'error': 'Dispositivo no encontrado'})}\n\n"
                return

            yield f"data: {json.dumps({'progress': 20, 'nombre': equipo.nombre, 'status': 'Iniciando SSH...'})}\n\n"
            
            exito = test_ssh_connection(equipo.ip_port, equipo.user_ip, equipo.pass_ip)
            
            status = "OK" if exito else "Error"
            payload = {
                "progress": 100,
                "nombre": equipo.nombre,
                "ip": equipo.ip_port,
                "status": status,
                "current": 1,
                "total": 1
            }
            yield f"data: {json.dumps(payload)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generate_event(), media_type="text/event-stream")

@router.post("/registrar_ports_db")
async def port_clear_db(datos: IpPortSchema, db: Session = Depends(get_db)):
    return register_port_clear(db, datos)


@router.get("/view_clearports")    
async def view_clearports(db: Session = Depends(get_db)):
    return db.query(Clearport).all()

@router.put("/update_clearport/{id}")
def update_clearport(id: int, datos: IpPortSchema, db: Session = Depends(get_db)):
    
    return actualizar_port_clear(id_port=id, datos=datos, db=db)

@router.delete("/delete_clearport/{id}")
def delete_port_endpoint(id: int, db: Session = Depends(get_db)):
    # Pasamos el id y la sesión db
    resultado = delete_port_clear(record_id=id, db=db)
    
    # Si el controlador devuelve un error, lo lanzamos como HTTPException
    if resultado.get("status") == 404:
        raise HTTPException(status_code=404, detail=resultado["message"])
        
    return resultado