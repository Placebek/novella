const Request = require('../models/requestModel')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const axios = require('axios')
const upload = require('../config/multerConfig') // Multer upload
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg') // Fluent-ffmpeg for conversion
const UserToGpt = require('../models/user_to_gptModel')
const FormData = require('form-data') // Importing form-data package
const User = require('../models/userModel')

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const FASTAPI_USERNAME = process.env.FASTAPI_USERNAME
const FASTAPI_PASSWORD = process.env.FASTAPI_PASSWORD

// Function to convert the file to MP3 if it's not already in MP3 format
const convertToMP3 = (filePath, callback) => {
	const outputFilePath = path.join(
		'D:/Hackaton/story_crafter/express_js/novella/uploads',
		`${Date.now()}-converted.mp3`
	)

	ffmpeg(filePath)
		.toFormat('mp3')
		.on('end', () => {
			console.log(`File successfully converted to MP3: ${outputFilePath}`)
			fs.unlinkSync(filePath) // Remove the original file after conversion
			callback(null, outputFilePath) // Return the path of the new MP3 file
		})
		.on('error', err => {
			console.error('Error during conversion:', err.message)
			callback(err, null)
		})
		.save(outputFilePath)
}

// Middleware for file upload
exports.uploadFile = upload.single('mp3')

// Create a request
exports.createRequest = async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1]

	if (!token) {
		return res
			.status(401)
			.json({ message: 'Authentication token is required.' })
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET)

		if (!req.file) {
			return res.status(400).json({ message: 'MP3 file is required.' })
		}

		const mp3Path = req.file.path

		const processFile = async filePath => {
			const newRequest = await Request.create({
				mp3: filePath,
				text: null,
				title: null,
				user_id: decoded.id,
			})

			const formData = new FormData()
			formData.append('audio_file', fs.createReadStream(filePath))

			try {
				const fastApiResponse = await axios.post(
					'http://192.168.96.31:8000/novellas/mp3',
					formData,
					{
						headers: formData.getHeaders(),
						auth: {
							username: FASTAPI_USERNAME,
							password: FASTAPI_PASSWORD,
						},
					}
				)

				const { title, text, options } = fastApiResponse.data

				await newRequest.update({
					title,
					text,
				})

				if (options && Array.isArray(options)) {
					const variantsList = options.map(option => Object.values(option)[0])

					await UserToGpt.create({
						variants: variantsList.join(' | '),
						request_id: newRequest.id,
					})
				}

				return res.status(201).json({
					message: 'Request created and updated successfully.',
					request: newRequest,
					options,
				})
			} catch (fastApiError) {
				console.error('Error sending MP3 to FastAPI:', fastApiError.message)
				return res.status(500).json({
					message: 'Failed to process MP3 file with FastAPI.',
				})
			}
		}

		if (path.extname(mp3Path).toLowerCase() !== '.mp3') {
			convertToMP3(mp3Path, async (err, mp3FilePath) => {
				if (err) {
					return res
						.status(500)
						.json({ message: 'Error converting file to MP3.' })
				}
				await processFile(mp3FilePath)
			})
		} else {
			await processFile(mp3Path)
		}
	} catch (error) {
		console.error('Error creating request:', error)
		return res
			.status(500)
			.json({ message: 'Server error. Please try again later.' })
	}
}

// Get requests for the authenticated user
exports.getRequests = async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1]

	if (!token) {
		return res
			.status(401)
			.json({ message: 'Authentication token is required.' })
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET)
		const userId = decoded.id

		const requests = await Request.findAll({
			where: { user_id: userId },
			include: [
				{
					model: User,
					attributes: ['id', 'username', 'email'],
				},
			],
		})

		if (requests.length === 0) {
			return res
				.status(404)
				.json({ message: 'No requests found for this user.' })
		}

		return res.status(200).json({ requests })
	} catch (error) {
		console.error('Error fetching requests:', error.message)
		return res
			.status(500)
			.json({ message: 'Server error. Please try again later.' })
	}
}



exports.getUserToGptsByRequestId = async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'Authentication token is required.' });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const userId = decoded.id; 
		const { request_id } = req.params;

		if (!request_id) {
			return res.status(400).json({ message: 'Request ID is required.' });
		}

		const request = await Request.findOne({
			where: { id: request_id, user_id: userId },
		});

		if (!request) {
			return res.status(404).json({ message: 'Request not found or does not belong to the user.' });
		}

		const userToGpts = await UserToGpt.findAll({
			where: { request_id },
			attributes: ['id', 'variant', 'parent_id', 'createdAt', 'updatedAt'], 
		});

		if (userToGpts.length === 0) {
			return res.status(404).json({ message: 'No UserToGpt entries found for this request.' });
		}

		const response = {
			request: {
				id: request.id,
				title: request.title,
				text: request.text,
			},
			userToGpts,
		};

		return res.status(200).json(response);
	} catch (error) {
		console.error('Error fetching UserToGpt entries:', error.message);
		return res.status(500).json({ message: 'Server error. Please try again later.' });
	}
};


exports.getUnfinishedRequests = async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'Authentication token is required.' });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const userId = decoded.id;

		const unfinishedRequests = await Request.findAll({
			where: { user_id: userId, is_finished: false },
			attributes: ['id', 'mp3', 'text', 'title', 'is_activate', 'createdAt', 'updatedAt'], 
		});

		if (unfinishedRequests.length === 0) {
			return res.status(404).json({ message: 'No unfinished requests found for this user.' });
		}

		return res.status(200).json({ unfinishedRequests });
	} catch (error) {
		console.error('Error fetching unfinished requests:', error.message);
		return res.status(500).json({ message: 'Server error. Please try again later.' });
	}
};