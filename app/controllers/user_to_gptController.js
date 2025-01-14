const UserToGpt = require('../models/user_to_gptModel');  
const Request = require('../models/requestModel'); 
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.getUserHistory = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Токен авторизации обязателен.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const userId = decoded.id;

        const history = await UserToGpt.findAll({
            where: { request_id: userId },
            include: [
                {
                    model: Request,
                    attributes: ['id', 'name', 'status'], 
                },
                {
                    model: UserToGpt,
                    as: 'Parent', 
                    attributes: ['id', 'variant'],
                },
            ],
            order: [['createdAt', 'DESC']], 
        });

        if (history.length === 0) {
            return res.status(404).json({ message: 'История не найдена.' });
        }

        res.status(200).json({ history });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера. Попробуйте позже.' });
    }
};
