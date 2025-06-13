<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Парсер блога IS Systems
        </h1>
        <p class="text-lg text-gray-600">
          Поиск статей по ключевым словам
        </p>
      </header>

      <main>
        <SearchForm 
          @search="search.search" 
          :loading="search.loading.value"
        />
        
        <ErrorMessage 
          :message="search.error.value"
          dismissible
          @dismiss="search.clearError"
        />
        
        <ResultsList 
          :results="search.results.value" 
          :loading="search.loading.value"
        />
      </main>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import SearchForm from './components/SearchForm.vue'
import ResultsList from './components/ResultsList.vue'
import ErrorMessage from './components/ui/ErrorMessage.vue'
import { useSearch } from './composables/useSearch'

export default {
  name: 'App',
  components: {
    SearchForm,
    ResultsList,
    ErrorMessage
  },
  setup() {
    const search = useSearch()

    onMounted(() => {
      search.loadPosts()
    })

    return {
      search
    }
  }
}
</script> 
