import { getDb } from '~/server/database/connection'
import { incidents } from '~/server/database/schema'
import { incidentSchema } from '~/server/validation/schemas'
import { sanitizePlainText } from '~/server/utils/sanitize'

export default defineEventHandler(async (event) => {
  const db = getDb(event)

  try {
    const body = await readBody(event)
    const validatedData = incidentSchema.parse(body)

    const [newIncident] = await db.insert(incidents).values({
      incidentDate: validatedData.incident_date,
      incidentTime: validatedData.incident_time,
      incidentType: validatedData.incident_type,
      busLine: validatedData.bus_line,
      description: sanitizePlainText(validatedData.description),
      consequence: validatedData.consequence,
      consequenceDetails: sanitizePlainText(validatedData.consequence_details),
      taxiCost: validatedData.taxi_cost?.toString(),
      email: validatedData.email
    }).returning()

    return {
      success: true,
      message: 'Incident signal� avec succ�s',
      data: newIncident
    }
  } catch (error: unknown) {
    console.error('Error creating incident:', error)

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Donn�es invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du signalement de l\'incident'
    })
  }
})
