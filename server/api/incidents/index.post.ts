import { db } from '~/server/database/connection'
import { incidents } from '~/server/database/schema'
import { incidentSchema } from '~/server/validation/schemas'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = incidentSchema.parse(body)

    const [newIncident] = await db.insert(incidents).values({
      incidentDate: validatedData.incident_date,
      incidentTime: validatedData.incident_time,
      incidentType: validatedData.incident_type,
      busLine: validatedData.bus_line,
      description: validatedData.description,
      consequence: validatedData.consequence,
      consequenceDetails: validatedData.consequence_details,
      taxiCost: validatedData.taxi_cost?.toString(),
      email: validatedData.email
    }).returning()

    return {
      success: true,
      message: 'Incident signalé avec succès',
      data: newIncident
    }
  } catch (error: any) {
    console.error('Error creating incident:', error)

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du signalement de l\'incident'
    })
  }
})
