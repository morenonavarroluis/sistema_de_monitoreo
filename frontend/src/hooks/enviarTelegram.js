import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

export function useProbarbot() {
    const [horasdata, setData] = useState([]);
    const [botloading, setLoading] = useState(false);

    // 1. Ver Horas (GET)
    // Usamos useCallback para que la función sea estable si se usa en dependencias
    const verHoras = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/bot/ver_time');
            // Accedemos a response.data.data según tu estructura de FastAPI
            setData(response.data.data || []);
        } catch (error) {
            console.error("Error al cargar horas:", error);
            // No siempre es necesario un Swal para un simple fetch de carga, 
            // pero lo dejamos por consistencia con tu código
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. Enviar Prueba (POST)
    const enviarPruebaTelegram = async () => {
        try {
            const response = await api.post('/bot/send-test-telegram');
            if (response.status === 200) {
                Swal.fire({
                    title: "Prueba Exitosa",
                    text: "¡Mensaje de validación enviado correctamente!",
                    icon: "success",
                    confirmButtonColor: '#10B981' // Color verde Tailwind
                });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error de conexión con el servidor";
            Swal.fire({
                title: "Error",
                text: errorMsg,
                icon: "error",
                confirmButtonColor: '#EF4444' // Color rojo Tailwind
            });
            console.error("Test Error:", error);
        }
    };

    // Carga automática al montar el componente
    useEffect(() => {
        verHoras();
    }, [verHoras]);

    return { 
        horasdata, 
        botloading, // ← Exportamos esto para el feedback visual en el Select
        enviarPruebaTelegram, 
        verHoras 
    };
}