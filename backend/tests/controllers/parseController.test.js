const request = require('supertest');
const app = require('../../src/app');

describe('Parse Controller', () => {
  describe('GET /api/parse', () => {
    test('should return array of posts', async () => {
      const response = await request(app)
        .get('/api/parse')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/parse', () => {
    test('should require searchWord parameter', async () => {
      const response = await request(app)
        .post('/api/parse')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Search word is required');
    });

    test('should reject empty searchWord', async () => {
      const response = await request(app)
        .post('/api/parse')
        .send({ searchWord: '' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should reject non-string searchWord', async () => {
      const response = await request(app)
        .post('/api/parse')
        .send({ searchWord: 123 })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should accept valid searchWord', async () => {
      const response = await request(app)
        .post('/api/parse')
        .send({ searchWord: 'technology' })
        .expect('Content-Type', /json/);


      expect(response.status).not.toBe(400);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('searchWord', 'technology');
        expect(response.body).toHaveProperty('count');
        expect(response.body).toHaveProperty('results');
        expect(Array.isArray(response.body.results)).toBe(true);
      }
    });

    test('should reject too long searchWord', async () => {
      const longSearchWord = 'x'.repeat(101);
      const response = await request(app)
        .post('/api/parse')
        .send({ searchWord: longSearchWord })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('too long');
    });
  });

  describe('Health check', () => {
    test('should return server status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
