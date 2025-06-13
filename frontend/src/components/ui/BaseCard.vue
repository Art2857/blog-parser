<template>
  <div :class="cardClasses">
    <slot></slot>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BaseCard',
  props: {
    padding: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'none'].includes(value)
    },
    shadow: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
    },
    hover: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const baseClasses = 'bg-white rounded-lg transition-all duration-200'
    
    const paddingClasses = computed(() => {
      const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
      }
      return paddings[props.padding]
    })
    
    const shadowClasses = computed(() => {
      const shadows = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg'
      }
      return shadows[props.shadow]
    })
    
    const cardClasses = computed(() => [
      baseClasses,
      paddingClasses.value,
      shadowClasses.value,
      props.border && 'border border-gray-100',
      props.hover && 'hover:shadow-lg hover:border-primary-200'
    ])

    return {
      cardClasses
    }
  }
}
</script> 