import { ref, computed } from 'vue'
import { VALIDATION_LIMITS } from '@/constants'

export function useValidation(value, rules = {}) {
  const error = ref('')
  
  const validate = () => {
    const trimmed = value.value?.trim()
    
    if (!trimmed) {
      error.value = ''
      return true
    }
    
    for (const rule of Object.values(rules)) {
      const result = rule(trimmed)
      if (result !== true) {
        error.value = result
        return false
      }
    }
    
    error.value = ''
    return true
  }
  
  const isValid = computed(() => {
    const trimmed = value.value?.trim()
    return trimmed && trimmed.length > 0 && !error.value
  })
  
  return {
    error,
    isValid,
    validate
  }
}

export const validationRules = {
  minLength: (min = VALIDATION_LIMITS.SEARCH_MIN_LENGTH) => (value) => 
    value.length >= min || `Минимум ${min} символов`,
    
  maxLength: (max = VALIDATION_LIMITS.SEARCH_MAX_LENGTH) => (value) => 
    value.length <= max || `Максимум ${max} символов`,
    
  hasLetters: () => (value) => 
    /[a-zA-Zа-яА-Я]/.test(value) || 'Должно содержать буквы',
    
  noSpecialChars: () => (value) => 
    !/[<>{}[\]\\]/.test(value) || 'Недопустимые символы'
} 