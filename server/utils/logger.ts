/**
 * Structured logging module using Pino
 *
 * Provides centralized logging with different log levels and domain-specific child loggers.
 * Uses pino-pretty in development for human-readable output, and JSON in production.
 *
 * @module server/utils/logger
 */

import pino from 'pino'

// Determine if we're in development
const isDev = process.env.NODE_ENV === 'development'

/**
 * Root Pino logger instance
 *
 * Configured with:
 * - Level: debug in dev, info in production
 * - Pretty printing in development
 * - JSON output in production
 * - Environment metadata
 */
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

/** Child logger for API-related logs */
export const apiLogger = logger.child({ domain: 'api' })

/** Child logger for database-related logs */
export const dbLogger = logger.child({ domain: 'database' })

/** Child logger for authentication-related logs */
export const authLogger = logger.child({ domain: 'auth' })

/** Child logger for email-related logs */
export const emailLogger = logger.child({ domain: 'email' })

/**
 * Log incoming HTTP request
 *
 * @param event - Nuxt event object containing HTTP request details
 *
 * @example
 * ```ts
 * export default defineEventHandler((event) => {
 *   logRequest(event)
 *   // ... handle request
 * })
 * ```
 */
export function logRequest(event: { node: { req: { method?: string; url?: string } } }) {
  const { method, url } = event.node.req
  apiLogger.info({ method, url }, 'Incoming request')
}

/**
 * Log HTTP response with status code and duration
 *
 * @param event - Nuxt event object containing HTTP request details
 * @param statusCode - HTTP status code returned
 * @param duration - Request duration in milliseconds (optional)
 *
 * @example
 * ```ts
 * const startTime = Date.now()
 * // ... process request
 * logResponse(event, 200, Date.now() - startTime)
 * ```
 */
export function logResponse(
  event: { node: { req: { method?: string; url?: string } } },
  statusCode: number,
  duration?: number
) {
  const { method, url } = event.node.req
  apiLogger.info({ method, url, statusCode, duration }, 'Request completed')
}

/**
 * Log error with stack trace and additional context
 *
 * Extracts message, stack, and name from Error object and logs
 * with any additional context provided
 *
 * @param error - Error object or unknown error
 * @param context - Additional context to include in log (route, user ID, etc.)
 *
 * @example
 * ```ts
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   logError(error, { route: '/api/users', userId: '123' })
 * }
 * ```
 */
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

/**
 * Log database query execution (debug level)
 *
 * @param query - SQL query or operation description
 * @param params - Query parameters (optional)
 * @param duration - Query execution time in milliseconds (optional)
 *
 * @example
 * ```ts
 * const startTime = Date.now()
 * const result = await db.select().from(users)
 * logDbQuery('SELECT * FROM users', [], Date.now() - startTime)
 * ```
 */
export function logDbQuery(
  query: string,
  params?: unknown[],
  duration?: number
) {
  dbLogger.debug({ query, params, duration }, 'Database query executed')
}

/**
 * Log authentication events for security monitoring
 *
 * @param event - Type of authentication event
 * @param userId - User ID if available (optional)
 * @param email - User email if available (optional)
 * @param details - Additional details (reason, IP, duration, etc.)
 *
 * @example
 * ```ts
 * logAuth('login', user.id, user.email, { duration: 150 })
 * logAuth('auth_failure', undefined, email, { reason: 'invalid_password' })
 * ```
 */
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

/**
 * Log email sending attempts and results
 *
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param success - Whether email was sent successfully
 * @param error - Error message if sending failed (optional)
 *
 * @example
 * ```ts
 * try {
 *   await sendEmail({ to, subject, html })
 *   logEmail(to, subject, true)
 * } catch (error) {
 *   logEmail(to, subject, false, error.message)
 * }
 * ```
 */
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
