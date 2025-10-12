import type { Member, ApiResponse } from '~/types/api'
import type { MemberForm } from '~/types/forms'

export function useMembers() {
  const members = ref<Member[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const filters = reactive({
    city: '',
    userType: '',
    membershipStatus: 'active' as Member['membership_status'],
    membershipType: '',
    searchQuery: ''
  })

  // Computed filtered members
  const filteredMembers = computed(() => {
    let result = members.value

    if (filters.city) {
      result = result.filter(m => m.city === filters.city)
    }

    if (filters.userType) {
      result = result.filter(m => m.user_type === filters.userType)
    }

    if (filters.membershipStatus) {
      result = result.filter(m => m.membership_status === filters.membershipStatus)
    }

    if (filters.membershipType) {
      result = result.filter(m => m.membership_type === filters.membershipType)
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(m =>
        m.first_name.toLowerCase().includes(query) ||
        m.last_name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query)
      )
    }

    return result
  })

  // Stats
  const stats = computed(() => ({
    total: members.value.length,
    active: members.value.filter(m => m.membership_status === 'active').length,
    pending: members.value.filter(m => m.membership_status === 'pending').length,
    expired: members.value.filter(m => m.membership_status === 'expired').length,
    cancelled: members.value.filter(m => m.membership_status === 'cancelled').length,
    wantsToParticipate: members.value.filter(m => m.wants_to_participate).length
  }))

  // Revenue stats
  const revenueStats = computed(() => ({
    totalAnnualRevenue: members.value
      .filter(m => m.membership_status === 'active')
      .reduce((sum, m) => sum + m.membership_fee, 0),
    averageFee: members.value.length > 0
      ? members.value.reduce((sum, m) => sum + m.membership_fee, 0) / members.value.length
      : 0,
    byType: {
      reduced: members.value
        .filter(m => m.membership_type === 'reduced' && m.membership_status === 'active')
        .reduce((sum, m) => sum + m.membership_fee, 0),
      normal: members.value
        .filter(m => m.membership_type === 'normal' && m.membership_status === 'active')
        .reduce((sum, m) => sum + m.membership_fee, 0),
      support: members.value
        .filter(m => m.membership_type === 'support' && m.membership_status === 'active')
        .reduce((sum, m) => sum + m.membership_fee, 0)
    }
  }))

  // Fetch all members
  async function fetchMembers(options?: {
    membershipStatus?: Member['membership_status']
    membershipType?: string
    wantsToParticipate?: boolean
  }) {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (options?.membershipStatus) params.append('membership_status', options.membershipStatus)
      if (options?.membershipType) params.append('membership_type', options.membershipType)
      if (options?.wantsToParticipate !== undefined) params.append('wants_to_participate', String(options.wantsToParticipate))

      const response = await $fetch<ApiResponse<Member[]>>(`/api/members?${params}`)

      if (response.error) {
        throw new Error(response.error)
      }

      members.value = response.data || []
      return response.data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
      console.error('Error fetching members:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch single member
  async function fetchMember(id: string) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Member>>(`/api/members/${id}`)

      if (response.error) {
        throw new Error(response.error)
      }

      return response.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
      console.error('Error fetching member:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  // Create member
  async function createMember(data: MemberForm) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Member>>('/api/members', {
        method: 'POST',
        body: data
      })

      if (response.error) {
        throw new Error(response.error)
      }

      if (response.data) {
        members.value.push(response.data)
      }

      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
      console.error('Error creating member:', e)
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Update member
  async function updateMember(id: string, data: Partial<Member>) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Member>>(`/api/members/${id}`, {
        method: 'PATCH',
        body: data
      })

      if (response.error) {
        throw new Error(response.error)
      }

      if (response.data) {
        const index = members.value.findIndex(m => m.id === id)
        if (index !== -1) {
          members.value[index] = response.data
        }
      }

      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
      console.error('Error updating member:', e)
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Delete member
  async function deleteMember(id: string) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse>(`/api/members/${id}`, {
        method: 'DELETE'
      })

      if (response.error) {
        throw new Error(response.error)
      }

      members.value = members.value.filter(m => m.id !== id)
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
      console.error('Error deleting member:', e)
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Update membership status
  async function updateMembershipStatus(
    id: string,
    status: Member['membership_status']
  ) {
    return updateMember(id, { membership_status: status })
  }

  // Renew membership
  async function renewMembership(id: string, endDate: string) {
    return updateMember(id, {
      membership_status: 'active',
      membership_end_date: endDate
    })
  }

  // Cancel membership
  async function cancelMembership(id: string) {
    return updateMember(id, {
      membership_status: 'cancelled',
      membership_end_date: new Date().toISOString()
    })
  }

  // Update Stripe info
  async function updateStripeInfo(id: string, stripeCustomerId: string) {
    return updateMember(id, { stripe_customer_id: stripeCustomerId })
  }

  // Get members expiring soon (within 30 days)
  const membersExpiringSoon = computed(() => {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    return members.value.filter(m => {
      if (!m.membership_end_date || m.membership_status !== 'active') return false
      const endDate = new Date(m.membership_end_date)
      const today = new Date()
      return endDate > today && endDate <= thirtyDaysFromNow
    })
  })

  // Get members by participation areas
  function getMembersByParticipationArea(area: string) {
    return members.value.filter(m =>
      m.wants_to_participate &&
      m.participation_areas?.includes(area)
    )
  }

  // Export members data (for admin)
  function exportMembersCSV() {
    const headers = [
      'Civilité', 'Prénom', 'Nom', 'Email', 'Téléphone',
      'Adresse', 'Code postal', 'Ville', 'Type utilisateur',
      'Type adhésion', 'Montant', 'Statut', 'Date début', 'Date fin'
    ]

    const rows = filteredMembers.value.map(m => [
      m.civility,
      m.first_name,
      m.last_name,
      m.email,
      m.phone || '',
      m.address,
      m.postal_code,
      m.city,
      m.user_type,
      m.membership_type,
      m.membership_fee,
      m.membership_status,
      m.membership_start_date || '',
      m.membership_end_date || ''
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `membres_adul21_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return {
    // State
    members,
    loading,
    error,
    filters,

    // Computed
    filteredMembers,
    stats,
    revenueStats,
    membersExpiringSoon,

    // Methods
    fetchMembers,
    fetchMember,
    createMember,
    updateMember,
    deleteMember,
    updateMembershipStatus,
    renewMembership,
    cancelMembership,
    updateStripeInfo,
    getMembersByParticipationArea,
    exportMembersCSV
  }
}
