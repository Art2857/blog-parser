
class DateParser {
  constructor() {
    this.ruMonths = {
      'января': 'January', 'февраля': 'February', 'марта': 'March',
      'апреля': 'April', 'мая': 'May', 'июня': 'June',
      'июля': 'July', 'августа': 'August', 'сентября': 'September',
      'октября': 'October', 'ноября': 'November', 'декабря': 'December'
    };

    this.datePatterns = [

      /(\d{1,2}\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+\d{4}\s*г?\.?\s*\d{1,2}:\d{2})/gi,

      /(\d{1,2}\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+\d{4}\s*г?\.?)/gi,

      /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/g,
      /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/g,

      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi,

      /(\d{4}-\d{2}-\d{2}T?\d{2}:\d{2}:\d{2})/g
    ];
  }


  parse(dateString) {
    if (!dateString) return null;

    try {
      let date = new Date(dateString);

      if (isNaN(date)) {
        date = this._parseRussianDate(dateString);
      }

      if (date instanceof Date && !isNaN(date) &&
          date.getFullYear() > 2000 && date.getFullYear() < 2030) {
        return this._formatForDatabase(date);
      }

      return null;
    } catch (error) {
      return null;
    }
  }


  extractFromText(text) {
    if (!text) return null;

    for (const pattern of this.datePatterns) {
      const match = text.match(pattern);
      if (match) {
        const parsedDate = this.parse(match[0]);
        if (parsedDate) {
          return parsedDate;
        }
      }
    }

    return null;
  }


  _parseRussianDate(dateString) {
    let englishDate = dateString;


    englishDate = englishDate.replace(/\s*г\.?\s*/gi, ' ');


    for (const [ru, en] of Object.entries(this.ruMonths)) {
      englishDate = englishDate.replace(new RegExp(ru, 'gi'), en);
    }


    englishDate = englishDate.trim().replace(/\s+/g, ' ');


    let date = new Date(englishDate);


    if (isNaN(date)) {

      const match = englishDate.match(/(\d{1,2})\s+(\w+)\s+(\d{4})\s*(\d{1,2}:\d{2})?/);
      if (match) {
        const [, day, month, year, time] = match;
        const dateStr = `${month} ${day}, ${year}${time ? ` ${time}` : ''}`;
        date = new Date(dateStr);
      }
    }

    return isNaN(date) ? null : date;
  }


  _formatForDatabase(date) {
    return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
  }
}

module.exports = DateParser;
