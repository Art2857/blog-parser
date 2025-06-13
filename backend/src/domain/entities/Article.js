
class Article {
  constructor({ title, link, description, date, id = null }) {
    this.id = id;
    this.title = this._validateTitle(title);
    this.link = this._validateLink(link);
    this.description = this._validateDescription(description);
    this.date = this._validateDate(date);
  }

  _validateTitle(title) {
    if (!title || typeof title !== 'string') {
      throw new Error('Title is required and must be a string');
    }

    const trimmed = title.trim();
    if (trimmed.length < 5 || trimmed.length > 200) {
      throw new Error('Title must be between 5 and 200 characters');
    }

    if (!/[a-zA-Zа-яА-Я]/.test(trimmed)) {
      throw new Error('Title must contain letters');
    }


    const systemWords = ['навигация', 'меню', 'footer', 'sidebar'];
    if (systemWords.some(word => trimmed.toLowerCase().includes(word))) {
      throw new Error('Title contains system words');
    }

    return trimmed;
  }

  _validateLink(link) {
    if (!link || typeof link !== 'string') {
      throw new Error('Link is required and must be a string');
    }

    const trimmed = link.trim();
    if (trimmed.length === 0) {
      throw new Error('Link cannot be empty');
    }


    const invalidPatterns = ['javascript:', 'mailto:', '#'];
    if (invalidPatterns.some(pattern => trimmed.includes(pattern))) {
      throw new Error('Link contains invalid patterns');
    }

    if (!trimmed.startsWith('http') && !trimmed.startsWith('/')) {
      throw new Error('Link must be absolute or relative URL');
    }

    return trimmed;
  }

  _validateDescription(description) {
    if (description && typeof description !== 'string') {
      throw new Error('Description must be a string');
    }

    const trimmed = description ? description.trim() : '';
    if (trimmed.length > 1000) {
      throw new Error('Description is too long (max 1000 characters)');
    }

    return trimmed;
  }

  _validateDate(date) {
    if (!date) {
      return new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
    }

    if (typeof date === 'string') {
      return date;
    }

    if (date instanceof Date) {
      return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
    }

    throw new Error('Date must be a string or Date object');
  }


  containsSearchWord(searchWord) {
    if (!searchWord || typeof searchWord !== 'string') {
      return false;
    }

    const searchLower = searchWord.toLowerCase().trim();
    const titleMatch = this.title.toLowerCase().includes(searchLower);
    const descriptionMatch = this.description.toLowerCase().includes(searchLower);

    return titleMatch || descriptionMatch;
  }


  toJSON() {
    return {
      id: this.id,
      title: this.title,
      link: this.link,
      descr: this.description,
      date: this.date
    };
  }


  static fromDatabase(data) {
    return new Article({
      id: data.id,
      title: data.title,
      link: data.link,
      description: data.descr,
      date: data.date
    });
  }
}

module.exports = Article;
