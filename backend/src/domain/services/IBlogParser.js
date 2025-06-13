
class IBlogParser {

  async parseArticles() {
    throw new Error('Method parseArticles must be implemented');
  }


  async isSourceAvailable() {
    throw new Error('Method isSourceAvailable must be implemented');
  }
}

module.exports = IBlogParser;
