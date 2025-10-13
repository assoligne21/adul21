export interface AdminUser {
  id: string
  email: string
  name: string
}

export const useAuth = () => {
  const user = useState<AdminUser | null>('admin-user', () => null)
  const loading = useState<boolean>('auth-loading', () => false)

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      user.value = response.user
      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        message: error.data?.message || 'Erreur de connexion'
      }
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
      user.value = null
      await navigateTo('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const checkAuth = async () => {
    if (user.value) return true

    loading.value = true
    try {
      const response = await $fetch('/api/auth/me')
      user.value = response.user
      return true
    } catch (error) {
      user.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}
