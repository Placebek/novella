const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            { bearerAuth: [] },
        ],
    },

    apis: [
        path.join(__dirname, './app/swaggers/userSwagger.js'),
        path.join(__dirname, './app/swaggers/requestSwagger.js'),
        path.join(__dirname, './app/swaggers/userToGptSwagger.js') 
    ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(swaggerDocs),
};
