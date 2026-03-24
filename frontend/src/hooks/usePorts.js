import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext'; // Importamos el motor de permisos

export function usePorts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { hasPermission, user } = useAuth(); // Extraemos las herramientas de Auth

  // 1. Traer datos (Solo si tiene permiso 'ver_ip')
  const fetchData = useCallback(async () => {
    if (!hasPermission('ver_ip')) return; 

    try {
      const response = await api.get('/ports/view_clearports');
      setData(response.data);
    } catch (error) {
      console.error('Error en GET:', error.response?.data?.detail || error.message);
    }
  }, [hasPermission]);

  // 2. Limpieza Masiva (Permiso: 'limpiar_ports')
  const clearPorts = async () => {
    if (!hasPermission('limpiar_ports')) {
      return Swal.fire("Acceso Denegado", "No tienes permiso para limpiar todos los puertos", "error");
    }

    setLoading(true);
    try {
      // Tu backend usa GET para esta ruta según ports.py
      const response = await api.get('/ports/limpiar_ports');
      
      Swal.fire({
        title: "Proceso Iniciado",
        text: "La limpieza masiva está en curso...",
        icon: "info",
        confirmButtonColor: "#3b82f6"
      });
      
      await fetchData();
    } catch (error) {
       Swal.fire({
        title: "Error",
        text: error.response?.data?.detail || "Error en el servidor",
        icon: "error",
        confirmButtonColor: "#3b82f6"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 3. Limpieza Individual (Permiso: 'limpiar_port')
  const clearPortIndividual = async (ip) => {
    if (!hasPermission('limpiar_port')) {
      return Swal.fire("Acceso Denegado", "No tienes permiso para esta acción", "error");
    }

    setLoading(true);
    try {
      // IMPORTANTE: En ports.py esta ruta es @router.get("/limpiar_ports/{ip}")
      const response = await api.get(`/ports/limpiar_ports/${ip}`);
      
      Swal.fire({
        title: "¡Logrado!",
        text: `Limpieza ejecutada para ${ip}`,
        icon: "success",
        confirmButtonColor: "#3b82f6"
      });
      
      await fetchData();
    } catch (error) {
       Swal.fire({
        title: "Error",
        text: error.response?.data?.detail || "Dispositivo no alcanzable",
        icon: "error",
        confirmButtonColor: "#3b82f6"
      });
    } finally {
      setLoading(false);
    }
  };

  // Solo ejecutar fetchData cuando el usuario esté cargado
  useEffect(() => { 
    if (user) {
        fetchData(); 
    }
  }, [fetchData, user]);

  return { data, clearPorts, clearPortIndividual, loading, fetchData };
}