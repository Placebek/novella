const BeeQueue = require('bee-queue');
const redis = require('redis');
const { sendToClients } = require('./index'); 

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379, 
});

const inactivityQueue = new BeeQueue('user-inactivity', {
    redis: {
        host: 'localhost',
        port: 6379,
    },
});

inactivityQueue.process(async (job) => {
    const { userId } = job.data;

    const user = await UserToGpt.findByPk(userId);
    if (user) {
        const lastActive = user.updatedAt;
        const now = new Date();
        const diffInMinutes = (now - new Date(lastActive)) / (1000 * 15);

        if (diffInMinutes >= 5) {
            sendToClients({ message: `Пользователь с ID ${userId} был неактивен в течение 5 минут.` });
        }
    }
});

module.exports = { inactivityQueue };
