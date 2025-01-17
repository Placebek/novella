const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Request = require('./requestModel'); 


const UserToGpt = sequelize.define('UserToGpt', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    variant: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'UserToGpts', 
            key: 'id',
        },
        onDelete: 'SET NULL',
    },
    request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Request,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    variants: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
});


UserToGpt.hasMany(UserToGpt, { as: 'Children', foreignKey: 'parent_id' });
UserToGpt.belongsTo(UserToGpt, { as: 'Parent', foreignKey: 'parent_id' });

Request.hasMany(UserToGpt, { foreignKey: 'request_id', onDelete: 'CASCADE' });
UserToGpt.belongsTo(Request, { foreignKey: 'request_id' });

module.exports = UserToGpt;
