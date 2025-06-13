
class GetArticlesUseCase {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }


  async execute() {
    return await this.articleRepository.findAll();
  }
}

module.exports = GetArticlesUseCase;
