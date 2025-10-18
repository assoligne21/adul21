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
      include: [
        'server/utils/*.ts',
        'server/validation/*.ts',
        'utils/**/*.ts'
      ],
      exclude: [
        'node_modules/**',
        '.nuxt/**',
        '.output/**',
        'dist/**',
        '**/*.config.{js,ts,mjs}',
        '**/coverage/**',
        '**/*.d.ts',
        // Exclude runtime-dependent files (require Nuxt/H3 runtime)
        'server/api/**',
        'server/routes/**',
        'server/middleware/**',
        'server/database/**',
        'server/utils/db.ts',
        'server/utils/mailer.ts',
        'server/utils/supabase-compat.ts',
        'composables/**',
        'scripts/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        'tests/**'
      ],
      thresholds: {
        lines: 75,
        functions: 70,
        branches: 70,
        statements: 75
      },
      all: true,
      reportOnFailure: true
    },
    globals: true,
    setupFiles: ['./tests/setup.ts']
  }
})
