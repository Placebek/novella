const BeeQueue = require('bee-queue')
const redis = require('redis')
const { sendToClients } = require('./index')

const redisClient = redis.createClient({
	host: 'localhost',
	port: 6379,
})

const inactivityQueue = new BeeQueue('user-inactivity', {
	redis: {
		host: 'localhost',
		port: 6379,
	},
})

inactivityQueue.process(async job => {
	const { userId } = job.data

	const user = await UserToGpt.findByPk(userId) // Предполагается, что UserToGpt - это ваша ORM модель.
	if (user) {
		const lastActive = user.updatedAt // Временная метка последней активности пользователя.
		const now = new Date()

		// Разница в минутах между текущим временем и последней активностью пользователя.
		const diffInMinutes = (now - new Date(lastActive)) / (1000 * 60)

		// Если прошло >= 1 минуты с последней активности.
		if (diffInMinutes >= 1) {
			sendToClients({
				message: `Пользователь с ID ${userId} был неактивен в течение 1 минуты.`,
			})
		}
	}
})

module.exports = { inactivityQueue }
