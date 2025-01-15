const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');


const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    mp3: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_activate: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
});

User.hasMany(Request, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Request.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Request;