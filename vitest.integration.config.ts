import { defineVitestConfig } from '@nuxt/test-utils/config'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load test environment variables before anything else
const envConfig = config({ path: resolve(__dirname, '.env.test') })

// Ensure DATABASE_URL is available globally for postgres-js connections
if (!process.env.DATABASE_URL && envConfig.parsed?.DATABASE_URL) {
  process.env.DATABASE_URL = envConfig.parsed.DATABASE_URL
  process.env.JWT_SECRET = envConfig.parsed.JWT_SECRET
  process.env.GMAIL_USER = envConfig.parsed.GMAIL_USER
  process.env.GMAIL_APP_PASSWORD = envConfig.parsed.GMAIL_APP_PASSWORD
  process.env.EMAIL_FROM = envConfig.parsed.EMAIL_FROM
  process.env.NODE_ENV = 'test'
}

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    include: ['tests/integration/**/*.test.ts'],
    exclude: ['tests/unit/**', 'tests/e2e/**', 'node_modules/**'],
    globals: true,
    setupFiles: ['./tests/setup-integration.ts'],
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
        overrides: {
          runtimeConfig: {
            databaseUrl: process.env.DATABASE_URL,
            jwtSecret: process.env.JWT_SECRET,
            gmailUser: process.env.GMAIL_USER,
            gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
            emailFrom: process.env.EMAIL_FROM
          }
        }
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage/integration',
      include: ['server/**/*.ts', 'composables/**/*.ts'],
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
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70
      },
      all: true,
      reportOnFailure: true
    }
  }
})
