<script setup lang="ts">
interface Props {
  value: string | number
  label: string
  color?: 'primary' | 'red' | 'orange' | 'green' | 'blue'
  icon?: string
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  icon: undefined,
  animate: false
})

const colorClasses = {
  primary: 'text-primary-600 dark:text-primary-400',
  red: 'text-red-600 dark:text-red-400',
  orange: 'text-orange-600 dark:text-orange-400',
  green: 'text-green-600 dark:text-green-400',
  blue: 'text-blue-600 dark:text-blue-400'
}

const bgColorClasses = {
  primary: 'bg-primary-50 dark:bg-primary-900/20',
  red: 'bg-red-50 dark:bg-red-900/20',
  orange: 'bg-orange-50 dark:bg-orange-900/20',
  green: 'bg-green-50 dark:bg-green-900/20',
  blue: 'bg-blue-50 dark:bg-blue-900/20'
}
</script>

<template>
  <UCard
    :class="[
      'text-center transition-all hover:shadow-lg',
      animate ? 'hover:scale-105' : ''
    ]"
    :ui="{
      body: { padding: 'p-6' }
    }"
  >
    <div v-if="icon" class="mb-3">
      <div :class="['w-12 h-12 rounded-full flex items-center justify-center mx-auto', bgColorClasses[color]]">
        <Icon :name="icon" :class="['w-6 h-6', colorClasses[color]]" />
      </div>
    </div>

    <div :class="['text-4xl md:text-5xl font-black mb-2', colorClasses[color]]">
      {{ value }}
    </div>

    <div class="text-sm md:text-base text-muted font-semibold uppercase tracking-wide">
      {{ label }}
    </div>
  </UCard>
</template>
