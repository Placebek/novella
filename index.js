const app = require('./app');
const http = require('http');
const WebSocket = require('ws');
const notificationQueue = require('./app/jobs/notificationQueue');
const User = require('./app/models/userModel');
const UserToGpt = require('./app/models/user_to_gptModel');
const sequelize = require('./app/config/db');

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
    console.log('Checking for new UserToGpt activity...');

    const latestEntry = await UserToGpt.findOne({
        order: [['createdAt', 'DESC']],
    });

    const now = new Date();
    if (latestEntry) {
        const lastActivity = new Date(latestEntry.createdAt);
        const diffInMinutes = Math.floor((now - lastActivity) / 60000);

        if (diffInMinutes >= 5 && !notificationSent) {
            console.log(`No new activity for 5+ minutes. Sending notifications...`);
            const users = await User.findAll();

            for (const user of users) {
                const ws = clients.get(user.id.toString());
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(
                        JSON.stringify({
                            message: `Сізді қызықты новеллаңыз күтіп тұр! Қайда жүрсің бауырым?`,
                        })
                    );
                }
            }
            notificationSent = true; 
        } else if (diffInMinutes < 5) {
            notificationSent = false; 
        }
    } else if (!notificationSent) {
        console.log('No records found in UserToGpt table. Sending notifications...');
        const users = await User.findAll();

        for (const user of users) {
            const ws = clients.get(user.id.toString());
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(
                    JSON.stringify({
                        message: `Привет, ${user.username}! В таблице UserToGpt пока нет записей.`,
                    })
                );
            }
        }
        notificationSent = true; 
    }

    return { status: 'Activity check completed' };
});

server.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);

    setInterval(() => {
        notificationQueue.createJob({}).save();
        console.log('Notification job added to queue.');
    },    30 * 1000);
});
