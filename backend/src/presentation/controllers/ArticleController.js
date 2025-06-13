const SearchArticlesUseCase = require('../../application/useCases/SearchArticlesUseCase');
const GetArticlesUseCase = require('../../application/useCases/GetArticlesUseCase');
const ErrorHandler = require('../middleware/ErrorHandler');

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор статьи
 *           example: 1
 *         title:
 *           type: string
 *           description: Заголовок статьи
 *           example: "Введение в JavaScript"
 *         link:
 *           type: string
 *           description: Ссылка на статью
 *           example: "https://is-systems.org/blog/javascript-intro"
 *         descr:
 *           type: string
 *           description: Краткое описание статьи
 *           example: "Основы программирования на JavaScript"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Дата публикации статьи
 *           example: "2023-12-01 10:00:00"
 *     
 *     SearchRequest:
 *       type: object
 *       required:
 *         - searchWord
 *       properties:
 *         searchWord:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Ключевое слово для поиска
 *           example: "javascript"
 *     
 *     SearchResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         searchWord:
 *           type: string
 *           example: "javascript"
 *         count:
 *           type: integer
 *           example: 5
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Article'
 *     
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Описание ошибки
 *           example: "Search word is required"
 *         type:
 *           type: string
 *           description: Тип ошибки
 *           example: "validation_error"
 *         details:
 *           type: string
 *           description: Дополнительные детали ошибки (только в development)
 */
class ArticleController {
  constructor(searchArticlesUseCase, getArticlesUseCase) {
    this.searchArticlesUseCase = searchArticlesUseCase;
    this.getArticlesUseCase = getArticlesUseCase;
  }

  /**
   * @swagger
   * /api/parse:
   *   get:
   *     summary: Получить список загруженных статей
   *     description: Возвращает все статьи, сохраненные в базе данных после последнего поиска
   *     tags: [Articles]
   *     responses:
   *       200:
   *         description: Список статей успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Article'
   *             example:
   *               - id: 1
   *                 title: "Введение в JavaScript"
   *                 link: "https://is-systems.org/blog/javascript-intro"
   *                 descr: "Основы программирования на JavaScript"
   *                 date: "2023-12-01 10:00:00"
   *               - id: 2
   *                 title: "Vue.js для начинающих"
   *                 link: "https://is-systems.org/blog/vue-basics"
   *                 descr: "Изучаем основы Vue.js"
   *                 date: "2023-12-02 14:30:00"
   *       500:
   *         description: Внутренняя ошибка сервера
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getArticles(req, res, next) {
    try {
      const articles = await this.getArticlesUseCase.execute();
      
      res.json(articles.map(article => article.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/parse:
   *   post:
   *     summary: Парсинг и поиск статей
   *     description: |
   *       Выполняет парсинг блога is-systems.org, ищет статьи по ключевому слову,
   *       сохраняет результаты в базу данных (очищая предыдущие результаты)
   *     tags: [Articles]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SearchRequest'
   *           example:
   *             searchWord: "javascript"
   *     responses:
   *       200:
   *         description: Поиск выполнен успешно
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SearchResponse'
   *             example:
   *               success: true
   *               searchWord: "javascript"
   *               count: 3
   *               results:
   *                 - id: 1
   *                   title: "Введение в JavaScript"
   *                   link: "https://is-systems.org/blog/javascript-intro"
   *                   descr: "Основы программирования на JavaScript"
   *                   date: "2023-12-01 10:00:00"
   *       400:
   *         description: Ошибка валидации запроса
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             examples:
   *               empty_search:
   *                 summary: Пустое поисковое слово
   *                 value:
   *                   error: "Search word cannot be empty"
   *                   type: "validation_error"
   *               too_short:
   *                 summary: Слишком короткое слово
   *                 value:
   *                   error: "Search word is too short (minimum 2 characters)"
   *                   type: "validation_error"
   *               too_long:
   *                 summary: Слишком длинное слово
   *                 value:
   *                   error: "Search word is too long (maximum 100 characters)"
   *                   type: "validation_error"
   *       503:
   *         description: Блог недоступен
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               error: "Блог временно недоступен. Попробуйте позже."
   *       500:
   *         description: Внутренняя ошибка сервера
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async searchArticles(req, res, next) {
    try {
      const { searchWord } = req.body;
      
      const result = await this.searchArticlesUseCase.execute(searchWord);
      
      res.json({
        success: true,
        searchWord: result.searchQuery.toString(),
        count: result.count,
        results: result.articles.map(article => article.toJSON())
      });
    } catch (error) {
      if (this._isDomainError(error)) {
        return res.status(400).json({
          error: error.message
        });
      }

      if (error.message.includes('Failed to parse blog') || 
          error.message.includes('Failed to fetch blog page')) {
        return res.status(503).json({
          error: 'Блог временно недоступен. Попробуйте позже.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }

      next(error);
    }
  }

  _isDomainError(error) {
    const domainErrorMessages = [
      'Search word is required',
      'Search word is too short',
      'Search word is too long',
      'Search word must contain letters',
      'Title is required',
      'Link is required',
      'Title must be between',
      'Title contains system words',
      'Link contains invalid patterns'
    ];

    return domainErrorMessages.some(msg => error.message.includes(msg));
  }
}

module.exports = ArticleController; 