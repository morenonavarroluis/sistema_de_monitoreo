// usePortScanner.js
import { useState, useCallback } from 'react';

export const usePortScanner = () => {
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentDevice, setCurrentDevice] = useState("");

    // Añadimos specificIp como argumento
    const startScanning = useCallback((specificIp = null) => {
        setLoading(true);
        setProgress(0);
        setLog([]);
        
        const baseUrl = import.meta.env.VITE_API_URL;
        
        // Si specificIp es un objeto, lo ignoramos para evitar el error [object Object]
        const ipValue = (specificIp && typeof specificIp === 'string') ? specificIp : null;

        const endpoint = ipValue 
            ? `${baseUrl}limpiar_ports/${ipValue}`
            : `${baseUrl}limpiar_ports`;

        const eventSource = new EventSource(endpoint);
        
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.error) {
                eventSource.close();
                setLoading(false);
                return;
            }
            setProgress(data.progress);
            setCurrentDevice(data.nombre);
            if (data.progress === 100) {
                eventSource.close();
                setLoading(false);
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
            setLoading(false);
        };
    }, []);

    return { progress, log, loading, currentDevice, startScanning };
};