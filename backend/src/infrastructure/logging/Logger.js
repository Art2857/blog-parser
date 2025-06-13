const morgan = require('morgan');


class Logger {


  static getStatusColor(status) {
    if (status >= 200 && status < 300) return '\x1b[32m';
    if (status >= 300 && status < 400) return '\x1b[33m';
    if (status >= 400 && status < 500) return '\x1b[31m';
    if (status >= 500) return '\x1b[35m';
    return '\x1b[0m';
  }


  static getMethodEmoji(method) {
    switch (method) {
      case 'GET': return '📥';
      case 'POST': return '📤';
      case 'PUT': return '✏️';
      case 'DELETE': return '🗑️';
      case 'PATCH': return '🔧';
      default: return '📋';
    }
  }


  static formatResponseTime(time) {
    if (time < 10) return `\x1b[32m${time}ms\x1b[0m`;
    if (time < 100) return `\x1b[33m${time}ms\x1b[0m`;
    return `\x1b[31m${time}ms\x1b[0m`;
  }


  static createMiddleware() {

    const devFormat = (tokens, req, res) => {
      const method = tokens.method(req, res);
      const url = tokens.url(req, res);
      const status = tokens.status(req, res);
      const responseTime = tokens['response-time'](req, res);
      const contentLength = tokens.res(req, res, 'content-length') || '0';

      const timestamp = new Date().toLocaleTimeString('ru-RU');
      const methodEmoji = Logger.getMethodEmoji(method);
      const statusColor = Logger.getStatusColor(parseInt(status));
      const formattedTime = Logger.formatResponseTime(parseFloat(responseTime));


      let requestInfo = '';
      if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        const contentType = req.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
          requestInfo = ` 📝 JSON`;
        }
      }


      const sizeInfo = contentLength !== '0' ? ` 📦 ${contentLength}b` : '';

      return [
        `\x1b[36m[${timestamp}]\x1b[0m`,
        `${methodEmoji} ${method}`,
        `\x1b[1m${url}\x1b[0m`,
        `${statusColor}${status}\x1b[0m`,
        formattedTime,
        requestInfo,
        sizeInfo
      ].filter(Boolean).join(' ');
    };


    const prodFormat = 'combined';


    const format = process.env.NODE_ENV === 'production' ? prodFormat : devFormat;

    return morgan(format, {

      skip: (req, res) => {
        return req.url === '/health' ||
               req.url.startsWith('/api-docs') ||
               req.url.includes('favicon');
      }
    });
  }


  static error(message, error = null, context = {}) {
    const timestamp = new Date().toISOString();
    console.error(`\x1b[31m[ERROR ${timestamp}]\x1b[0m ${message}`);

    if (error) {
      console.error(`\x1b[31m├─ Error:\x1b[0m ${error.message}`);
      if (error.stack && process.env.NODE_ENV !== 'production') {
        console.error(`\x1b[31m├─ Stack:\x1b[0m ${error.stack}`);
      }
    }

    if (Object.keys(context).length > 0) {
      console.error(`\x1b[31m└─ Context:\x1b[0m`, context);
    }
  }


  static info(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`\x1b[34m[INFO ${timestamp}]\x1b[0m ${message}`);

    if (data) {
      console.log(`\x1b[34m└─ Data:\x1b[0m`, data);
    }
  }


  static warn(message, data = null) {
    const timestamp = new Date().toISOString();
    console.warn(`\x1b[33m[WARN ${timestamp}]\x1b[0m ${message}`);

    if (data) {
      console.warn(`\x1b[33m└─ Data:\x1b[0m`, data);
    }
  }


  static success(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`\x1b[32m[SUCCESS ${timestamp}]\x1b[0m ${message}`);

    if (data) {
      console.log(`\x1b[32m└─ Data:\x1b[0m`, data);
    }
  }
}

module.exports = Logger;
