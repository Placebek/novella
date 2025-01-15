const Request = require('../models/requestModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};