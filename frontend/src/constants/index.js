export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 30000
}

export const VALIDATION_LIMITS = {
  SEARCH_MIN_LENGTH: 2,
  SEARCH_MAX_LENGTH: 100
}

export const UI_MESSAGES = {
  LOADING: 'Поиск статей...',
  NO_RESULTS: 'Статьи не найдены',
  TRY_ANOTHER_QUERY: 'Попробуйте изменить поисковый запрос',
  ERROR_GENERIC: 'Произошла ошибка при поиске статей. Попробуйте позже.',
  ERROR_NO_RESULTS: (query) => `По запросу "${query}" статьи не найдены. Попробуйте другое слово.`
}

export const ANIMATION = {
  CARD_DELAY_INCREMENT: 100
} 