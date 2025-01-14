// server.js
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server running\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    // Отправка сообщения на подключенного клиента
    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

    // Обработка входящих сообщений от клиента
    ws.on('message', (message) => {
        console.log('Received from client:', message);
        // Ответ на сообщение
        ws.send(JSON.stringify({ message: `Received: ${message}` }));
    });

    // Обработка закрытия соединения
    ws.on('close', () => {
        console.log('Connection closed');
    });
});

// Запуск сервера на порту 8080
server.listen(8080, () => {
    console.log('WebSocket server is running on http://localhost:8080');
});
