const sequelize = require('../config/db');
const User = require('./userModel');

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  User,
};

module.exports = db;