const IArticleRepository = require('../../domain/repositories/IArticleRepository');
const Article = require('../../domain/entities/Article');


class PostgresArticleRepository extends IArticleRepository {
  constructor(database) {
    super();
    this.db = database;
  }


  async findAll() {
    try {
      const rows = await this.db('posts')
        .select('*')
        .orderBy('date', 'desc');

      return rows.map(row => Article.fromDatabase(row));
    } catch (error) {
      throw new Error(`Failed to fetch articles: ${error.message}`);
    }
  }


  async saveAll(articles) {
    const trx = await this.db.transaction();

    try {

      await trx('posts').del();


      if (articles && articles.length > 0) {
        const articlesData = articles.map(article => {
          const data = article.toJSON();

          if (data.id === null || data.id === undefined) {
            delete data.id;
          }
          return data;
        });
        await trx('posts').insert(articlesData);
      }

      await trx.commit();
      return articles;
    } catch (error) {
      await trx.rollback();
      throw new Error(`Failed to save articles: ${error.message}`);
    }
  }


  async clear() {
    try {
      await this.db('posts').del();
    } catch (error) {
      throw new Error(`Failed to clear articles: ${error.message}`);
    }
  }


  async findBySearchQuery(searchQuery) {
    try {
      const searchTerm = `%${searchQuery.toLowerCase()}%`;

      const rows = await this.db('posts')
        .select('*')
        .where(function() {
          this.whereILike('title', searchTerm)
              .orWhereILike('descr', searchTerm);
        })
        .orderBy('date', 'desc');

      return rows.map(row => Article.fromDatabase(row));
    } catch (error) {
      throw new Error(`Failed to search articles: ${error.message}`);
    }
  }
}

module.exports = PostgresArticleRepository;
