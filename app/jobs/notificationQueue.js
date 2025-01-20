const BeeQueue = require('bee-queue');

const redisConfig = { redis: { host: '127.0.0.1', port: 6379 } };
const notificationQueue = new BeeQueue('notifications', redisConfig);

module.exports = notificationQueue;
