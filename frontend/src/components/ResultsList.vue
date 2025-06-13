<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p class="text-gray-600">{{ UI_MESSAGES.LOADING }}</p>
    </div>

    <div v-else-if="results.length > 0" class="space-y-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Найдено статей: {{ results.length }}
        </h2>
        <div class="text-sm text-gray-500">
          Результаты с блога IS Systems
        </div>
      </div>
      
      <div class="space-y-4">
        <PostCard
          v-for="(post, index) in results"
          :key="post.id || index"
          :post="post"
          :style="{ animationDelay: `${index * ANIMATION.CARD_DELAY_INCREMENT}ms` }"
        />
      </div>
    </div>

    <div v-else class="text-center py-12">
      <div class="mb-4">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ UI_MESSAGES.NO_RESULTS }}</h3>
      <p class="text-gray-500">{{ UI_MESSAGES.TRY_ANOTHER_QUERY }}</p>
    </div>
  </div>
</template>

<script>
import PostCard from './PostCard.vue'
import { UI_MESSAGES, ANIMATION } from '@/constants'

export default {
  name: 'ResultsList',
  components: {
    PostCard
  },
  props: {
    results: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      UI_MESSAGES,
      ANIMATION
    }
  }
}
</script>

 
