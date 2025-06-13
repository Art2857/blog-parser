const Logger = require('../../infrastructure/logging/Logger');


class ErrorHandler {

  static handle(err, req, res, next) {

    Logger.error(
      `API Error: ${req.method} ${req.url}`,
      err,
      {
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        body: req.method !== 'GET' ? req.body : undefined
      }
    );


    if (ErrorHandler._isDomainError(err)) {
      return res.status(400).json({
        error: err.message,
        type: 'validation_error'
      });
    }


    if (ErrorHandler._isDatabaseError(err)) {
      return res.status(500).json({
        error: 'Database error occurred',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }


    if (ErrorHandler._isNetworkError(err)) {
      return res.status(503).json({
        error: 'External service unavailable',
        message: 'Please try again later'
      });
    }


    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  }


  static _isDomainError(error) {
    const domainErrorPatterns = [
      'is required',
      'must be',
      'cannot be',
      'is too',
      'contains invalid',
      'contains system'
    ];

    return domainErrorPatterns.some(pattern =>
      error.message.toLowerCase().includes(pattern)
    );
  }


  static _isDatabaseError(error) {
    const dbErrorPatterns = [
      'Failed to fetch',
      'Failed to save',
      'Failed to clear',
      'Failed to search',
      'connection',
      'timeout',
      'ECONNREFUSED'
    ];

    return dbErrorPatterns.some(pattern =>
      error.message.toLowerCase().includes(pattern.toLowerCase())
    );
  }


  static _isNetworkError(error) {
    const networkErrorPatterns = [
      'Failed to parse blog',
      'Failed to fetch blog page',
      'Network error',
      'Request timeout',
      'ENOTFOUND',
      'ECONNABORTED'
    ];

    return networkErrorPatterns.some(pattern =>
      error.message.includes(pattern)
    );
  }


  static notFound(req, res) {
    res.status(404).json({
      error: 'Route not found',
      path: req.path,
      method: req.method
    });
  }
}

module.exports = ErrorHandler;
