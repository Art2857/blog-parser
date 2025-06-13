<template>
  <BaseCard hover padding="md" class="slide-in-up hover-lift">
    <article>
      <div class="flex flex-col space-y-3">
        <h3 class="text-xl font-semibold text-gray-900 hover:text-primary-600">
          <a 
            :href="post.link" 
            target="_blank" 
            rel="noopener noreferrer"
            class="hover:underline"
          >
            {{ post.title }}
          </a>
        </h3>
        
        <p v-if="post.descr" class="text-gray-700 leading-relaxed">
          {{ post.descr }}
        </p>
        
        <div class="flex items-center justify-between text-sm text-gray-500">
          <div class="flex items-center space-x-4">
            <time v-if="post.date" :datetime="post.date" class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>{{ formatDate(post.date) }}</span>
            </time>
            
            <div v-if="post.created_at" class="flex items-center space-x-1 text-xs">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>Обновлено: {{ formatDate(post.created_at) }}</span>
            </div>
          </div>
          
          <a 
            :href="post.link" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span>Читать далее</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  </BaseCard>
</template>

<script>
import BaseCard from './ui/BaseCard.vue'
import { formatDate } from '@/utils/dateFormatter'

export default {
  name: 'PostCard',
  components: {
    BaseCard
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      formatDate
    }
  }
}
</script>

 