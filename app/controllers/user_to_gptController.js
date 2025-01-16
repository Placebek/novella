const UserToGpt = require('../models/user_to_gptModel');
const Request = require('../models/requestModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const axios = require('axios');


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const FASTAPI_USERNAME = process.env.FASTAPI_USERNAME; 
const FASTAPI_PASSWORD = process.env.FASTAPI_PASSWORD; 

exports.createUserToGpt = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); 
        const { variant, parent_id, request_id, variants } = req.body;

        const request = await Request.findByPk(request_id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        if (parent_id) {
            const parent = await UserToGpt.findByPk(parent_id);
            if (!parent) {
                return res.status(404).json({ message: 'Parent UserToGpt not found.' });
            }
        }

        const newUserToGpt = await UserToGpt.create({
            variant,
            parent_id,
            request_id,
            variants,
        });

        res.status(201).json({
            message: 'UserToGpt created successfully.',
            userToGpt: newUserToGpt,
        });

        try {
            const fastApiResponse = await axios.post(
                'http://fastapi-server-address/api/endpoint', 
                {
                    variant: newUserToGpt.variant,
                    parent_id: newUserToGpt.parent_id,
                    request_id: newUserToGpt.request_id,
                    variants: newUserToGpt.variants,
                },
                {
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


exports.postUserToGpt = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); 
        const { variant, parent_id, request_id, variants } = req.body;

        const request = await Request.findByPk(request_id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        if (parent_id) {
            const parent = await UserToGpt.findByPk(parent_id);
            if (!parent) {
                return res.status(404).json({ message: 'Parent UserToGpt not found.' });
            }
        }

        const newUserToGpt = await UserToGpt.create({
            variant,
            parent_id,
            request_id,
            variants,
        });

        res.status(201).json({
            message: 'UserToGpt created successfully.',
            userToGpt: newUserToGpt,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
