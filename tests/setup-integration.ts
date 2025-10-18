import { beforeAll, afterAll } from 'vitest'
import { setup, $fetch, createPage } from '@nuxt/test-utils/e2e'
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Load test environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

dotenv.config({ path: join(rootDir, '.env.test') })

beforeAll(async () => {
  await setup({
    rootDir,
    server: true,
    browser: false,
    nuxtConfig: {
      runtimeConfig: {
        databaseUrl: process.env.DATABASE_URL,
        jwtSecret: process.env.JWT_SECRET,
        gmailUser: process.env.GMAIL_USER,
        gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
        emailFrom: process.env.EMAIL_FROM
      }
    }
  })
})

afterAll(async () => {
  // Cleanup is handled by @nuxt/test-utils
})

// Export utilities for tests
export { $fetch, createPage }
