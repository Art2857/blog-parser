<template>
  <div class="space-y-2">
    <label 
      v-if="label" 
      :for="id" 
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>
    
    <div class="relative">
      <input
        :id="id"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :required="required"
        :class="inputClasses"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      
      <div v-if="showSpinner" class="absolute right-3 top-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
      </div>
    </div>
    
    <div v-if="error" class="text-red-600 text-sm">
      {{ error }}
    </div>
    
    <div v-if="helperText" class="text-gray-500 text-xs">
      {{ helperText }}
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BaseInput',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: null
    },
    error: {
      type: String,
      default: ''
    },
    helperText: {
      type: String,
      default: ''
    },
    showSpinner: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props) {
    const inputClasses = computed(() => [
      'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors',
      props.error 
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
      props.disabled && 'bg-gray-100 cursor-not-allowed'
    ])

    return {
      inputClasses
    }
  }
}
</script> 