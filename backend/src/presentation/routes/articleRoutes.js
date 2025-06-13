const express = require('express');
const container = require('../../infrastructure/di/Container');

const router = express.Router();


const articleController = container.get('articleController');


router.get('/parse', (req, res, next) => {
  articleController.getArticles(req, res, next);
});


router.post('/parse', (req, res, next) => {
  articleController.searchArticles(req, res, next);
});

module.exports = router;
