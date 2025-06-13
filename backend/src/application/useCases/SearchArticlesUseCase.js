const SearchQuery = require('../../domain/valueObjects/SearchQuery');

class SearchArticlesUseCase {
  constructor(articleRepository, blogParser) {
    this.articleRepository = articleRepository;
    this.blogParser = blogParser;
  }

  async execute(searchWord) {
    const searchQuery = new SearchQuery(searchWord);

    const allArticles = await this.blogParser.parseArticles();

    const filteredArticles = allArticles.filter(article => 
      article.containsSearchWord(searchQuery.toString())
    );

    await this.articleRepository.saveAll(allArticles);

    const savedArticles = await this.articleRepository.findBySearchQuery(searchQuery.toString());

    return {
      searchQuery,
      articles: savedArticles,
      count: savedArticles.length
    };
  }
}

module.exports = SearchArticlesUseCase; 