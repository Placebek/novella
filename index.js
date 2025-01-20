const app = require('./app');
const http = require('http');
const WebSocket = require('ws');

const PORT = 8080;
const HOST = '172.20.10.4';

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    clients.push(ws);

    ws.on('message', (message) => {
        console.log('Received from client:', message);
    });

    ws.on('close', () => {
        console.log('Connection closed');
        clients = clients.filter(client => client !== ws);
    });
});

const sendToClients = (message) => {
    console.log('Sending message to clients:', message);
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message }));
        }
    });
};

server.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

module.exports = { sendToClients };
