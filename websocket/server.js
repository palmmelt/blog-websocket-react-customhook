const http = require("http");
const WebSocketServer = require("websocket").server;
const WEBSOCKET_PORT = 3003;

// TODO: สร้าง HTTP server สำหรับรับคำขอจาก client
const server = http.createServer((req, res) => {
    console.log(`${new Date()} , Received request for Url : ${req.url}`);
    res.writeHead(404); 
    res.end();
});

// TODO: สร้าง WebSocket Server
const wsServer = new WebSocketServer({
    httpServer: server,  // ?? ใช้ server ที่สร้างขึ้น
    autoAcceptConnections: false,  // ไม่รับการเชื่อมต่อโดยอัตโนมัติ
});

// TODO: ฟังนี้เป็นการเชื่อมต่อที่พอร์ตที่กำหนดไว้ครับ เดิมทีแล้วอาจจะเก็บไว้ใน environment(ENV)
server.listen(WEBSOCKET_PORT, () => {
    console.log(`${new Date()} server is listening on port ${WEBSOCKET_PORT}`);
});

// TODO: เมื่อมีการเชื่อมต่อจาก client จะเกิดการ Handcheck ถ้าเรียกภาษาไทยก็จับมือค้างไว้เพื่อคุยกันได้แบบ realtime นั่นแหละครับ
wsServer.on("request", (request) => {
    // รับการเชื่อมต่อจาก client
    const connection = request.accept(null, request.origin);
    console.log(new Date() + " Connection accepted.");

    //TODO: เมื่อได้รับข้อความจาก client
    connection.on("message", async (message) => {
        if (message.type === "utf8") {
            // ? เมื่อได้รับข้อความแบบ UTF-8
            const payload = JSON.parse(message.utf8Data);
            // TODO: นำ payload ที่ได้รับไปใช้งาน เช่น ตรวจสอบ ID ของเครื่องจักร
            console.log("Received message:", payload);
            // EXAMPLE: หากต้องการดูข้อมูลเครื่องจักรจาก ID

            // const machineData = await getMachineData(payload.machineId);
            // connection.sendUTF(JSON.stringify(machineData));
              
        } else if (message.type === "binary") {
            // เมื่อได้รับข้อความแบบ binary
            console.log("Received binary message of " + message.binaryData.length + " bytes");
            // ส่งข้อมูล binary กลับไปยัง client
            connection.sendBytes(message.binaryData);
        }
    });

    // TODO: เมื่อการเชื่อมต่อถูกปิด หรือ Client disconnect
    connection.on("close", async (reasonCode, description) => {
        try {
            console.log(`${connection.id}: MQTT DISCONNECTED`);
        } catch (error) {
            console.error("Error during MQTT disconnect:", error);
            connection.sendUTF(JSON.stringify({ error: 'Failed to disconnect from MQTT' }));
        } finally {
            // ลบการเชื่อมต่อและทำความสะอาดทรัพยากร / clean
            console.log("clean connection")
            delete connection; 
        }
    });
});
