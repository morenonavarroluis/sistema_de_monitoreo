import { useState, useEffect } from 'react';
import api from '../services/api';

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
      alert(response.data.message);
      await fetchData();
    } catch (error) {
      alert("Error crítico: No hay conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return { data, clearPorts, loading };
}