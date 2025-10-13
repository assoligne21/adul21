export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip auth check for login page
  if (to.path === '/admin/login') {
    return
  }

  // Check authentication for admin routes
  if (to.path.startsWith('/admin')) {
    const { checkAuth } = useAuth()
    const isAuth = await checkAuth()

    if (!isAuth) {
      return navigateTo('/admin/login')
    }
  }
})
