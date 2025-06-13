
class SearchQuery {
  constructor(searchWord) {
    this.value = this._validate(searchWord);
  }

  _validate(searchWord) {
    if (searchWord === null || searchWord === undefined || typeof searchWord !== 'string') {
      throw new Error('Search word is required and must be a string');
    }

    const trimmed = searchWord.trim();

    if (trimmed.length === 0) {
      throw new Error('Search word cannot be empty');
    }

    if (trimmed.length < 2) {
      throw new Error('Search word is too short (minimum 2 characters)');
    }

    if (trimmed.length > 100) {
      throw new Error('Search word is too long (maximum 100 characters)');
    }

    if (!/[a-zA-Zа-яА-Я]/.test(trimmed)) {
      throw new Error('Search word must contain letters');
    }

    return trimmed;
  }


  toString() {
    return this.value;
  }


  equals(other) {
    return other instanceof SearchQuery && this.value === other.value;
  }


  toLowerCase() {
    return this.value.toLowerCase();
  }
}

module.exports = SearchQuery;
