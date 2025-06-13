import { ref } from 'vue'
import { apiService } from '@/services/apiService'
import { UI_MESSAGES } from '@/constants'

export function useSearch() {
  const results = ref([])
  const loading = ref(false)
  const error = ref('')

  const search = async (searchWord) => {
    loading.value = true
    error.value = ''
    
    try {
      const searchResults = await apiService.searchPosts(searchWord)
      results.value = searchResults
      
      if (searchResults.length === 0) {
        error.value = UI_MESSAGES.ERROR_NO_RESULTS(searchWord)
      }
    } catch (err) {
      console.error('Search error:', err)
      error.value = err.message || UI_MESSAGES.ERROR_GENERIC
      results.value = []
    } finally {
      loading.value = false
    }
  }

  const loadPosts = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const posts = await apiService.getPosts()
      results.value = posts
    } catch (err) {
      console.error('Load posts error:', err)
      error.value = 'Ошибка загрузки статей'
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = ''
  }

  return {
    results,
    loading,
    error,
    search,
    loadPosts,
    clearError
  }
} 