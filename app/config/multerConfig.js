const multer = require('multer')
const path = require('path')

// Define the storage settings
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'D:/Hackaton/story_crafter/express_js/novella/uploads')
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname)
	},
})

// File filter for only MP3 or audio files
const fileFilter = (req, file, cb) => {
	const validMimeTypes = [
		'audio/mpeg',
		'audio/mp3',
		'audio/wav',
		'audio/aac',
		'audio/x-wav',
		'audio/flac',
		'audio/ogg',
		'application/octet-stream',
	]

	if (validMimeTypes.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(new Error(`File uploaded with mimetype: ${file.mimetype}`), false)
	}
}

// Create the multer upload instance
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
})

module.exports = upload // Correctly export the `upload` object
