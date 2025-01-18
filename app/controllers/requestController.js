const Request = require('../models/requestModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const axios = require('axios');
const upload = require('../config/multerConfig');
const fs = require('fs');
const FormData = require('form-data');
const UserToGpt = require('../models/user_to_gptModel');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const FASTAPI_USERNAME = process.env.FASTAPI_USERNAME; 
const FASTAPI_PASSWORD = process.env.FASTAPI_PASSWORD;

exports.uploadFile = upload.single('mp3');

exports.createRequest = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!req.file) {
            return res.status(400).json({ message: 'MP3 file is required.' });
        }

        const mp3Path = req.file.path;

        const newRequest = await Request.create({
            mp3: mp3Path,
            text: null,
            title: null,
            user_id: decoded.id,
        });

        const formData = new FormData();
        formData.append('audio_file', fs.createReadStream(mp3Path));

        try {
            const fastApiResponse = await axios.post(
                'http://172.20.10.4:8000/novellas/mp3',
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                    },
                    auth: {
                        username: FASTAPI_USERNAME,
                        password: FASTAPI_PASSWORD,
                    },
                }
            );

            const { title, text, options } = fastApiResponse.data;

            await newRequest.update({
                title,
                text,
            });

            if (options && Array.isArray(options)) {
                const variantsList = options.map(option => Object.values(option)[0]);

                await UserToGpt.create({
                    variants: variantsList.join(' | '),  
                    request_id: newRequest.id,
                });
            }

            return res.status(201).json({
                message: 'Request created and updated successfully.',
                request: newRequest,
                options,
            });
        } catch (fastApiError) {
            console.error('Error sending MP3 to FastAPI:', fastApiError.message);

            return res.status(500).json({
                message: 'Failed to process MP3 file with FastAPI.',
            });
        }
    } catch (error) {
        console.error('Error creating request:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
