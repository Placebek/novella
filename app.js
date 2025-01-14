const express = require('express');
const morgan = require('morgan');
const userRoutes = require('./app/routes/userRoutes');
// const requestRoutes = require('./app/routes/requestRoutes');
const user_to_gptRoutes = require('./app/routes/user_to_gptRoutes');
const sequelize = require('./app/config/db');

const app = express();

app.use(express.json());  

app.use(morgan('combined'));

app.use('/api/users', userRoutes);
// app.use('/api/requests', requestRoutes);
app.use('/api/user_to_gpt', user_to_gptRoutes);

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database connected and synced');
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });

module.exports = app;
