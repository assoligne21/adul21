import type { Testimony, ApiResponse } from '~/types/api'
import type { TestimonyForm } from '~/types/forms'

export function useTestimonies() {
  const testimonies = ref<Testimony[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const filters = reactive({
    city: '',
    userType: '',
    moderationStatus: 'approved' as Testimony['moderation_status'],
    searchQuery: ''
  })

  // Computed filtered testimonies
  const filteredTestimonies = computed(() => {
    let result = testimonies.value

    if (filters.city) {
      result = result.filter(t => t.city === filters.city)
    }

    if (filters.userType) {
      result = result.filter(t => t.user_type === filters.userType)
    }

    if (filters.moderationStatus) {
      result = result.filter(t => t.moderation_status === filters.moderationStatus)
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(t =>
        t.testimony_text.toLowerCase().includes(query) ||
        t.first_name.toLowerCase().includes(query) ||
        (t.last_name?.toLowerCase().includes(query) ?? false)
      )
    }

    return result
  })

  // Stats
  const stats = computed(() => ({
    total: testimonies.value.length,
    pending: testimonies.value.filter(t => t.moderation_status === 'pending').length,
    approved: testimonies.value.filter(t => t.moderation_status === 'approved').length,
    published: testimonies.value.filter(t => t.is_published).length,
    featured: testimonies.value.filter(t => t.is_featured).length
  }))

  // Fetch all testimonies
  async function fetchTestimonies(options?: {
    moderationStatus?: Testimony['moderation_status']
    published?: boolean
    featured?: boolean
  }) {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (options?.moderationStatus) params.append('moderation_status', options.moderationStatus)
      if (options?.published !== undefined) params.append('published', String(options.published))
      if (options?.featured !== undefined) params.append('featured', String(options.featured))

      const response = await $fetch<ApiResponse<Testimony[]>>(`/api/testimonies?${params}`)

      if (response.error) {
        throw new Error(response.error)
      }

      testimonies.value = response.data || []
      return response.data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
      console.error('Error fetching testimonies:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch single testimony
  async function fetchTestimony(id: string) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Testimony>>(`/api/testimonies/${id}`)

      if (response.error) {
        throw new Error(response.error)
      }

      return response.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
      console.error('Error fetching testimony:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  // Create testimony
  async function createTestimony(data: TestimonyForm) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Testimony>>('/api/testimonies', {
        method: 'POST',
        body: data
      })

      if (response.error) {
        throw new Error(response.error)
      }

      if (response.data) {
        testimonies.value.push(response.data)
      }

      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
      console.error('Error creating testimony:', e)
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Update testimony
  async function updateTestimony(id: string, data: Partial<Testimony>) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Testimony>>(`/api/testimonies/${id}`, {
        method: 'PATCH',
        body: data
      })

      if (response.error) {
        throw new Error(response.error)
      }

      if (response.data) {
        const index = testimonies.value.findIndex(t => t.id === id)
        if (index !== -1) {
          testimonies.value[index] = response.data
        }
      }

      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
      console.error('Error updating testimony:', e)
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Delete testimony
  async function deleteTestimony(id: string) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse>(`/api/testimonies/${id}`, {
        method: 'DELETE'
      })

      if (response.error) {
        throw new Error(response.error)
      }

      testimonies.value = testimonies.value.filter(t => t.id !== id)
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
      console.error('Error deleting testimony:', e)
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Moderate testimony
  async function moderateTestimony(
    id: string,
    status: Testimony['moderation_status'],
    notes?: string
  ) {
    return updateTestimony(id, {
      moderation_status: status,
      moderation_notes: notes,
      moderated_at: new Date().toISOString()
    })
  }

  // Publish/unpublish testimony
  async function togglePublish(id: string, isPublished: boolean) {
    return updateTestimony(id, { is_published: isPublished })
  }

  // Feature/unfeature testimony
  async function toggleFeature(id: string, isFeatured: boolean) {
    return updateTestimony(id, { is_featured: isFeatured })
  }

  // Increment view count
  async function incrementViews(id: string) {
    try {
      await $fetch(`/api/testimonies/${id}/views`, { method: 'POST' })
    } catch (e) {
      console.error('Error incrementing views:', e)
    }
  }

  // Increment reactions count
  async function incrementReactions(id: string) {
    try {
      await $fetch(`/api/testimonies/${id}/reactions`, { method: 'POST' })
    } catch (e) {
      console.error('Error incrementing reactions:', e)
    }
  }

  // Increment shares count
  async function incrementShares(id: string) {
    try {
      await $fetch(`/api/testimonies/${id}/shares`, { method: 'POST' })
    } catch (e) {
      console.error('Error incrementing shares:', e)
    }
  }

  return {
    // State
    testimonies,
    loading,
    error,
    filters,

    // Computed
    filteredTestimonies,
    stats,

    // Methods
    fetchTestimonies,
    fetchTestimony,
    createTestimony,
    updateTestimony,
    deleteTestimony,
    moderateTestimony,
    togglePublish,
    toggleFeature,
    incrementViews,
    incrementReactions,
    incrementShares
  }
}
