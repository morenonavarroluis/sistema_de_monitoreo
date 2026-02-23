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

  

  useEffect(() => { fetchData(); }, []);
 return { data, loading };
}