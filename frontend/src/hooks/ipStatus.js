import { useState, useEffect } from 'react';
import api from '../services/api';

export function IpStatus() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [configBot, setConfigBot] = useState(null);
  const [historialIps, setHistorialIps] = useState([]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/status');
        
        const dispositivos = response.data.dispositivos || [];
      const bot = response.data.config_bot || null;

      setData(dispositivos);
      setHistorialIps(dispositivos); 
      setConfigBot(bot);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchData(); }, []);
   
  
    const registrarBot = async (datosFormulario) => {
    setLoading(true);
    try {
      
      const response = await api.post('bot/registrar_boot', { 
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

  
  return { data, 
    fetchData, 
    configBot, 
    historialIps, 
    IpStatus,
    registrarBot,
    loading };
}