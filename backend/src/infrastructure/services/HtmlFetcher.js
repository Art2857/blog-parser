const axios = require('axios');
const RetryManager = require('./RetryManager');

class HtmlFetcher {
  constructor() {
    this.timeout = parseInt(process.env.REQUEST_TIMEOUT) || 30000;
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    
    this.retryManager = new RetryManager({
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      jitter: true,
      failureThreshold: 5,
      recoveryTimeout: 60000
    });
    
    console.log(`📡 HtmlFetcher initialized with timeout: ${this.timeout}ms`);
  }

  async fetch(url) {
    return await this.retryManager.execute(
      () => this._fetchOnce(url),
      { url }
    );
  }



  async _fetchOnce(url) {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        },
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.data;
    } catch (error) {
      console.log(`🔍 Error details: code=${error.code}, message=${error.message}`);
      
      if (error.code === 'ECONNABORTED' || error.message.includes('aborted')) {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      
      if (error.code === 'ENOTFOUND') {
        throw new Error(`DNS resolution failed for ${url}`);
      }
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Connection refused to ${url}`);
      }
      
      if (error.response) {
        throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
      }
      
      throw new Error(`Network error: ${error.message}`);
    }
  }

  getHealthStatus() {
    return {
      timeout: this.timeout,
      circuitBreaker: this.retryManager.getCircuitBreakerState()
    };
  }

  resetCircuitBreaker() {
    this.retryManager.resetCircuitBreaker();
  }
}

module.exports = HtmlFetcher; 