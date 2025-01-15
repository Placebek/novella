const Request = require('../models/requestModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const axios = require('axios');


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.createRequest = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); 
        const { mp3, text, title } = req.body; 

        if (!mp3) {
            return res.status(400).json({ message: 'MP3 field is required.' });
        }

        const newRequest = await Request.create({
            mp3,
            text,
            title, 
            user_id: decoded.id, 
        });

        res.status(201).json({
            message: 'Request created successfully.',
            request: newRequest,
        });

        try {
            const fastApiResponse = await axios.post('http://fastapi-server-address/api/endpoint', {
                mp3: newRequest.mp3,
                text: newRequest.text,
                title: newRequest.title,
                user_id: newRequest.user_id,
            });

            console.log('FastAPI response:', fastApiResponse.data);
        } catch (fastApiError) {
            console.error('Error sending data to FastAPI:', fastApiError.message);
        }

        res.status(201).json({
            message: 'Request created successfully and sent to FastAPI.',
            request: newRequest,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};