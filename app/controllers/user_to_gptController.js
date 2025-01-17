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

const concatenateVariants = (node) => {
    let concatenatedText = node.variant || '';
    console.log("SSSSSSSSSSSSSS", node.parent.variant)
    while (node.parent) {
        concatenatedText = `${node.parent.variant || ''} ${concatenatedText}`.trim();
        node = node.parent;
    }
    return concatenatedText;
};

exports.createUserToGpt = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { variant, parent_id, request_id } = req.body;

        if (!variant || !parent_id || !request_id) {
            return res.status(400).json({ message: 'Variant, parent_id, and request_id are required.' });
        }

        const request = await Request.findByPk(request_id);

        if (!request) {
            return res.status(404).json({ message: `Request with id ${request_id} not found.` });
        }

        const userToGpt = await UserToGpt.create({
            variant,
            parent_id,
            request_id,
        });

        const parentData = await getParentHierarchy(parent_id);

        const concatenatedText = concatenateVariants({
            variant,
            parent: parentData,
        });

        if (concatenatedText.length > 3800) {
            const fastApiResponse = await axios.post(
                'http://172.20.10.2:8000/novellas/theEnd',
                { text: concatenatedText },
                {
                    headers: {
                        'Authorization': `Bearer ${JWT_SECRET}`,
                    },
                    auth: {
                        username: FASTAPI_USERNAME,
                        password: FASTAPI_PASSWORD,
                    },
                }
            );

            await request.update({
                is_activate: false,
                is_finished: true,
            });

            return res.status(200).json({
                message: 'The concatenated text exceeded the limit and was sent to /novellas/theEnd.',
                userToGpt: {
                    id: userToGpt.id,
                    variant,
                    parent_id,
                    request_id,
                    updatedAt: userToGpt.updatedAt,
                    createdAt: userToGpt.createdAt,
                    parent: parentData, 
                    variants: userToGpt.variants || null,
                },
                options: fastApiResponse.data?.options || [], 
            });
        }

        const fastApiResponse = await axios.post(
            'http://172.20.10.2:8000/novellas/g4f',
            { text: concatenatedText },
            {
                headers: {
                    'Authorization': `Bearer ${JWT_SECRET}`,
                },
                auth: {
                    username: FASTAPI_USERNAME,
                    password: FASTAPI_PASSWORD,
                },
            }
        );

        const options = fastApiResponse.data?.options;

        if (Array.isArray(options)) {
            return res.status(201).json({
                message: 'UserToGpt created and updated successfully.',
                userToGpt: {
                    ...userToGpt.toJSON(),
                    parent: parentData,
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

