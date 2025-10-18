import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '.'),
      '@': path.resolve(__dirname, '.')
    }
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'tests/integration/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['server/**/*.ts', 'composables/**/*.ts', 'utils/**/*.ts'],
      exclude: [
        'node_modules/**',
        '.nuxt/**',
        '.output/**',
        'dist/**',
        '**/*.config.{js,ts,mjs}',
        '**/coverage/**',
        '**/*.d.ts',
        'server/database/migrations/**',
        'server/database/schema.ts',
        'server/database/connection.ts',
        'scripts/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        'tests/**'
      ],
      thresholds: {
        lines: 5,
        functions: 25,
        branches: 45,
        statements: 5
      }
    },
    globals: true,
    setupFiles: ['./tests/setup.ts']
  }
})
