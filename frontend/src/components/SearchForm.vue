<template>
  <div class="max-w-2xl mx-auto mb-8">
    <BaseCard>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <BaseInput
          id="searchWord"
          v-model="searchWord"
          label="Искомое слово"
          placeholder="Введите слово для поиска..."
          :disabled="loading"
          :maxlength="VALIDATION_LIMITS.SEARCH_MAX_LENGTH"
          :required="true"
          :error="validation.error.value"
          :helper-text="searchWord.length > 0 ? `${searchWord.length}/${VALIDATION_LIMITS.SEARCH_MAX_LENGTH} символов` : ''"
          :show-spinner="loading"
        />
        
        <BaseButton
          type="submit"
          :disabled="loading || !validation.isValid.value"
          :loading="loading"
          full-width
        >
          {{ loading ? 'Поиск...' : 'Искать' }}
        </BaseButton>
      </form>
    </BaseCard>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import BaseCard from './ui/BaseCard.vue'
import BaseInput from './ui/BaseInput.vue'
import BaseButton from './ui/BaseButton.vue'
import { useValidation, validationRules } from '@/composables/useValidation'
import { VALIDATION_LIMITS } from '@/constants'

export default {
  name: 'SearchForm',
  components: {
    BaseCard,
    BaseInput,
    BaseButton
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['search'],
  setup(props, { emit }) {
    const searchWord = ref('')
    
    const validation = useValidation(searchWord, {
      minLength: validationRules.minLength(),
      maxLength: validationRules.maxLength(),
      hasLetters: validationRules.hasLetters(),
      noSpecialChars: validationRules.noSpecialChars()
    })

    watch(searchWord, validation.validate)

    const onSubmit = () => {
      validation.validate()
      
      if (validation.isValid.value) {
        emit('search', searchWord.value.trim())
      }
    }

    return {
      searchWord,
      validation,
      onSubmit,
      VALIDATION_LIMITS
    }
  }
}
</script> 
