const express = require('express');
const morgan = require('morgan');
const userRoutes = require('./app/routes/userRoutes');
const sequelize = require('./app/config/db');

const app = express();

app.use(express.json());  

app.use(morgan('combined'));

app.use('/api/users', userRoutes);

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database connected and synced');
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });

module.exports = app;
