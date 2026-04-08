import { useEffect, useRef } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

export function useWebSocket(onMessage) {
    const onMessageRef = useRef(onMessage);

    // Actualizamos la referencia a onMessage cada vez que cambie
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);

        // Cuando llegue un mensaje, parseamos el json y llamamos a onMessage con los datos
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessageRef.current(data); // Usamos la referencia actualizada a onMessage
            } catch (error) {
                console.error('Error al parsear mensaje del WebSocket:', error);
            }
        };

        // Cuando haya un error lo mostramos en consola
        ws.onerror = (error) => {
            console.error('Error en la conexión WebSocket:', error);
        };

        // Limpiamos la conexión al desmontar el componente
        return () => ws.close();
    }, []); // Array vacío para que solo se ejecute una vez al montar el componente
}