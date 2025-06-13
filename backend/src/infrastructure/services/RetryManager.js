
class RetryManager {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.backoffMultiplier = options.backoffMultiplier || 2;
    this.jitter = options.jitter || true;
    
    this.circuitBreaker = {
      failureThreshold: options.failureThreshold || 5,
      recoveryTimeout: options.recoveryTimeout || 60000,
      state: 'CLOSED',
      failures: 0,
      lastFailureTime: null
    };
  }

  async execute(operation, context = {}) {
    if (this._isCircuitOpen()) {
      throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
    }

    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🌐 Попытка ${attempt}/${this.maxRetries}${context.url ? `: ${context.url}` : ''}`);
        
        const result = await operation();
        
        this._onSuccess();
        
        return result;
      } catch (error) {
        lastError = error;
        console.log(`❌ Попытка ${attempt} неудачна: ${error.message}`);
        
        if (this._isNonRetriableError(error)) {
          console.log(`🚫 Ошибка не подлежит повторению: ${error.message}`);
          this._onFailure();
          throw error;
        }
        
        if (attempt < this.maxRetries) {
          const delay = this._calculateDelay(attempt);
          console.log(`⏳ Ожидание ${delay}ms перед следующей попыткой...`);
          await this._sleep(delay);
        }
      }
    }
    
    this._onFailure();
    throw lastError;
  }

  _isCircuitOpen() {
    if (this.circuitBreaker.state === 'OPEN') {
      const timeSinceLastFailure = Date.now() - this.circuitBreaker.lastFailureTime;
      
      if (timeSinceLastFailure >= this.circuitBreaker.recoveryTimeout) {
        console.log('🔄 Circuit breaker переходит в состояние HALF_OPEN');
        this.circuitBreaker.state = 'HALF_OPEN';
        return false;
      }
      
      return true;
    }
    
    return false;
  }

  _onSuccess() {
    if (this.circuitBreaker.state === 'HALF_OPEN') {
      console.log('✅ Circuit breaker переходит в состояние CLOSED');
      this.circuitBreaker.state = 'CLOSED';
    }
    
    this.circuitBreaker.failures = 0;
  }

  _onFailure() {
    this.circuitBreaker.failures++;
    this.circuitBreaker.lastFailureTime = Date.now();
    
    if (this.circuitBreaker.failures >= this.circuitBreaker.failureThreshold) {
      console.log('🔴 Circuit breaker переходит в состояние OPEN');
      this.circuitBreaker.state = 'OPEN';
    }
  }

  _isNonRetriableError(error) {
    const nonRetriablePatterns = [
      'DNS resolution failed',
      'HTTP 4',
      'Invalid URL',
      'Protocol error',
      'CERT_',
      'self signed certificate'
    ];
    
    return nonRetriablePatterns.some(pattern => 
      error.message.includes(pattern)
    );
  }

  _calculateDelay(attempt) {
    let delay = this.baseDelay * Math.pow(this.backoffMultiplier, attempt - 1);
    
    delay = Math.min(delay, this.maxDelay);
    
    if (this.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }
    
    return Math.floor(delay);
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getCircuitBreakerState() {
    return {
      state: this.circuitBreaker.state,
      failures: this.circuitBreaker.failures,
      threshold: this.circuitBreaker.failureThreshold,
      lastFailureTime: this.circuitBreaker.lastFailureTime
    };
  }

  resetCircuitBreaker() {
    console.log('🔄 Manual circuit breaker reset');
    this.circuitBreaker.state = 'CLOSED';
    this.circuitBreaker.failures = 0;
    this.circuitBreaker.lastFailureTime = null;
  }
}

module.exports = RetryManager; 