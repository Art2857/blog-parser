const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const articleRoutes = require('./presentation/routes/articleRoutes');
const ErrorHandler = require('./presentation/middleware/ErrorHandler');
const { swaggerSpec, swaggerUi, swaggerUiOptions } = require('./infrastructure/config/swagger');
const Logger = require('./infrastructure/logging/Logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(Logger.createMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api', articleRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Проверка состояния сервиса
 *     description: Возвращает информацию о состоянии API сервера
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Сервис работает нормально
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-01T10:00:00.000Z"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use('*', ErrorHandler.notFound);

app.use(ErrorHandler.handle);

if (require.main === module) {
  app.listen(PORT, () => {
    Logger.success(`Server started on port ${PORT}`);
    Logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
    Logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app; 