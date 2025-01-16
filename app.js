const express = require('express');
const morgan = require('morgan');
const swagger = require('./swagger');
const userRoutes = require('./app/routes/userRoutes');
const requestRoutes = require('./app/routes/requestRoutes');
const user_to_gptRoutes = require('./app/routes/user_to_gptRoutes');
const sequelize = require('./app/config/db');
const cors = require('cors');

const app = express();

app.use(express.json());  

app.use(cors());

app.use(morgan('combined'));

app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/user_to_gpts', user_to_gptRoutes);
app.use('/api-docs', swagger.serve, swagger.setup);

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database connected and synced');
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });

module.exports = app;
