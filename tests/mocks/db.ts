import { vi } from 'vitest'

/**
 * Mock database for integration tests
 * Simulates PostgreSQL queries without actual database connection
 */

// In-memory data stores
export const mockData = {
  members: [] as any[],
  testimonies: [] as any[],
  contacts: [] as any[],
  admins: [
    {
      id: '1',
      email: 'admin@adul21.fr',
      name: 'Admin Test',
      password_hash: '$2b$10$mockHashForTestingOnly',
      created_at: new Date('2024-01-01')
    }
  ],
  newsletter: [] as any[],
  premembers: [] as any[]
}

// Counter for auto-incrementing IDs
let idCounter = 1000

/**
 * Reset all mock data to initial state
 */
export function resetMockData() {
  mockData.members = []
  mockData.testimonies = []
  mockData.contacts = []
  mockData.newsletter = []
  mockData.premembers = []
  idCounter = 1000
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return String(++idCounter)
}

/**
 * Mock query function that simulates PostgreSQL queries
 */
export const mockQuery = vi.fn(async (sql: string, params: any[] = []) => {
  const sqlLower = sql.toLowerCase().trim()

  // SELECT queries
  if (sqlLower.startsWith('select')) {
    // Admin login query
    if (sqlLower.includes('from admins') && sqlLower.includes('where email')) {
      const email = params[0]
      const admin = mockData.admins.find(a => a.email === email)
      return { rows: admin ? [admin] : [], rowCount: admin ? 1 : 0 }
    }

    // Get all testimonies
    if (sqlLower.includes('from testimonies') && !sqlLower.includes('where id')) {
      const published = mockData.testimonies.filter(t => t.is_published === true)
      return { rows: published, rowCount: published.length }
    }

    // Get testimony by ID
    if (sqlLower.includes('from testimonies') && sqlLower.includes('where id')) {
      const id = params[0]
      const testimony = mockData.testimonies.find(t => t.id === id)
      return { rows: testimony ? [testimony] : [], rowCount: testimony ? 1 : 0 }
    }

    // Get all members
    if (sqlLower.includes('from members') && !sqlLower.includes('where')) {
      return { rows: mockData.members, rowCount: mockData.members.length }
    }

    // Get member by ID
    if (sqlLower.includes('from members') && sqlLower.includes('where id')) {
      const id = params[0]
      const member = mockData.members.find(m => m.id === id)
      return { rows: member ? [member] : [], rowCount: member ? 1 : 0 }
    }

    // Get member by email
    if (sqlLower.includes('from members') && sqlLower.includes('where email')) {
      const email = params[0]
      const member = mockData.members.find(m => m.email === email)
      return { rows: member ? [member] : [], rowCount: member ? 1 : 0 }
    }

    // Get all contacts
    if (sqlLower.includes('from contacts')) {
      return { rows: mockData.contacts, rowCount: mockData.contacts.length }
    }

    // Newsletter check
    if (sqlLower.includes('from newsletter_subscribers')) {
      const email = params[0]
      const subscriber = mockData.newsletter.find(s => s.email === email)
      return { rows: subscriber ? [subscriber] : [], rowCount: subscriber ? 1 : 0 }
    }

    // Pre-members count
    if (sqlLower.includes('count') && sqlLower.includes('pre_members')) {
      return { rows: [{ count: mockData.premembers.length }], rowCount: 1 }
    }

    // RGPD data access - member
    if (sqlLower.includes('from members') && sqlLower.includes('email')) {
      const email = params[0]
      const member = mockData.members.filter(m => m.email === email)
      return { rows: member, rowCount: member.length }
    }

    // Default empty result
    return { rows: [], rowCount: 0 }
  }

  // INSERT queries
  if (sqlLower.startsWith('insert')) {
    const id = generateId()
    const now = new Date()

    // Insert testimony
    if (sqlLower.includes('into testimonies')) {
      const testimony = {
        id,
        created_at: now,
        updated_at: now,
        is_published: false,
        ...extractInsertData(sql, params)
      }
      mockData.testimonies.push(testimony)
      return { rows: [{ id }], rowCount: 1 }
    }

    // Insert member
    if (sqlLower.includes('into members')) {
      const member = {
        id,
        created_at: now,
        updated_at: now,
        ...extractInsertData(sql, params)
      }
      mockData.members.push(member)
      return { rows: [{ id }], rowCount: 1 }
    }

    // Insert contact
    if (sqlLower.includes('into contacts') || sqlLower.includes('into contact_messages')) {
      const contact = {
        id,
        created_at: now,
        status: 'new',
        ...extractInsertData(sql, params)
      }
      mockData.contacts.push(contact)
      return { rows: [{ id }], rowCount: 1 }
    }

    // Insert newsletter subscriber
    if (sqlLower.includes('into newsletter_subscribers')) {
      const subscriber = {
        id,
        email: params[0] || extractInsertData(sql, params).email,
        subscribed_at: now,
        is_active: true
      }
      mockData.newsletter.push(subscriber)
      return { rows: [{ id }], rowCount: 1 }
    }

    // Insert pre-member
    if (sqlLower.includes('into pre_members')) {
      const premember = {
        id,
        created_at: now,
        ...extractInsertData(sql, params)
      }
      mockData.premembers.push(premember)
      return { rows: [{ id }], rowCount: 1 }
    }

    return { rows: [{ id }], rowCount: 1 }
  }

  // UPDATE queries
  if (sqlLower.startsWith('update')) {
    // Update testimony
    if (sqlLower.includes('testimonies')) {
      const id = params[params.length - 1] // Last param is usually ID
      const index = mockData.testimonies.findIndex(t => t.id === id)
      if (index !== -1) {
        mockData.testimonies[index] = {
          ...mockData.testimonies[index],
          updated_at: new Date()
        }
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    // Update member
    if (sqlLower.includes('members')) {
      const id = params[params.length - 1]
      const index = mockData.members.findIndex(m => m.id === id)
      if (index !== -1) {
        mockData.members[index] = {
          ...mockData.members[index],
          updated_at: new Date()
        }
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    // Update contact
    if (sqlLower.includes('contacts') || sqlLower.includes('contact_messages')) {
      const id = params[params.length - 1]
      const index = mockData.contacts.findIndex(c => c.id === id)
      if (index !== -1) {
        mockData.contacts[index] = {
          ...mockData.contacts[index],
          updated_at: new Date()
        }
        return { rows: [], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    return { rows: [], rowCount: 1 }
  }

  // DELETE queries
  if (sqlLower.startsWith('delete')) {
    // Delete testimony
    if (sqlLower.includes('from testimonies')) {
      const id = params[0]
      const initialLength = mockData.testimonies.length
      mockData.testimonies = mockData.testimonies.filter(t => t.id !== id)
      return { rows: [], rowCount: initialLength - mockData.testimonies.length }
    }

    // Delete member
    if (sqlLower.includes('from members')) {
      const id = params[0]
      const initialLength = mockData.members.length
      mockData.members = mockData.members.filter(m => m.id !== id)
      return { rows: [], rowCount: initialLength - mockData.members.length }
    }

    // Delete all member data (RGPD)
    if (sqlLower.includes('from members') && sqlLower.includes('email')) {
      const email = params[0]
      const initialLength = mockData.members.length
      mockData.members = mockData.members.filter(m => m.email !== email)
      mockData.testimonies = mockData.testimonies.filter(t => t.email !== email)
      mockData.contacts = mockData.contacts.filter(c => c.email !== email)
      return { rows: [], rowCount: initialLength - mockData.members.length }
    }

    return { rows: [], rowCount: 0 }
  }

  // Default response
  return { rows: [], rowCount: 0 }
})

/**
 * Extract data from INSERT statement
 * Simplified - assumes params are in order
 */
function extractInsertData(sql: string, params: any[]): Record<string, any> {
  const data: Record<string, any> = {}

  // Extract column names from SQL
  const columnsMatch = sql.match(/\((.*?)\)\s*values/i)
  if (columnsMatch && columnsMatch[1]) {
    const columns = columnsMatch[1].split(',').map(c => c.trim())
    columns.forEach((col, index) => {
      if (params[index] !== undefined) {
        data[col] = params[index]
      }
    })
  }

  return data
}

/**
 * Mock DB pool
 */
export const mockPool = {
  query: mockQuery,
  connect: vi.fn(async () => ({
    query: mockQuery,
    release: vi.fn()
  })),
  end: vi.fn()
}

/**
 * Mock getDb function
 */
export const mockGetDb = vi.fn(() => mockPool)
