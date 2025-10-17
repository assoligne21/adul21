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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        '.nuxt/**',
        '.output/**',
        'dist/**',
        '**/*.config.{js,ts,mjs}',
        '**/coverage/**',
        '**/*.d.ts',
        'server/database/migrations/**',
        'scripts/**',
        '**/*.spec.ts',
        '**/*.test.ts'
      ],
      thresholds: {
        lines: 40,
        functions: 40,
        branches: 40,
        statements: 40
      }
    },
    globals: true,
    setupFiles: ['./tests/setup.ts']
  }
})
