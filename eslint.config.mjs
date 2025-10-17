// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Ignore patterns
  {
    ignores: [
      'node_modules',
      '.nuxt',
      '.output',
      'dist',
      '.vercel',
      '.netlify',
      'server/database/migrations/*.sql',
      '*.log',
      '.DS_Store',
      '.env',
      '.env.*',
      '!.env.example'
    ]
  },
  // Your custom configs here
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'warn', // Warn on 'any' type usage
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],

      // Vue rules
      'vue/multi-word-component-names': 'off', // Allow single word component names
      'vue/no-v-html': 'warn', // Warn on v-html usage (XSS risk)
      'vue/require-default-prop': 'off',
      'vue/html-self-closing': ['error', {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        }
      }],

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],

      // Security rules
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    }
  }
)
