import { useState, useEffect } from 'react';
import api from '../services/api';

export function useIpsUser() {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);

  // 1. Definimos la función para traer datos
  const fetchData = async () => {
    try {
      const response = await api.get('ports/view_clearports');
      setData(response.data);
    } catch (error) {
      console.error('Error en GET:', error);
    }
  };

  // 2. Definimos la función para registrar
  const registrarNuevaIp = async (datosFormulario) => {
  setLoading(true);
  try {
    

    const response = await api.post('ports/registrar_ports_db', { 
      ...datosFormulario,
      
    });
    
    // 2. Usamos un mensaje más descriptivo si el backend lo envía
    alert(response.data.message || "¡Dispositivo registrado con éxito!");
    
    // 3. Refrescar la tabla
    if (fetchData) await fetchData(); 
    
    return true;
  } catch (error) {
    // 4. LOG DETALLADO: Esto te dirá exactamente qué campo falló en la base de datos
    const serverError = error.response?.data?.detail;
    console.error("Error del servidor:", serverError || error.message);
    
    // Si el error es un array (común en FastAPI), lo convertimos a texto
    const errorMsg = Array.isArray(serverError) 
      ? serverError.map(e => `${e.loc[1]}: ${e.msg}`).join(", ")
      : "Error interno del servidor (500)";

    alert(`Error al registrar: ${errorMsg}`);
    return false;
  } finally {
    setLoading(false);
  }
};

const EditarSwitch = async (datosFormulario) => {
  setLoading(true);
  try {
    // 1. Extraemos el ID del objeto. 
    // Asegúrate de que el backend te envíe el 'id' cuando haces el GET inicial.
    const { id } = datosFormulario; 

    if (!id) {
      alert("Error: No se encontró el ID del registro para actualizar");
      return false;
    }

    // 2. Construimos la URL dinámica: ports/update_clearport/48
    const response = await api.put(`ports/update_clearport/${id}`, { 
      ip_port: datosFormulario.ip_port,
      nombre: datosFormulario.nombre,
      user_ip: datosFormulario.user_ip,
      pass_ip: datosFormulario.pass_ip,
      description: datosFormulario.description
    });
    
    alert(response.data.message || "¡Dispositivo actualizado!");
    if (fetchData) await fetchData(); 
    return true;

  } catch (error) {
    console.error("Error al actualizar:", error.response?.data || error.message);
    alert("Error al actualizar el registro en el servidor");
    return false;
  } finally {
    setLoading(false);
  }
};

const eliminarIp = async (id) => {
  // Una confirmación simple antes de borrar
  if (!window.confirm("¿Estás seguro de que deseas eliminar este dispositivo?")) return;

  setLoading(true);
  try {
    // Usamos el método DELETE y el ID en la URL
    const response = await api.delete(`ports/delete_clearport/${id}`);
    
    alert(response.data.message || "Eliminado correctamente");
    
    // Refrescamos la lista para que desaparezca de la tabla
    if (fetchData) await fetchData();
    return true;
  } catch (error) {
    console.error("Error al eliminar:", error.response?.data || error.message);
    alert("No se pudo eliminar el registro");
    return false;
  } finally {
    setLoading(false);
  }
};


  // 3. Cargamos los datos al iniciar
  useEffect(() => { 
    fetchData(); 
  }, []);

  // 4. EL RETURN: Aquí es donde fallaba si 'data' no estaba definida
  return { data, registrarNuevaIp,EditarSwitch,eliminarIp, loading };
}