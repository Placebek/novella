const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);

// WebSocket сервер
const wss = new WebSocket.Server({ server });

let clients = [];

// Когда новый клиент подключается
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    clients.push(ws);

    // Получение сообщения от клиента
    ws.on('message', (message) => {
        console.log('Received from client:', message);
    });

    // Закрытие соединения
    ws.on('close', () => {
        console.log('Connection closed');
        clients = clients.filter(client => client !== ws);
    });
});

// Функция отправки сообщений всем клиентам
const sendToClients = (message) => {
    clients.forEach((client) => {
        client.send(JSON.stringify({ message }));
    });
};

// Обработка POST-запроса от FastAPI
app.use(express.json());

app.post('/api/user_to_gpts/post/usertogpts', (req, res) => {
    const { variant, parent_id, request_id, variants } = req.body;

    // Обработка данных (например, сохранение в базу данных)

    // Отправка данных всем WebSocket клиентам (например, Flutter)
    sendToClients(`New UserToGpt created with variant: ${variant}`);

    res.status(201).json({ message: 'UserToGpt created successfully.' });
});

// Запуск HTTP сервера
server.listen(8080, '192.168.96.31', () => {
	console.log('Server running on http://192.168.96.31:8080')
})
