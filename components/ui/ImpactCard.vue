<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon: string
  color?: 'primary' | 'red' | 'orange' | 'green' | 'blue'
  value?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  value: undefined
})

const colorClasses = {
  primary: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20',
  red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
  orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
  green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
}
</script>

<template>
  <UCard class="hover:shadow-lg transition-all hover:scale-[1.02]">
    <div class="flex items-start gap-4">
      <div :class="['w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0', colorClasses[color].split(' ').slice(2).join(' ')]">
        <Icon :name="icon" :class="['w-6 h-6', colorClasses[color].split(' ').slice(0, 2).join(' ')]" />
      </div>

      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold mb-2">{{ title }}</h3>
        <p class="text-sm text-muted">{{ description }}</p>

        <div v-if="value" class="mt-4">
          <div :class="['text-3xl font-black', colorClasses[color].split(' ').slice(0, 2).join(' ')]">
            {{ value }}
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
