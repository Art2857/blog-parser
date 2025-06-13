const db = require('../src/infrastructure/config/database');


const setupTestDb = async () => {
  try {

    await db.migrate.latest();
    console.log('Test database migrations applied');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};


const cleanupTestDb = async () => {
  try {

    await db('posts').del();
    console.log('Test database cleaned');
  } catch (error) {
    console.error('Error cleaning test database:', error);
  }
};


const closeTestDb = async () => {
  try {
    await db.destroy();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database:', error);
  }
};


const createTestPosts = async () => {
  const testPosts = [
    {
      link: 'https://example.com/tech-article',
      title: 'Test Technology Article',
      descr: 'This is a test article about technology and development',
      date: new Date('2023-12-01').toISOString()
    },
    {
      link: 'https://example.com/business-guide',
      title: 'Business Strategy Guide',
      descr: 'Learn about modern business strategies',
      date: new Date('2023-12-02').toISOString()
    }
  ];

  await db('posts').insert(testPosts);
  return testPosts;
};

module.exports = {
  setupTestDb,
  cleanupTestDb,
  closeTestDb,
  createTestPosts
};
