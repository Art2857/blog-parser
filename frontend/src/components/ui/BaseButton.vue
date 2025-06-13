<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <div v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
    <slot></slot>
  </button>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'button'
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props) {
    const baseClasses = 'font-medium rounded-lg transition-colors duration-200 flex items-center justify-center'
    
    const variantClasses = computed(() => {
      const variants = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
        danger: 'bg-red-600 hover:bg-red-700 text-white'
      }
      return variants[props.variant]
    })
    
    const sizeClasses = computed(() => {
      const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg'
      }
      return sizes[props.size]
    })
    
    const buttonClasses = computed(() => [
      baseClasses,
      variantClasses.value,
      sizeClasses.value,
      props.fullWidth && 'w-full',
      (props.disabled || props.loading) && 'opacity-50 cursor-not-allowed'
    ])

    return {
      buttonClasses
    }
  }
}
</script> 