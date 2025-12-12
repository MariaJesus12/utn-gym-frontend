import { useEffect, useRef, useState } from 'react';

interface UseWebSocketOptions {
    url: string;
    onMessage?: (data: any) => void;
    onError?: (error: Event) => void;
    onOpen?: () => void;
    onClose?: () => void;
    autoReconnect?: boolean;
    reconnectInterval?: number;
}

export const useWebSocket = ({
    url,
    onMessage,
    onError,
    onOpen,
    onClose,
    autoReconnect = true,
    reconnectInterval = 5000,
}: UseWebSocketOptions) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const connect = () => {
        try {
            console.log('🔌 Conectando a WebSocket:', url);
            const ws = new WebSocket(url);

            ws.onopen = () => {
                console.log('✅ WebSocket conectado');
                setIsConnected(true);
                onOpen?.();
            };

            ws.onmessage = (event) => {
                console.log('📨 Mensaje recibido:', event.data);
                try {
                    const data = JSON.parse(event.data);
                    setLastMessage(data);
                    onMessage?.(data);
                } catch (e) {
                    // Si no es JSON, enviar el mensaje tal cual
                    setLastMessage(event.data);
                    onMessage?.(event.data);
                }
            };

            ws.onerror = (error) => {
                console.error('❌ Error en WebSocket:', error);
                setIsConnected(false);
                onError?.(error);
            };

            ws.onclose = () => {
                console.log('🔌 WebSocket desconectado');
                setIsConnected(false);
                onClose?.();

                // Auto-reconectar si está habilitado
                if (autoReconnect) {
                    console.log(`🔄 Reconectando en ${reconnectInterval / 1000} segundos...`);
                    
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                }
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('❌ Error al conectar WebSocket:', error);
            setIsConnected(false);
        }
    };

    const disconnect = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
    };

    const sendMessage = (message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const data = typeof message === 'string' ? message : JSON.stringify(message);
            wsRef.current.send(data);
            console.log('📤 Mensaje enviado:', data);
        } else {
            console.warn('⚠️ WebSocket no está conectado');
        }
    };

    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, [url]);

    return {
        isConnected,
        lastMessage,
        sendMessage,
        disconnect,
        reconnect: connect,
    };
};
