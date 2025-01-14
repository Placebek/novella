const sequelize = require('../config/db');
const User = require('./userModel');
const Request = require('./requestModel');
const UserToGpt = require('./user_to_gptModel');


const db = {
  sequelize,
  Sequelize: require('sequelize'),
  User,
  Request,
  UserToGpt,
};

module.exports = db;