import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext'; // <--- IMPORTANTE

export function useIpsUser() {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const { hasPermission, user } = useAuth(); // <--- Obtenemos la función de permisos

  // 1. Traer datos (Solo si tiene permiso 'ver_ip')
  const fetchData = useCallback(async () => {
    if (!hasPermission('ver_ip')) return; // Bloqueo preventivo en el front
    
    try {
      const response = await api.get('ports/view_clearports');
      setData(response.data);
    } catch (error) {
      console.error('Error en GET:', error.response?.data?.detail || error.message);
    }
  }, [hasPermission]);

  // 2. Registrar (Permiso: 'registrar_ip')
  const registrarNuevaIp = async (datosFormulario) => {
    if (!hasPermission('registrar_ip')) {
      alert("No tienes permiso para registrar dispositivos");
      return false;
    }
    
    setLoading(true);
    try {
      const response = await api.post('ports/registrar_ports_db', datosFormulario);
      alert(response.data.message || "¡Registrado!");
      await fetchData(); 
      return true;
    } catch (error) {
      alert(`Error: ${error.response?.data?.detail || "Error al registrar"}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 3. Editar (Permiso: 'actualizar_ip')
  const EditarSwitch = async (datosFormulario) => {
    if (!hasPermission('actualizar_ip')) {
      alert("No tienes permiso para editar");
      return false;
    }

    setLoading(true);
    try {
      const { id } = datosFormulario; 
      const response = await api.put(`ports/update_clearport/${id}`, datosFormulario);
      alert(response.data.message || "¡Actualizado!");
      await fetchData(); 
      return true;
    } catch (error) {
      alert("Error al actualizar");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 4. Eliminar (Permiso: 'eliminar_ip')
  const eliminarIp = async (id) => {
    if (!hasPermission('eliminar_ip')) {
      alert("No tienes permiso para eliminar");
      return false;
    }

    if (!window.confirm("¿Eliminar dispositivo?")) return;

    setLoading(true);
    try {
      const response = await api.delete(`ports/delete_clearport/${id}`);
      alert(response.data.message || "Eliminado");
      await fetchData();
      return true;
    } catch (error) {
      alert("No se pudo eliminar");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user) fetchData(); // Solo carga si hay un usuario logueado
  }, [fetchData, user]);

  return { data, registrarNuevaIp, EditarSwitch, eliminarIp, loading, fetchData };
}