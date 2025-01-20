const app = require('./app');
const http = require('http');
const WebSocket = require('ws');
const notificationQueue = require('./app/jobs/notificationQueue');
const User = require('./app/models/userModel');

const PORT = 8080;
const HOST = '172.20.10.4';

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = new Map();

wss.on('connection', (ws, req) => {
    const userId = new URLSearchParams(req.url.split('?')[1]).get('userId');
    if (userId) {
        clients.set(userId, ws);
        console.log(`User ${userId} connected.`);
    }

    ws.on('close', () => {
        clients.delete(userId);
        console.log(`User ${userId} disconnected.`);
    });
});

notificationQueue.process(async (job) => {
    console.log('Processing notification job...');
    const users = await User.findAll();

    for (const user of users) {
        const ws = clients.get(user.id.toString());
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ message: `Hello, ${user.username}! Это уведомление.` }));
        }
    }

    return { status: 'Notifications sent to all users' };
});

server.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);

    setInterval(() => {
        notificationQueue.createJob({}).save();
        console.log('Notification job added to queue.');
    },   5 * 60 * 1000);
});
