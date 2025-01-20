const { UserToGpt, Request } = require('../models');
const axios = require('axios');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const FASTAPI_USERNAME = process.env.FASTAPI_USERNAME;
const FASTAPI_PASSWORD = process.env.FASTAPI_PASSWORD;

const getParentHierarchy = async (parentId) => {
    const parentData = await UserToGpt.findByPk(parentId);

    if (parentData) {
        const parentHierarchy = await getParentHierarchy(parentData.parent_id);
        return {
            ...parentData.toJSON(),
            parent: parentHierarchy || null,
        };
    }
    return null;
};

exports.createUserToGpt = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { variant, request_id } = req.body;

        if (!variant || !request_id) {
            return res.status(400).json({ message: 'Variant and request_id are required.' });
        }

        const request = await Request.findByPk(request_id);

        if (!request) {
            return res.status(404).json({ message: `Request with id ${request_id} not found.` });
        }

        const parent_id = (await UserToGpt.findOne({
            where: { request_id },
            order: [['createdAt', 'DESC']],
        }))?.id;

        const userToGpt = await UserToGpt.create({
            variant,
            parent_id,
            request_id,
        });

        const allVariants = await UserToGpt.findAll({
            where: { request_id },
            order: [['createdAt', 'ASC']],
        });

        const concatenatedText = allVariants.map((entry) => entry.variant).join(' ').trim();

        if (concatenatedText.length > 1000) {
            const fastApiResponse = await axios.post(
                'http://172.20.10.4:8000/novellas/theEnd',
                { text: concatenatedText },
                {
                    headers: { Authorization: `Bearer ${JWT_SECRET}` },
                    auth: {
                        username: FASTAPI_USERNAME,
                        password: FASTAPI_PASSWORD,
                    },
                }
            );

            await request.update({
                is_activate: false,
                is_finished: true,
                final_story: concatenatedText,
            });

            const parentHierarchy = await getParentHierarchy(parent_id);

            return res.status(200).json({
                message: 'The concatenated text exceeded the limit and was sent to /novellas/theEnd.',
                userToGpt: {
                    ...userToGpt.toJSON(),
                    parent: parentHierarchy,
                },
                final_story: concatenatedText, 
            });
        }

        const fastApiResponse = await axios.post(
            'http://172.20.10.4:8000/novellas/g4f',
            { text: concatenatedText },
            {
                headers: { Authorization: `Bearer ${JWT_SECRET}` },
                auth: {
                    username: FASTAPI_USERNAME,
                    password: FASTAPI_PASSWORD,
                },
            }
        );

        const options = fastApiResponse.data?.options;

        if (Array.isArray(options)) {
            const parentHierarchy = await getParentHierarchy(parent_id);

            return res.status(201).json({
                message: 'UserToGpt created and updated successfully.',
                userToGpt: {
                    ...userToGpt.toJSON(),
                    parent: parentHierarchy,
                },
                options,
            });
        } else {
            return res.status(400).json({ message: 'Invalid response from FastAPI: options field is missing or not an array.' });
        }
    } catch (error) {
        console.error('Error in creating UserToGpt:', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


exports.finalizeStory = async (req, res) => {
    const { request_id, final_variant } = req.body;

    if (!request_id || !final_variant) {
        return res.status(400).json({ message: 'Request_id and final_variant are required.' });
    }

    try {
        const request = await Request.findByPk(request_id);

        if (!request) {
            return res.status(404).json({ message: `Request with id ${request_id} not found.` });
        }

        const allVariants = await UserToGpt.findAll({
            where: { request_id },
            order: [['createdAt', 'ASC']],
        });

        const finalStory = allVariants.map((entry) => entry.variant).join(' ') + ` ${final_variant}`;

        await request.update({
            is_activate: false,
            is_finished: true,
            final_story: finalStory.trim(),
        });

        return res.status(200).json({
            message: 'Final story created successfully.',
            final_story: finalStory.trim(),
        });
    } catch (error) {
        console.error('Error finalizing story:', error.message);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};