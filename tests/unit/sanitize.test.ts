import { describe, it, expect } from 'vitest'
import {
  sanitizePlainText,
  sanitizeSimpleHTML,
  sanitizeRichHTML,
  sanitizeObject,
  sanitizeArray
} from '~/server/utils/sanitize'

describe('sanitize.ts', () => {
  describe('sanitizePlainText', () => {
    it('should remove all HTML tags', () => {
      expect(sanitizePlainText('<b>Hello</b>')).toBe('Hello')
      expect(sanitizePlainText('<div>Content</div>')).toBe('Content')
      expect(sanitizePlainText('<p>Paragraph</p>')).toBe('Paragraph')
    })

    it('should remove malicious scripts', () => {
      const result1 = sanitizePlainText('<img src=x onerror="malicious">Hello')
      expect(result1).not.toContain('<img')
      expect(result1).not.toContain('onerror')
      expect(result1).toContain('Hello')

      const result2 = sanitizePlainText('<a href="javascript:void(0)">Click</a>')
      expect(result2).not.toContain('<a')
      expect(result2).not.toContain('javascript:')
    })

    it('should preserve text content', () => {
      expect(sanitizePlainText('Just plain text')).toBe('Just plain text')
      const result = sanitizePlainText('Text with <b>bold</b> and <i>italic</i>')
      expect(result).toContain('Text with')
      expect(result).toContain('bold')
      expect(result).toContain('italic')
      expect(result).not.toContain('<b>')
    })

    it('should normalize whitespace', () => {
      expect(sanitizePlainText('  Multiple   spaces  ')).toBe('Multiple spaces')
      expect(sanitizePlainText('Line1\n\nLine2')).toBe('Line1 Line2')
    })

    it('should handle null and undefined', () => {
      expect(sanitizePlainText(null)).toBe('')
      expect(sanitizePlainText(undefined)).toBe('')
      expect(sanitizePlainText('')).toBe('')
    })

    it('should handle special characters', () => {
      expect(sanitizePlainText('Café & thé')).toBe('Café & thé')
      expect(sanitizePlainText('Email: test@example.com')).toBe('Email: test@example.com')
    })
  })

  describe('sanitizeSimpleHTML', () => {
    it('should allow basic formatting tags', () => {
      expect(sanitizeSimpleHTML('<b>Bold</b>')).toBe('<b>Bold</b>')
      expect(sanitizeSimpleHTML('<strong>Strong</strong>')).toBe('<strong>Strong</strong>')
      expect(sanitizeSimpleHTML('<em>Italic</em>')).toBe('<em>Italic</em>')
      expect(sanitizeSimpleHTML('<i>Italic</i>')).toBe('<i>Italic</i>')
    })

    it('should remove scripts and dangerous tags', () => {
      const result1 = sanitizeSimpleHTML('<div>Content</div><b>Safe</b>')
      expect(result1).not.toContain('<div')
      expect(result1).toContain('<b>Safe</b>')

      const result2 = sanitizeSimpleHTML('<img src=x onerror="malicious"><strong>Text</strong>')
      expect(result2).not.toContain('<img')
      expect(result2).toContain('<strong>Text</strong>')
    })

    it('should remove attributes from allowed tags', () => {
      expect(sanitizeSimpleHTML('<b class="test">Bold</b>')).toBe('<b>Bold</b>')
      expect(sanitizeSimpleHTML('<strong style="color:red">Text</strong>')).toBe(
        '<strong>Text</strong>'
      )
    })

    it('should handle paragraphs and line breaks', () => {
      expect(sanitizeSimpleHTML('<p>Paragraph</p>')).toBe('<p>Paragraph</p>')
      expect(sanitizeSimpleHTML('Line 1<br>Line 2')).toBe('Line 1<br>Line 2')
    })

    it('should handle null and undefined', () => {
      expect(sanitizeSimpleHTML(null)).toBe('')
      expect(sanitizeSimpleHTML(undefined)).toBe('')
      expect(sanitizeSimpleHTML('')).toBe('')
    })
  })

  describe('sanitizeRichHTML', () => {
    it('should allow rich text formatting', () => {
      expect(sanitizeRichHTML('<h1>Title</h1>')).toBe('<h1>Title</h1>')
      expect(sanitizeRichHTML('<h2>Subtitle</h2>')).toBe('<h2>Subtitle</h2>')
      expect(sanitizeRichHTML('<ul><li>Item</li></ul>')).toBe('<ul><li>Item</li></ul>')
    })

    it('should allow safe links with href', () => {
      const result = sanitizeRichHTML('<a href="https://example.com">Link</a>')
      expect(result).toContain('<a')
      expect(result).toContain('Link</a>')
      expect(result).not.toContain('<script')
    })

    it('should allow code blocks', () => {
      expect(sanitizeRichHTML('<pre><code>const x = 1;</code></pre>')).toBe(
        '<pre><code>const x = 1;</code></pre>'
      )
    })

    it('should allow blockquotes', () => {
      expect(sanitizeRichHTML('<blockquote>Quote</blockquote>')).toBe(
        '<blockquote>Quote</blockquote>'
      )
    })

    it('should remove scripts and dangerous elements', () => {
      const result1 = sanitizeRichHTML('<img src=x onerror="bad"><h1>Title</h1>')
      expect(result1).not.toContain('<img')
      expect(result1).toContain('<h1>Title</h1>')

      const result2 = sanitizeRichHTML('<iframe src="evil.com"></iframe><p>Text</p>')
      expect(result2).not.toContain('<iframe')
      expect(result2).toContain('<p>Text</p>')
    })

    it('should handle null and undefined', () => {
      expect(sanitizeRichHTML(null)).toBe('')
      expect(sanitizeRichHTML(undefined)).toBe('')
      expect(sanitizeRichHTML('')).toBe('')
    })
  })

  describe('sanitizeObject', () => {
    it('should sanitize specified fields', () => {
      const data = {
        testimony_text: '<b>My</b> testimony with text',
        moderation_notes: '<b>Approved</b>',
        email: 'test@example.com'
      }

      const result = sanitizeObject(data, {
        testimony_text: 'plain',
        moderation_notes: 'simple'
      })

      expect(result.testimony_text).toContain('testimony')
      expect(result.testimony_text).not.toContain('<b>')
      expect(result.testimony_text).toBe('My testimony with text')
      expect(result.moderation_notes).toBe('<b>Approved</b>')
      expect(result.email).toBe('test@example.com') // Not sanitized
    })

    it('should apply different sanitization types', () => {
      const data = {
        plain: '<b>Bold</b>',
        simple: '<b>Bold</b> text',
        rich: '<h1>Title</h1> content'
      }

      const result = sanitizeObject(data, {
        plain: 'plain',
        simple: 'simple',
        rich: 'rich'
      })

      expect(result.plain).toBe('Bold')
      expect(result.simple).toContain('<b>Bold</b>')
      expect(result.rich).toContain('<h1>Title</h1>')
    })

    it('should ignore non-existent fields', () => {
      const data = { name: 'John' }
      const result = sanitizeObject(data, { nonexistent: 'plain' })
      expect(result).toEqual({ name: 'John' })
    })

    it('should skip non-string fields', () => {
      const data = {
        text: '<b>Bold</b>',
        number: 42,
        boolean: true,
        object: { nested: 'value' }
      }

      const result = sanitizeObject(data, {
        text: 'plain',
        number: 'plain',
        boolean: 'plain',
        object: 'plain'
      })

      expect(result.text).toBe('Bold')
      expect(result.number).toBe(42)
      expect(result.boolean).toBe(true)
      expect(result.object).toEqual({ nested: 'value' })
    })
  })

  describe('sanitizeArray', () => {
    it('should sanitize all array items with plain text by default', () => {
      const arr = ['<b>Item 1</b>', 'Item 2', 'Item 3']
      const result = sanitizeArray(arr)
      expect(result).toHaveLength(3)
      expect(result[0]).toBe('Item 1')
      expect(result[0]).not.toContain('<b>')
    })

    it('should sanitize with specified type', () => {
      const arr = ['<b>Bold</b>', '<i>Italic</i>']
      const result = sanitizeArray(arr, 'simple')
      expect(result).toEqual(['<b>Bold</b>', '<i>Italic</i>'])
    })

    it('should filter out null and undefined', () => {
      const arr = ['Text', null, undefined, '<b>Bold</b>']
      const result = sanitizeArray(arr)
      expect(result).toEqual(['Text', 'Bold'])
    })

    it('should handle null and undefined array', () => {
      expect(sanitizeArray(null)).toEqual([])
      expect(sanitizeArray(undefined)).toEqual([])
    })

    it('should handle empty array', () => {
      expect(sanitizeArray([])).toEqual([])
    })
  })

  describe('XSS Attack Vectors', () => {
    const xssVectors = [
      '<img src=x onerror=malicious>',
      '<svg/onload=malicious>',
      '<iframe src="javascript:void"></iframe>',
      '<body onload=test>',
      '<input onfocus=test>',
      '<a href="javascript:void(0)">Click</a>',
      '<form action="javascript:void(0)"><button>Submit</button></form>'
    ]

    it('should block all common XSS attack vectors with plain text', () => {
      xssVectors.forEach(vector => {
        const result = sanitizePlainText(vector)
        expect(result).not.toContain('onerror')
        expect(result).not.toContain('onload')
        expect(result).not.toContain('onfocus')
        expect(result).not.toContain('javascript:')
      })
    })

    it('should block all common XSS attack vectors with simple HTML', () => {
      xssVectors.forEach(vector => {
        const result = sanitizeSimpleHTML(vector)
        expect(result).not.toContain('onerror')
        expect(result).not.toContain('onload')
        expect(result).not.toContain('onfocus')
        expect(result).not.toContain('javascript:')
      })
    })

    it('should block all common XSS attack vectors with rich HTML', () => {
      xssVectors.forEach(vector => {
        const result = sanitizeRichHTML(vector)
        expect(result).not.toContain('onerror')
        expect(result).not.toContain('onload')
        expect(result).not.toContain('onfocus')
        expect(result).not.toContain('javascript:')
      })
    })
  })
})
