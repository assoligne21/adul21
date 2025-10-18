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
    environment: 'nuxt',
    include: ['tests/integration/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'tests/unit/**', 'node_modules/**'],
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
        overrides: {
          // Configuration Nuxt pour les tests
        }
      }
    }
  }
})
