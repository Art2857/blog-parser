require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const getConnectionConfig = (database) => {

  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: database || process.env.DB_NAME || 'blog_parser_dev',
    user: process.env.DB_USER || 'blog_parser_user',
    password: process.env.DB_PASSWORD || 'blog_parser_password',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
};

module.exports = {
  development: {
    client: 'postgresql',
    connection: getConnectionConfig(process.env.DB_NAME || 'blog_parser_dev'),
    migrations: {
      directory: './src/migrations'
    },
    seeds: {
      directory: './src/seeds'
    }
  },

  test: {
    client: 'postgresql',
    connection: getConnectionConfig(process.env.DB_TEST_NAME || 'blog_parser_test'),
    migrations: {
      directory: './src/migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: getConnectionConfig(process.env.DB_NAME || 'blog_parser_prod'),
    migrations: {
      directory: './src/migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
