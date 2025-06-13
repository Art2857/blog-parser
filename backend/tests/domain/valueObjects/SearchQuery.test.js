const SearchQuery = require('../../../src/domain/valueObjects/SearchQuery');

describe('SearchQuery Value Object', () => {
  describe('constructor', () => {
    test('should create valid search query', () => {
      const query = new SearchQuery('javascript');
      expect(query.value).toBe('javascript');
    });

    test('should trim whitespace', () => {
      const query = new SearchQuery('  javascript  ');
      expect(query.value).toBe('javascript');
    });

    test('should throw error for empty string', () => {
      expect(() => new SearchQuery('')).toThrow('Search word cannot be empty');
      expect(() => new SearchQuery('   ')).toThrow('Search word cannot be empty');
    });

    test('should throw error for null/undefined', () => {
      expect(() => new SearchQuery(null)).toThrow('Search word is required and must be a string');
      expect(() => new SearchQuery(undefined)).toThrow('Search word is required and must be a string');
    });

    test('should throw error for non-string', () => {
      expect(() => new SearchQuery(123)).toThrow('Search word is required and must be a string');
      expect(() => new SearchQuery({})).toThrow('Search word is required and must be a string');
    });

    test('should throw error for too short word', () => {
      expect(() => new SearchQuery('a')).toThrow('Search word is too short (minimum 2 characters)');
    });

    test('should throw error for too long word', () => {
      const longWord = 'a'.repeat(101);
      expect(() => new SearchQuery(longWord)).toThrow('Search word is too long (maximum 100 characters)');
    });

    test('should throw error for word without letters', () => {
      expect(() => new SearchQuery('123')).toThrow('Search word must contain letters');
      expect(() => new SearchQuery('!@#')).toThrow('Search word must contain letters');
    });

    test('should accept word with letters and numbers', () => {
      const query = new SearchQuery('js2023');
      expect(query.value).toBe('js2023');
    });

    test('should accept Russian letters', () => {
      const query = new SearchQuery('программирование');
      expect(query.value).toBe('программирование');
    });
  });

  describe('toString', () => {
    test('should return string value', () => {
      const query = new SearchQuery('javascript');
      expect(query.toString()).toBe('javascript');
    });
  });

  describe('toLowerCase', () => {
    test('should return lowercase value', () => {
      const query = new SearchQuery('JavaScript');
      expect(query.toLowerCase()).toBe('javascript');
    });

    test('should handle Russian text', () => {
      const query = new SearchQuery('ПРОГРАММИРОВАНИЕ');
      expect(query.toLowerCase()).toBe('программирование');
    });
  });

  describe('equals', () => {
    test('should return true for equal queries', () => {
      const query1 = new SearchQuery('javascript');
      const query2 = new SearchQuery('javascript');
      expect(query1.equals(query2)).toBe(true);
    });

    test('should return false for different queries', () => {
      const query1 = new SearchQuery('javascript');
      const query2 = new SearchQuery('python');
      expect(query1.equals(query2)).toBe(false);
    });

    test('should return false for non-SearchQuery object', () => {
      const query = new SearchQuery('javascript');
      expect(query.equals('javascript')).toBe(false);
      expect(query.equals({ value: 'javascript' })).toBe(false);
    });

    test('should be case sensitive', () => {
      const query1 = new SearchQuery('JavaScript');
      const query2 = new SearchQuery('javascript');
      expect(query1.equals(query2)).toBe(false);
    });
  });
});
