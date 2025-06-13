
class IArticleRepository {

  async findAll() {
    throw new Error('Method findAll must be implemented');
  }


  async saveAll(articles) {
    throw new Error('Method saveAll must be implemented');
  }


  async clear() {
    throw new Error('Method clear must be implemented');
  }


  async findBySearchQuery(searchQuery) {
    throw new Error('Method findBySearchQuery must be implemented');
  }
}

module.exports = IArticleRepository;
