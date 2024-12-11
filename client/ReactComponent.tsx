import React, { useEffect } from 'react';
import useWebSocket from './useWebSocket';

type Message = {
  id: string;
  content: string;
};

const ReactComponent: React.FC = () => {
    // PARAM: --- url (string) url ของ websocket
  const { data, sendMessage, error, isOpen } = useWebSocket<Message>('ws://example.com/socket');

  useEffect(() => {
    if (data) {
      console.log('รับ message :', data);
    }
  }, [data]);

  const handleSendMessage = () => {
    // ?? ดั่งตัวอย่างข้างต้น ผมจะทำการส่ง id และ content เข้าไป ซึ่งทาง websocket ก็นำข้อมูลเหลานี้ไปทำ condition ต่อเพื่อส่งข้อมูลที่ฝั่ง client ต้องการกลับมา
    const message: Message = { id: '1', content: 'Hello, Server!' };
    sendMessage(message);
  };

  return (
    <div>
      <h1>WebSocket Example</h1>
      //TODO : ดักจับ error messages
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>{isOpen ? 'Connection Open' : 'Connection Closed'}</p>
      <button onClick={handleSendMessage}>Send Message</button>
      <div>
        <h2>Received Message:</h2>
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>No message received yet</p>}
      </div>
    </div>
  );
};

export default ReactComponent;
