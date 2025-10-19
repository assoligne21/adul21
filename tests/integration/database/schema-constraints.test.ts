import { describe, it, expect, afterAll } from 'vitest'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { eq } from 'drizzle-orm'
import { preMembers, members, testimonies } from '~/server/database/schema'

/**
 * Tests de vérification des contraintes de base de données
 *
 * Ces tests vérifient que le schéma en production correspond au schéma attendu,
 * notamment pour les champs optionnels qui doivent accepter NULL ou des chaînes vides.
 */
describe('Database Schema Constraints', () => {
  const connectionString = process.env.DATABASE_URL || ''

  if (!connectionString) {
    it.skip('DATABASE_URL not set, skipping schema tests')
    return
  }

  const sql = postgres(connectionString)
  const db = drizzle(sql)

  it('should allow empty string for phone in pre_members table', async () => {
    const testEmail = `schema-test-${Date.now()}@example.com`

    // Test avec chaîne vide pour le téléphone
    const [result] = await db.insert(preMembers).values({
      firstName: 'Test',
      lastName: 'Schema',
      email: testEmail,
      phone: '', // Chaîne vide - doit être acceptée
      city: 'Ledenon',
      userType: 'other',
      wantsToBecomeMember: false,
      wantsToVolunteer: false,
      canHostMeeting: false,
      canDistributeFlyers: false,
      participationAreas: [],
      acceptsNewsletter: false,
      acceptsContactWhenCreated: false,
      acceptsAgInvitation: false
    }).returning()

    expect(result).toBeDefined()
    expect(result.phone).toBe('')

    // Cleanup
    await db.delete(preMembers).where(eq(preMembers.email, testEmail))
  })

  it('should allow empty string for phone in members table', async () => {
    const testEmail = `schema-member-test-${Date.now()}@example.com`

    const [result] = await db.insert(members).values({
      civility: 'M.',
      firstName: 'Test',
      lastName: 'Schema',
      email: testEmail,
      phone: '', // Chaîne vide
      address: '123 Test Street',
      postalCode: '30210',
      city: 'Ledenon',
      userType: 'other',
      membershipFee: 10,
      membershipType: 'normal',
      membershipStatus: 'pending',
      wantsToParticipate: false,
      acceptsNewsletter: false,
      acceptsTestimonyPublication: false,
      acceptsMediaContact: false,
      acceptsActionSolicitation: false
    }).returning()

    expect(result).toBeDefined()
    expect(result.phone).toBe('')

    // Cleanup
    await db.delete(members).where(eq(members.email, testEmail))
  })

  it('should allow empty string for phone in testimonies table', async () => {
    const testEmail = `schema-testimony-test-${Date.now()}@example.com`

    const [result] = await db.insert(testimonies).values({
      firstName: 'Test',
      lastName: 'Schema',
      email: testEmail,
      phone: '', // Chaîne vide
      city: 'Ledenon',
      ageRange: '30-50',
      userType: 'other',
      testimonyText: 'Test testimony for schema validation',
      publicationPreference: 'anonymous',
      acceptsSitePublication: true,
      acceptsLegalUse: true
    }).returning()

    expect(result).toBeDefined()
    expect(result.phone).toBe('')

    // Cleanup
    await db.delete(testimonies).where(eq(testimonies.id, result.id))
  })

  afterAll(async () => {
    await sql.end()
  })
})
