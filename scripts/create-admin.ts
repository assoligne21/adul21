import { db } from '../server/database/connection'
import { adminUsers } from '../server/database/schema'
import { hashPassword } from '../server/utils/hash'
import { eq } from 'drizzle-orm'

async function createAdmin() {
  const email = 'assoligne21@gmail.com'
  const password = 'ADUL21Admin2025!' // Mot de passe initial - À CHANGER après la première connexion
  const name = 'ADUL21 Admin'

  console.log('🔐 Création de l\'utilisateur admin...')

  // Check if admin already exists
  const [existing] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1)

  if (existing) {
    console.log('⚠️  Un administrateur avec cet email existe déjà.')
    console.log(`Email: ${email}`)
    return
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Create admin user
  const [admin] = await db
    .insert(adminUsers)
    .values({
      email,
      passwordHash,
      name,
      isActive: true
    })
    .returning()

  console.log('✅ Utilisateur admin créé avec succès !')
  console.log('')
  console.log('📧 Email:', email)
  console.log('🔑 Mot de passe:', password)
  console.log('')
  console.log('⚠️  IMPORTANT: Changez le mot de passe après votre première connexion !')
  console.log('🌐 URL de connexion: https://adul21.fr/admin/login')
  console.log('')
}

createAdmin()
  .then(() => {
    console.log('✨ Terminé')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })
