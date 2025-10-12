export const useAuth = () => {
  const authToken = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    secure: true,
    httpOnly: true,
    sameSite: 'lax'
  })

  const isAuthenticated = computed(() => !!authToken.value)

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response.token) {
        authToken.value = response.token
        return { success: true }
      }

      return { success: false, error: 'Invalid credentials' }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
      authToken.value = null
      navigateTo('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const checkAuth = async () => {
    if (!authToken.value) return false

    try {
      const response = await $fetch('/api/auth/check', {
        method: 'GET'
      })
      return response.authenticated
    } catch (error) {
      authToken.value = null
      return false
    }
  }

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}
