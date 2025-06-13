const IBlogParser = require('../../domain/services/IBlogParser');
const Article = require('../../domain/entities/Article');
const HtmlFetcher = require('../services/HtmlFetcher');
const HtmlContentExtractor = require('../services/HtmlContentExtractor');
const UrlNormalizer = require('../services/UrlNormalizer');


class IsSystemsBlogParser extends IBlogParser {
  constructor() {
    super();
    this.blogUrl = process.env.BLOG_URL || 'https://is-systems.org/blog';
    this.htmlFetcher = new HtmlFetcher();
    this.contentExtractor = new HtmlContentExtractor();
    this.urlNormalizer = new UrlNormalizer('https://is-systems.org');
  }


  async parseArticles() {
    try {

      const html = await this.htmlFetcher.fetch(this.blogUrl);


      const rawArticles = this.contentExtractor.extractArticles(html);


      const articles = [];

      for (const rawArticle of rawArticles) {
        try {
          const article = new Article({
            title: rawArticle.title,
            link: this.urlNormalizer.normalize(rawArticle.link),
            description: rawArticle.description,
            date: rawArticle.date
          });
          articles.push(article);
        } catch (error) {

          console.warn(`Skipping invalid article: ${error.message}`);
        }
      }


      if (articles.length === 0) {
        return this._createFallbackArticles();
      }

      return articles;
    } catch (error) {
      console.error('Error parsing blog:', error);
      throw new Error(`Failed to parse blog: ${error.message}`);
    }
  }


  async isSourceAvailable() {
    try {
      await this.htmlFetcher.fetch(this.blogUrl);
      return true;
    } catch (error) {
      return false;
    }
  }


  _createFallbackArticles() {
    return [
      new Article({
        title: 'Статьи блога IS Systems будут доступны после настройки парсера',
        link: this.blogUrl,
        description: 'Парсер блога готов к работе. Возможно, структура сайта изменилась и требует дополнительной настройки селекторов.',
        date: new Date()
      })
    ];
  }
}

module.exports = IsSystemsBlogParser;
