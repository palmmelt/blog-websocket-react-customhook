import { useState, useEffect, useRef } from 'react';

type WebSocketHookReturn<T> = {
  data: T | null;
  sendMessage: (message: T) => void;
  error: string | null;
  isOpen: boolean;
};

// PARAM: --- url (string) url ของ websocket
// EXAMPLE & RETURN: { data, sendMessage, error, isOpen } =  useWebSocket<Message>('ws://example.com/socket');
function useWebSocket<T>(url: string): WebSocketHookReturn<T> {

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // TODO: ใช้ useRef เพื่อให้อ้างอิง socketRef ได้ทุก conponent
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // TODO: สร้าง webSocket
    socketRef.current = new WebSocket(url);

    // TODO: เปิด connection 
    socketRef.current.onopen = () => {
      setIsOpen(true);
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (event) => {
      const message = event.data;
      try {
        // TODO: แปลง message
        const parsedMessage = JSON.parse(message);
        setData(parsedMessage);
      } catch (e) {
        setError('Error parsing message');
        console.error('Error parsing message:', e);
      }
    };

    // TODO: ดักจับ error ในกรณี websocket มีปัญหา
    socketRef.current.onerror = (event) => {
      setError('WebSocket error occurred');
      console.error('WebSocket error:', event);
    };

    // TODO: close connection
    socketRef.current.onclose = () => {
      setIsOpen(false);
      console.log('WebSocket connection closed');
    };

    // TODO: Cleanup ในกรณี conponent ที่ใช้ถูก unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]); // TODO: ทำงานอีกครั้งหาก url ถูกเปลี่ยน

  // TODO:ฟังชั่นส่ง message ไปยัง WebSocket
  const sendMessage = (message: T) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      setError('WebSocket is not open');
    }
  };

  return { data, sendMessage, error, isOpen };
}

export default useWebSocket;
