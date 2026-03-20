import { useState, useEffect } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
export function User() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await api.get('/auth/view_user');
      const actualUsers = response.data.data || []; 
      console.log('Usuarios obtenidos:', actualUsers);
      setData(actualUsers);
    } catch (error) {
      console.error('Error en GET:', error);
    }
  };

  const registrarUsuario = async (userData) => {
    try {
      const response = await api.post('/auth/register_user', userData);
      Swal.fire('Éxito', response.data.message || 'Usuario registrado correctamente', 'success');
      await fetchData(); 
    } catch (error) {
      console.error('Error en POST:', error);
      Swal.fire('Error', error.response?.data?.message || 'Error al registrar usuario', 'error');
    }
  };


  

  useEffect(() => { fetchData(); }, []);
 return { data,registrarUsuario, loading };
}