import { useEffect, useRef, useState, useCallback } from 'react';

type MessageType = 'auth' | 'answer_audio' | 'answer_text' | 'next_question' | 'end_session';

interface WebSocketMessage {
  type: MessageType;
  payload?: any;
}

export const useInterviewSocket = (sessionId: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    // Use relative path to take advantage of Vite proxy
    // If we are on https, use wss, else ws
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host; // e.g. localhost:5173
    // But our proxy is at /api, but WS proxying might need setup in Vite too!
    // Vite proxy supports ws: true.
    // The backend path is /interviews/ws.
    
    // NOTE: Vite proxy needs `ws: true` for websocket proxying.
    // We added proxy for `/api`. We should add proxy for `/interviews/ws` or just `/interviews`.
    // Backend `setupInterviewWebSocket` us path `/interviews/ws`.
    // So we should connect to `ws://${host}/interviews/ws` if proxy is set up.
    
    // Let's assume we will fix Vite config to proxy /interviews as well.
    const url = `${protocol}//${host}/interviews/ws`;
    
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WS Connected');
      setIsConnected(true);
      // Send auth
      ws.send(JSON.stringify({ type: 'auth', payload: { session_id: sessionId } }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (e) {
        console.error("WS Parse error", e);
      }
    };

    ws.onclose = () => {
      console.log('WS Closed');
      setIsConnected(false);
    };

    ws.onerror = (e) => {
      console.error('WS Error', e);
    };

    return () => {
      ws.close();
    };
  }, [sessionId]);

  const sendMessage = useCallback((type: MessageType, payload: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    } else {
        console.warn("WS not connected, cannot send message");
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
};
