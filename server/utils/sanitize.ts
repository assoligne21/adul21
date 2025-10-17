import DOMPurify from 'isomorphic-dompurify'

/**
 * Configuration DOMPurify pour texte brut (supprime tout HTML)
 * Utilisé pour les champs qui ne doivent contenir aucun HTML
 */
const PLAIN_TEXT_CONFIG = {
  ALLOWED_TAGS: [], // Aucun tag HTML autorisé
  ALLOWED_ATTR: [], // Aucun attribut autorisé
  KEEP_CONTENT: true // Garde le contenu texte, supprime juste les tags
}

/**
 * Configuration DOMPurify pour texte simple avec quelques balises de base
 * Utilisé pour les champs qui peuvent contenir du formatage basique
 */
const SIMPLE_HTML_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'], // Tags de formatage basiques
  ALLOWED_ATTR: [], // Aucun attribut (pas de class, style, etc.)
  KEEP_CONTENT: true
}

/**
 * Configuration DOMPurify pour HTML riche (articles, actualités)
 * Utilisé pour les contenus d'actualités créés par les admins
 */
const RICH_HTML_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'b', 'i', 'u',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'blockquote', 'pre', 'code'
  ],
  ALLOWED_ATTR: {
    'a': ['href', 'title', 'target', 'rel']
  },
  KEEP_CONTENT: true,
  // Force target="_blank" et rel="noopener noreferrer" pour les liens externes
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target', 'rel']
}

/**
 * Sanitize une chaîne en texte brut pur (supprime tout HTML)
 * À utiliser pour : témoignages, messages de contact, incidents
 *
 * @param input - La chaîne à nettoyer
 * @returns La chaîne nettoyée sans aucun HTML
 *
 * @example
 * sanitizePlainText('<script>alert("XSS")</script>Hello')
 * // Returns: 'Hello'
 *
 * sanitizePlainText('Bonjour <b>monde</b>!')
 * // Returns: 'Bonjour monde!'
 */
export function sanitizePlainText(input: string | null | undefined): string {
  if (!input) return ''

  const cleaned = DOMPurify.sanitize(input, PLAIN_TEXT_CONFIG)

  // Supprime les espaces multiples et trim
  return cleaned.replace(/\s+/g, ' ').trim()
}

/**
 * Sanitize une chaîne avec HTML simple (garde formatage basique)
 * À utiliser pour : notes de modération, descriptions courtes
 *
 * @param input - La chaîne à nettoyer
 * @returns La chaîne nettoyée avec uniquement les tags de base
 *
 * @example
 * sanitizeSimpleHTML('<script>alert("XSS")</script><b>Important</b>')
 * // Returns: '<b>Important</b>'
 *
 * sanitizeSimpleHTML('Texte en <strong>gras</strong> et <em>italique</em>')
 * // Returns: 'Texte en <strong>gras</strong> et <em>italique</em>'
 */
export function sanitizeSimpleHTML(input: string | null | undefined): string {
  if (!input) return ''

  return DOMPurify.sanitize(input, SIMPLE_HTML_CONFIG).trim()
}

/**
 * Sanitize une chaîne avec HTML riche (articles, actualités)
 * À utiliser pour : contenu des actualités créées par les admins
 *
 * @param input - La chaîne à nettoyer
 * @returns La chaîne nettoyée avec tags autorisés
 *
 * @example
 * sanitizeRichHTML('<h1>Titre</h1><p>Paragraphe <a href="https://example.com">lien</a></p>')
 * // Returns: '<h1>Titre</h1><p>Paragraphe <a href="https://example.com" target="_blank" rel="noopener noreferrer">lien</a></p>'
 */
export function sanitizeRichHTML(input: string | null | undefined): string {
  if (!input) return ''

  return DOMPurify.sanitize(input, RICH_HTML_CONFIG).trim()
}

/**
 * Sanitize un objet en appliquant la fonction appropriée à chaque champ
 * Facilite la sanitization de plusieurs champs à la fois
 *
 * @param obj - L'objet contenant les champs à nettoyer
 * @param fields - Map des noms de champs et leur type de sanitization
 * @returns L'objet avec les champs nettoyés
 *
 * @example
 * const data = {
 *   testimony_text: '<script>XSS</script>Mon témoignage',
 *   moderation_notes: '<b>Approuvé</b>',
 *   email: 'test@example.com'
 * }
 *
 * sanitizeObject(data, {
 *   testimony_text: 'plain',
 *   moderation_notes: 'simple'
 * })
 * // Returns: { testimony_text: 'Mon témoignage', moderation_notes: '<b>Approuvé</b>', email: 'test@example.com' }
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  fields: Record<string, 'plain' | 'simple' | 'rich'>
): T {
  const sanitized = { ...obj }

  for (const [field, type] of Object.entries(fields)) {
    if (field in sanitized && typeof sanitized[field] === 'string') {
      switch (type) {
        case 'plain':
          sanitized[field] = sanitizePlainText(sanitized[field])
          break
        case 'simple':
          sanitized[field] = sanitizeSimpleHTML(sanitized[field])
          break
        case 'rich':
          sanitized[field] = sanitizeRichHTML(sanitized[field])
          break
      }
    }
  }

  return sanitized
}

/**
 * Sanitize un tableau de chaînes
 *
 * @param arr - Le tableau à nettoyer
 * @param type - Le type de sanitization à appliquer
 * @returns Le tableau nettoyé
 */
export function sanitizeArray(
  arr: (string | null | undefined)[] | null | undefined,
  type: 'plain' | 'simple' | 'rich' = 'plain'
): string[] {
  if (!arr || !Array.isArray(arr)) return []

  const sanitizeFn = type === 'plain'
    ? sanitizePlainText
    : type === 'simple'
      ? sanitizeSimpleHTML
      : sanitizeRichHTML

  return arr.filter(item => item != null).map(item => sanitizeFn(item))
}
