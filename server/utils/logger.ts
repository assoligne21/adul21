import pino from 'pino'

// Determine if we're in development
const isDev = process.env.NODE_ENV === 'development'

// Create Pino logger instance
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          singleLine: false
        }
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV || 'development'
  },
  formatters: {
    level: (label) => {
      return { level: label }
    }
  }
})

// Child loggers for different domains
export const apiLogger = logger.child({ domain: 'api' })
export const dbLogger = logger.child({ domain: 'database' })
export const authLogger = logger.child({ domain: 'auth' })
export const emailLogger = logger.child({ domain: 'email' })

// Helper to log HTTP requests
export function logRequest(event: { node: { req: { method?: string; url?: string } } }) {
  const { method, url } = event.node.req
  apiLogger.info({ method, url }, 'Incoming request')
}

// Helper to log HTTP responses
export function logResponse(
  event: { node: { req: { method?: string; url?: string } } },
  statusCode: number,
  duration?: number
) {
  const { method, url } = event.node.req
  apiLogger.info({ method, url, statusCode, duration }, 'Request completed')
}

// Helper to log errors
export function logError(
  error: unknown,
  context?: Record<string, unknown>
) {
  const err = error as Error
  logger.error(
    {
      error: {
        message: err.message,
        stack: err.stack,
        name: err.name
      },
      ...context
    },
    'Error occurred'
  )
}

// Helper to log database operations
export function logDbQuery(
  query: string,
  params?: unknown[],
  duration?: number
) {
  dbLogger.debug({ query, params, duration }, 'Database query executed')
}

// Helper to log authentication events
export function logAuth(
  event: 'login' | 'logout' | 'token_refresh' | 'auth_failure',
  userId?: string,
  email?: string,
  details?: Record<string, unknown>
) {
  authLogger.info(
    {
      event,
      userId,
      email,
      ...details
    },
    `Authentication event: ${event}`
  )
}

// Helper to log email sending
export function logEmail(
  to: string,
  subject: string,
  success: boolean,
  error?: string
) {
  emailLogger.info(
    {
      to,
      subject,
      success,
      error
    },
    success ? 'Email sent successfully' : 'Email sending failed'
  )
}
