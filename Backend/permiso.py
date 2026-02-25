from fastapi import HTTPException, Depends, status
from model.ip_model import Usuario
from acce_token import obtener_usuario_actual

def tiene_permiso(permiso_requerido: str):
    def verificador(user: Usuario = Depends(obtener_usuario_actual)):
        # Extraemos los nombres de los permisos del rol del usuario
        permisos_del_usuario = [p.nombre_permiso for p in user.rol.permisos]
        
        if permiso_requerido not in permisos_del_usuario:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"No tienes el permiso necesario: {permiso_requerido}"
            )
        return user
    return verificador