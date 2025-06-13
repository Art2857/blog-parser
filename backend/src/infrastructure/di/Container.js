const db = require('../config/database');


const Article = require('../../domain/entities/Article');
const SearchQuery = require('../../domain/valueObjects/SearchQuery');


const SearchArticlesUseCase = require('../../application/useCases/SearchArticlesUseCase');
const GetArticlesUseCase = require('../../application/useCases/GetArticlesUseCase');


const PostgresArticleRepository = require('../repositories/PostgresArticleRepository');
const IsSystemsBlogParser = require('../parsers/IsSystemsBlogParser');


const ArticleController = require('../../presentation/controllers/ArticleController');


class Container {
  constructor() {
    this._services = new Map();
    this._singletons = new Map();
    this._registerServices();
  }


  _registerServices() {

    this.registerSingleton('database', () => db);

    this.registerSingleton('articleRepository', () =>
      new PostgresArticleRepository(this.get('database'))
    );

    this.registerSingleton('blogParser', () =>
      new IsSystemsBlogParser()
    );


    this.registerSingleton('searchArticlesUseCase', () =>
      new SearchArticlesUseCase(
        this.get('articleRepository'),
        this.get('blogParser')
      )
    );

    this.registerSingleton('getArticlesUseCase', () =>
      new GetArticlesUseCase(
        this.get('articleRepository')
      )
    );


    this.registerSingleton('articleController', () =>
      new ArticleController(
        this.get('searchArticlesUseCase'),
        this.get('getArticlesUseCase')
      )
    );
  }


  registerSingleton(name, factory) {
    this._services.set(name, { factory, singleton: true });
  }


  registerTransient(name, factory) {
    this._services.set(name, { factory, singleton: false });
  }


  get(name) {
    const service = this._services.get(name);

    if (!service) {
      throw new Error(`Service '${name}' not found in container`);
    }

    if (service.singleton) {
      if (!this._singletons.has(name)) {
        this._singletons.set(name, service.factory());
      }
      return this._singletons.get(name);
    }

    return service.factory();
  }


  has(name) {
    return this._services.has(name);
  }


  clearSingletons() {
    this._singletons.clear();
  }
}


module.exports = new Container();
