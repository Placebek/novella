const app = require('./app')
const http = require('http')
const WebSocket = require('ws')
const notificationQueue = require('./app/jobs/notificationQueue')
const User = require('./app/models/userModel')
const UserToGpt = require('./app/models/user_to_gptModel')
const sequelize = require('./app/config/db')

const PORT = 8080
const HOST = '192.168.96.31'

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

let clients = new Map()

wss.on('connection', (ws, req) => {
	const user_id = new URLSearchParams(req.url.split('?')[1]).get('user_id')
	if (user_id) {
		clients.set(user_id, ws)
		console.log(`User ${user_id} connected.`)
	}

	ws.on('close', () => {
		clients.delete(user_id)
		console.log(`User ${user_id} disconnected.`)
	})
})

notificationQueue.process(async job => {
	console.log('Checking for new UserToGpt activity...')
    
	const latestEntry = await UserToGpt.findOne({
		order: [['createdAt', 'DESC']],
	})

	const now = new Date()
	if (latestEntry) {
		const lastActivity = new Date(latestEntry.createdAt)
		const diffInMinutes = Math.floor((now - lastActivity) / 60000)

		if (diffInMinutes >= 1 && !notificationSent) {
			console.log(`No new activity for 5+ minutes. Sending notifications...`)
			const users = await User.findAll()
			for (const user of users) {
				const ws = clients.get(user.id.toString())
                console.log(clients, 'ws') 
                console.log('User id:', user.dataValues.id)

				if (ws && ws.readyState === WebSocket.OPEN) {
					ws.send(
						JSON.stringify({
							message: `Сізді қызықты новеллаңыз күтіп тұр! Қайда жүрсің бауырым?`,
						})
					)
                    console.log('Notification sent')
				}
			}
			notificationSent = true
		} else if (diffInMinutes < 1) {
			notificationSent = false
		}
	} else if (!notificationSent) {
		console.log('No records found in UserToGpt table. Sending notifications...')
		const users = await User.findAll()
        
		for (const user of users) {
			const ws = clients.get(user.id.toString())
			if (ws && ws.readyState === WebSocket.OPEN) {
				ws.send(
					JSON.stringify({
						message: `Привет, ${user.username}! В таблице UserToGpt пока нет записей.`,
					})
				)
			}
		}
		notificationSent = true
	}

	return { status: 'Activity check completed' }
})

server.listen(PORT, HOST, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`)

	setInterval(() => {
		notificationQueue.createJob({}).save()
		console.log('Notification job added to queue.')
	}, 30 * 1000)
})
