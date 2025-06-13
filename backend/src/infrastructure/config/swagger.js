const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Parser API',
      version: '2.0.0',
      description: 'API для парсинга блога и поиска статей'
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-domain.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server'
      }
    ],
    tags: [
      {
        name: 'Articles',
        description: 'Операции с статьями блога'
      },
      {
        name: 'Health',
        description: 'Проверка состояния сервиса'
      }
    ]
  },
  apis: [
    './src/presentation/controllers/*.js',
    './src/presentation/routes/*.js',
    './src/app.js'
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerUiOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #3b82f6; }
    .swagger-ui .scheme-container { background: #f8fafc; }
  `,
  customSiteTitle: 'Blog Parser API Documentation',
  customfavIcon: '/favicon.ico'
};

module.exports = {
  swaggerSpec,
  swaggerUi,
  swaggerUiOptions
}; 