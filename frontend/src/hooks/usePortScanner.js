import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';
export const usePortScanner = () => {
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentDevice, setCurrentDevice] = useState("");

    const startScanning = useCallback((specificIp = null) => {
        setLoading(true);
        setProgress(0);
        setLog([]);
        
        // 1. Obtener el token del almacenamiento local
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/';
        
        const ipValue = (specificIp && typeof specificIp === 'string') ? specificIp : null;

        // 2. Construir la URL incluyendo el token como query param (?token=...)
        // Esto es necesario porque EventSource no permite enviar headers de Authorization
        let url = ipValue 
            ? `${baseUrl}ports/limpiar_ports/${ipValue}`
            : `${baseUrl}ports/limpiar_ports`;
        
        // Añadimos el token a la URL
        const endpoint = `${url}?token=${token}`;

        const eventSource = new EventSource(endpoint);
        
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.error) {
                eventSource.close(); // Cerramos el stream inmediatamente
                setLoading(false);
                
               Swal.fire({
                        title: "Fallo de Conexión",
                        text: `Error en ${data.ip || 'el dispositivo'}: ${data.error}`,
                        icon: "error",
                        confirmButtonColor: "#d33",
                        confirmButtonText: "Entendido",
                        footer: '<span style="color: #666">Verifica las credenciales o el acceso por puerto 22</span>'
                    }).then((result) => {
                        // Esto se ejecuta SOLO cuando el usuario cierra la alerta
                        if (result.isConfirmed) {
                            window.location.reload(); 
                        }
                    });
             return;
            }
            setProgress(data.progress);
            setCurrentDevice(data.nombre);
            if (data.progress === 100) {
                    eventSource.close();
                    setLoading(false);
                    
                    Swal.fire({
                        title: "¡Proceso Completado!",
                        text: `Se ha limpiado el puerto de ${data.nombre} correctamente.`,
                        icon: "success",
                        timer: 3000
                    });
                }
        };

        eventSource.onerror = (err) => {
            console.error("EventSource falló. Probablemente error de token o conexión.");
            eventSource.close();
            setLoading(false);
        };
    }, []);

    return { progress, log, loading, currentDevice, startScanning };
};