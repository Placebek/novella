const sequelize = require('../config/db');
const User = require('./userModel');
const Request = require('./requestModel');

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  User,
  Request,
};

module.exports = db;