
class UrlNormalizer {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }


  normalize(url) {
    if (!url || typeof url !== 'string') {
      return '';
    }

    const trimmed = url.trim();


    if (trimmed.startsWith('http')) {
      return trimmed;
    }


    if (trimmed.startsWith('/')) {
      return this.baseUrl + trimmed;
    }


    if (trimmed.includes('.') && !trimmed.startsWith('//')) {
      return 'https://' + trimmed;
    }

    return trimmed;
  }


  isValid(url) {
    if (!url || typeof url !== 'string') {
      return false;
    }

    const trimmed = url.trim();


    const invalidSchemes = ['javascript:', 'mailto:', 'tel:', 'ftp:'];
    if (invalidSchemes.some(scheme => trimmed.toLowerCase().startsWith(scheme))) {
      return false;
    }


    if (trimmed.startsWith('#')) {
      return false;
    }


    if (trimmed.length === 0) {
      return false;
    }

    return true;
  }
}

module.exports = UrlNormalizer;
