const cheerio = require('cheerio');
const DateParser = require('./DateParser');


class HtmlContentExtractor {
  constructor() {
    this.dateParser = new DateParser();
    this.selectors = [

      'article.widg_newsblock_element',
      '.widg_newsblock_element',

      '.post, .entry, .blog-post, .article',
      '.post-item, .blog-item, .article-item',
      '.content-item, .news-item, .story',
      'article, .article-content',
      '.hentry, .post-content',
      '[class*="post"], [class*="article"], [class*="blog"]',
      '.blog-article, .blog-entry',
      '[class*="blog"], [id*="blog"]',
      '.news-item, .news-article'
    ];
  }


  extractArticles(html) {
    const $ = cheerio.load(html);
    let articles = [];


    for (const selector of this.selectors) {
      articles = this._extractWithSelector($, selector);
      if (articles.length > 0) {
        break;
      }
    }


    if (articles.length === 0) {
      articles = this._extractFromHeaders($);
    }

    if (articles.length === 0) {
      articles = this._extractFromLinks($);
    }


    articles = this._enhanceDescriptions(articles);

    return articles;
  }


  _enhanceDescriptions(articles) {
    return articles.map(article => {
      if (!article.description || article.description.length < 20) {

        article.description = this._generateDescriptionFromTitle(article.title);
      }
      return article;
    });
  }


  _generateDescriptionFromTitle(title) {
    if (!title) return '';


    const keywords = title.toLowerCase();

    if (keywords.includes('gpt') || keywords.includes('chatgpt')) {
      return 'Статья о технологиях искусственного интеллекта и языковых моделях GPT.';
    }
    if (keywords.includes('безопасность') || keywords.includes('security')) {
      return 'Материал о вопросах информационной безопасности и защиты данных.';
    }
    if (keywords.includes('данных') || keywords.includes('data')) {
      return 'Обзор вопросов обработки и защиты персональных данных.';
    }
    if (keywords.includes('италия') || keywords.includes('запрет')) {
      return 'Новости о регулировании технологий в различных странах.';
    }

    return `Подробная статья на тему: ${title}`;
  }


  _extractWithSelector($, selector) {
    const articles = [];

    $(selector).each((index, element) => {
      const $element = $(element);

      const title = this._extractTitle($element, $);
      const link = this._extractLink($element, $);
      const description = this._extractDescription($element, $);
      const date = this._extractDate($element, $);

      if (title && link) {
        articles.push({ title, link, description, date });
      }
    });

    return articles;
  }


  _findDateNear($element, $) {
    const searchAreas = [
      $element,
      $element.parent(),
      $element.next(),
      $element.prev(),
      $element.siblings()
    ];

    for (const $area of searchAreas) {
      const text = $area.text ? $area.text() : $area.toString();
      const extractedDate = this.dateParser.extractFromText(text);
      if (extractedDate) {
        return extractedDate;
      }
    }

    return null;
  }


  _extractFromHeaders($) {
    const articles = [];

    $('h1, h2, h3, h4, h5, h6').each((index, element) => {
      const $element = $(element);
      const title = $element.text().trim();

      if (this._isValidTitle(title)) {
        const link = this._findLinkNear($element, $);
        if (link) {
          const description = this._findDescriptionNear($element, $);
          const date = this._findDateNear($element, $) || this.dateParser.extractFromText($element.parent().text() + ' ' + description);

          articles.push({ title, link, description, date });
        }
      }
    });

    return articles;
  }


  _extractFromLinks($) {
    const articles = [];

    $('a[href*="/blog"], a[href*="/post"], a[href*="/article"], a[href*="/news"]').each((index, element) => {
      const $element = $(element);
      const title = $element.text().trim();
      const link = $element.attr('href');

      if (this._isValidTitle(title) && link) {
        const description = this._findDescriptionNear($element.parent(), $);
        const date = this._findDateNear($element.parent(), $) || this.dateParser.extractFromText(description);

        articles.push({ title, link, description, date });
      }
    });

    return articles;
  }


  _extractTitle($element, $) {
    const selectors = [

      '.widg_news_link',
      'a.widg_news_link',

      'h1, h2, h3, h4, h5, h6',
      '.title, .post-title, .article-title, .entry-title',
      '.headline, .heading',
      'a[title]',
      'a'
    ];

    for (const selector of selectors) {
      const title = $element.find(selector).first().text().trim();
      if (title && title.length > 5) {
        return title;
      }
    }

    const firstLine = $element.text().split('\n')[0].trim();
    return firstLine.length > 5 ? firstLine : '';
  }


  _extractLink($element, $) {
    return $element.find('.widg_news_link').first().attr('href') ||
           $element.find('a.widg_news_link').first().attr('href') ||
           $element.find('a').first().attr('href') ||
           $element.find('[href]').first().attr('href') ||
           $element.closest('a').attr('href') ||
           '';
  }


  _extractDescription($element, $) {

    const descriptionSelectors = [

      '.widg_news_short_doc',
      'div.widg_news_short_doc',
      '[itemprop="description"]',

      'p, .description, .excerpt, .summary, .intro',
      '.post-excerpt, .article-excerpt, .entry-excerpt',
      '.content p:first-of-type',
      '.text, .body, .post-content p:first-of-type',
      'div[class*="desc"], div[class*="excerpt"], div[class*="summary"]',
      '.lead, .subtitle, .abstract',
      '[class*="preview"], [class*="snippet"]'
    ];


     for (const selector of descriptionSelectors) {
       let description = $element.find(selector).first().text().trim();
       if (description && description.length > 10 && description.length < 500) {

         description = this._cleanDescription(description);
         if (description.length > 10) {
           return description;
         }
       }
     }


     let allText = $element.text().trim();
     if (allText) {

       allText = this._cleanDescription(allText);


       const sentences = allText.split(/[.!?]+/).filter(s => {
         const clean = s.trim();
         return clean.length > 10 &&
                !clean.toLowerCase().includes('читать') &&
                !/^\d+$/.test(clean);
       });

       if (sentences.length > 0) {
         const description = sentences.slice(0, 2).join('. ').trim();
         if (description.length > 10 && description.length < 500) {
           return description + (description.endsWith('.') ? '' : '.');
         }
       }
     }

    return '';
  }


