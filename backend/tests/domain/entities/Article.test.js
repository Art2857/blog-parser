const Article = require('../../../src/domain/entities/Article');

describe('Article Entity', () => {
  describe('constructor', () => {
    test('should create valid article', () => {
      const articleData = {
        title: 'Valid Article Title',
        link: 'https://example.com/article',
        description: 'Valid description',
        date: '2023-12-01 10:00:00'
      };

      const article = new Article(articleData);

      expect(article.title).toBe('Valid Article Title');
      expect(article.link).toBe('https://example.com/article');
      expect(article.description).toBe('Valid description');
      expect(article.date).toBe('2023-12-01 10:00:00');
    });

    test('should throw error for invalid title', () => {
      const articleData = {
        title: 'Bad',
        link: 'https://example.com/article',
        description: 'Valid description'
      };

      expect(() => new Article(articleData)).toThrow('Title must be between 5 and 200 characters');
    });

    test('should throw error for system words in title', () => {
      const articleData = {
        title: 'Навигация по сайту',
        link: 'https://example.com/article',
        description: 'Valid description'
      };

      expect(() => new Article(articleData)).toThrow('Title contains system words');
    });

    test('should throw error for invalid link', () => {
      const articleData = {
        title: 'Valid Article Title',
        link: 'javascript:alert("xss")',
        description: 'Valid description'
      };

      expect(() => new Article(articleData)).toThrow('Link contains invalid patterns');
    });

    test('should handle empty description', () => {
      const articleData = {
        title: 'Valid Article Title',
        link: 'https://example.com/article',
        description: ''
      };

      const article = new Article(articleData);
      expect(article.description).toBe('');
    });

    test('should auto-generate date if not provided', () => {
      const articleData = {
        title: 'Valid Article Title',
        link: 'https://example.com/article',
        description: 'Valid description'
      };

      const article = new Article(articleData);
      expect(article.date).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('containsSearchWord', () => {
    let article;

    beforeEach(() => {
      article = new Article({
        title: 'JavaScript Programming Guide',
        link: 'https://example.com/js-guide',
        description: 'Learn modern JavaScript development techniques'
      });
    });

    test('should find word in title', () => {
      expect(article.containsSearchWord('JavaScript')).toBe(true);
      expect(article.containsSearchWord('javascript')).toBe(true);
    });

    test('should find word in description', () => {
      expect(article.containsSearchWord('development')).toBe(true);
      expect(article.containsSearchWord('DEVELOPMENT')).toBe(true);
    });

    test('should not find non-existent word', () => {
      expect(article.containsSearchWord('Python')).toBe(false);
    });

    test('should handle empty search word', () => {
      expect(article.containsSearchWord('')).toBe(false);
      expect(article.containsSearchWord(null)).toBe(false);
    });
  });

  describe('toJSON', () => {
    test('should return correct JSON format', () => {
      const article = new Article({
        id: 1,
        title: 'Test Article',
        link: 'https://example.com/test',
        description: 'Test description',
        date: '2023-12-01 10:00:00'
      });

      const json = article.toJSON();

      expect(json).toEqual({
        id: 1,
        title: 'Test Article',
        link: 'https://example.com/test',
        descr: 'Test description',
        date: '2023-12-01 10:00:00'
      });
    });
  });

  describe('fromDatabase', () => {
    test('should create article from database data', () => {
      const dbData = {
        id: 1,
        title: 'Database Article',
        link: 'https://example.com/db-article',
        descr: 'From database',
        date: '2023-12-01 10:00:00'
      };

      const article = Article.fromDatabase(dbData);

      expect(article.id).toBe(1);
      expect(article.title).toBe('Database Article');
      expect(article.link).toBe('https://example.com/db-article');
      expect(article.description).toBe('From database');
      expect(article.date).toBe('2023-12-01 10:00:00');
    });
  });
});
