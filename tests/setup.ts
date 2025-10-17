// Global test setup
import { vi } from 'vitest'

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key-for-vitest'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.GMAIL_USER = 'test@example.com'
process.env.GMAIL_APP_PASSWORD = 'test-password'
process.env.EMAIL_FROM = 'Test <test@example.com>'

// Mock global functions if needed
global.console = {
  ...console,
  error: vi.fn(), // Suppress console.error in tests unless explicitly needed
  warn: vi.fn()
}
