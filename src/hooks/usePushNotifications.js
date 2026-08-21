import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';

const BASE_URL = import.meta.env.VITE_API_URL;

export function usePushNotifications() {
    useEffect(() => {
        // Pedimos permisos para recibir notificaciones push
        PushNotifications.requestPermissions().then(result => {
            if (result.receive === 'granted') {
                PushNotifications.register();
            }
        });

        // Cuando obtenemos el token, mandarlo al backend
        PushNotifications.addListener('registration', async (token) => {
            console.log('Token FCM:', token.value);
            await fetch(`${BASE_URL}/dispositivos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token.value }),
            });
        });

        // Cuando llega una notificación con la app abierta
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Notificación recibida:', notification);
        });

        return () => {
            PushNotifications.removeAllListeners();
        };
    }, []);
}