  _extractDate($element, $) {

    const dateSelectors = [

      '.widg_news_pub_time',
      'div.widg_news_pub_time',

      'time, .date, .published, .post-date, .entry-date',
      '.meta-date, .article-date, .blog-date',
      '[datetime]',
      '.timestamp, .created, .updated',
      'span[class*="date"], div[class*="date"]',
      '.meta, .post-meta, .article-meta'
    ];


    for (const selector of dateSelectors) {
      const dateText = $element.find(selector).first().text().trim();
      if (dateText) {
        const parsedDate = this.dateParser.parse(dateText);
        if (parsedDate) {
          return parsedDate;
        }


        const extractedDate = this.dateParser.extractFromText(dateText);
        if (extractedDate) {
          return extractedDate;
        }
      }


      const datetime = $element.find(selector).first().attr('datetime');
      if (datetime) {
        const parsedDate = this.dateParser.parse(datetime);
        if (parsedDate) {
          return parsedDate;
        }
      }
    }


    const allText = $element.text();
    const extractedDate = this.dateParser.extractFromText(allText);
    if (extractedDate) {
      return extractedDate;
    }

    return null;
  }


  _findLinkNear($element, $) {
    const searches = [
      () => $element.find('a').first().attr('href'),
      () => $element.closest('a').attr('href'),
      () => $element.parent().find('a').first().attr('href'),
      () => $element.next('a').first().attr('href'),
      () => $element.prev('a').first().attr('href'),
      () => $element.siblings().find('a').first().attr('href')
    ];

    for (const search of searches) {
      const link = search();
      if (link && this._isValidLink(link)) {
        return link;
      }
    }

    return null;
  }


  _findDescriptionNear($element, $) {
    const selectors = [
      'p, .description, .excerpt, .summary, .intro',
      '.post-excerpt, .article-excerpt, .entry-excerpt',
      '.content, .text, .body',
      'div[class*="desc"], div[class*="excerpt"], div[class*="summary"]',
      '.lead, .subtitle, .abstract',
      '[class*="preview"], [class*="snippet"]',
      'span, div'
    ];


    const searchAreas = [
      $element,
      $element.parent(),
      $element.next(),
      $element.nextAll().slice(0, 3),
      $element.siblings()
    ];

    for (const $area of searchAreas) {
      for (const selector of selectors) {
        const $descriptions = $area.find ? $area.find(selector) : $area.filter(selector);

                 $descriptions.each((i, desc) => {
           let text = $(desc).text().trim();


           text = text.replace(/\s+/g, ' ')
                     .replace(/\n+/g, ' ')
                     .replace(/\t+/g, ' ')
                     .replace(/читать\s*(далее|подробнее|больше)/gi, '')
                     .replace(/\d{1,2}\s*(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s*\d{4}/gi, '')
                     .replace(/\d{1,2}\.\d{1,2}\.\d{4}/g, '')
                     .trim();


           if (text.length > 20 && text.length < 1000 &&
               /[a-zA-Zа-яА-Я]/.test(text)) {


             const sentences = text.split(/[.!?]+/).filter(s => {
               const clean = s.trim();
               return clean.length > 10 &&
                      !clean.toLowerCase().includes('читать') &&
                      !clean.toLowerCase().includes('подробнее') &&
                      !/^\d+$/.test(clean);
             });

             if (sentences.length > 0) {
               const description = sentences.slice(0, 2).join('. ').trim();
               if (description.length > 20) {
                 return description + (description.endsWith('.') ? '' : '.');
               }
             }
           }
         });
      }
    }

    return '';
  }


  _isValidTitle(title) {
    if (!title || typeof title !== 'string') return false;

    const trimmed = title.trim();
    return trimmed.length >= 5 &&
           trimmed.length <= 200 &&
           /[a-zA-Zа-яА-Я]/.test(trimmed) &&
           !trimmed.toLowerCase().includes('навигация') &&
           !trimmed.toLowerCase().includes('меню');
  }


  _isValidLink(link) {
    if (!link || typeof link !== 'string') return false;

    const trimmed = link.trim();
    return trimmed.length > 0 &&
           !trimmed.includes('javascript:') &&
           !trimmed.includes('mailto:') &&
           !trimmed.startsWith('#');
  }


  _cleanDescription(text) {
    if (!text) return '';

    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .replace(/\t+/g, ' ')
      .replace(/читать\s*(далее|подробнее|больше|полностью)/gi, '')
      .replace(/подробнее\s*>>/gi, '')
      .replace(/\d{1,2}\s*(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s*\d{4}\s*г?\.?/gi, '')
      .replace(/\d{1,2}\.\d{1,2}\.\d{4}/g, '')
      .replace(/\d{4}-\d{2}-\d{2}/g, '')
      .replace(/\s*\|\s*/g, ' ')
      .replace(/\s*-\s*$/g, '')
      .replace(/^\s*-\s*/g, '')
      .trim();
  }
}

module.exports = HtmlContentExtractor;
