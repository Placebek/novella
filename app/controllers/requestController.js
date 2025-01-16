const Request = require('../models/requestModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const axios = require('axios');
const upload = require('../config/multerConfig');

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
        const { text, title } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'MP3 file is required.' });
        }

        const mp3Path = req.file.path;

        const newRequest = await Request.create({
            mp3: mp3Path,
            text,
            title,
            user_id: decoded.id, 
        });

        res.status(201).json({
            message: 'Request created successfully.',
            request: newRequest,
        });

        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(mp3Path)); 
            formData.append('text', text); 
            formData.append('title', title);
            formData.append('user_id', decoded.id);

            const fastApiResponse = await axios.post(
                'http://fastapi-server-address/api/endpoint',
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

            console.log('FastAPI response:', fastApiResponse.data);
        } catch (fastApiError) {
            console.error('Error sending data to FastAPI:', fastApiError.message);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


exports.updateRequest = async (req, res) => {
    const { id } = req.params;  
    const { mp3, text, title, is_activate } = req.body;  

    try {
        const request = await Request.findByPk(id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        const updatedRequest = await request.update({
            mp3: mp3 || request.mp3,  
            text: text || request.text,  
            title: title || request.title,
            is_activate: is_activate !== undefined ? is_activate : request.is_activate, 
        });

        res.status(200).json({
            message: 'Request updated successfully.',
            request: updatedRequest,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};