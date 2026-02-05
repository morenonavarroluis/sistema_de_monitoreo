import { useState, useEffect } from 'react';
import api from '../services/api';

export function useIpsUser() {
  const [data, setData] = useState([]); // <--- Asegúrate de que esto exista
  const [loading, setLoading] = useState(false);

  // 1. Definimos la función para traer datos
  const fetchData = async () => {
    try {
      const response = await api.get('/view_clearports');
      setData(response.data);
    } catch (error) {
      console.error('Error en GET:', error);
    }
  };

  // 2. Definimos la función para registrar
  const registrarNuevaIp = async (datosFormulario) => {
    setLoading(true);
    try {
      // Enviamos el objeto completo (ip, usuario, etc.)
      const response = await api.post('/registrar_ports_db', { 
        ...datosFormulario, 
        accion: 'registrar' 
      });
      
      alert(response.data.message || "Registrado correctamente");
      await fetchData(); // Recargamos la lista después de registrar
      return true;
    } catch (error) {
      alert("Error al registrar");
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
  return { data, registrarNuevaIp, loading };
}