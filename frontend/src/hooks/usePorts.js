import { useState, useEffect } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
export function usePorts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await api.get('view_clearports');
      setData(response.data);
    } catch (error) {
      console.error('Error en GET:', error);
    }
  };

  const clearPorts = async () => {
    setLoading(true);
    try {
      const response = await api.post('/limpiar_ports', { accion: 'limpiar' });
      
      // Alerta de éxito
      Swal.fire({
        title: "¡Logrado!",
        text: response.data.message,
        icon: "success",
        confirmButtonColor: "#3b82f6"
      });
      
      // alert(response.data.message);
      await fetchData();
    } catch (error) {

       Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#3b82f6"
      });

    } finally {
      setLoading(false);
    }
  };
  
  const clearPortIndividual = async (ip) => {
    setLoading(true);
    try {
      const response = await api.post(`/limpiar_ports/${ip}`, { accion: 'limpiar' });
      Swal.fire({
        title: "¡Logrado!",
        text: response.data.message,
        icon: "success",
        confirmButtonColor: "#3b82f6"
      });
      
      await fetchData();
    } catch (error) {
      
       Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#3b82f6"
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return { data, clearPorts, clearPortIndividual, loading };
}