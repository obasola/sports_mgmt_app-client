import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { teamService } from '@/services/teamService'
import type { Team, CrudMode } from '@/types'

export const useTeamStore = defineStore('team', () => {
  // State - in memory only, fetched from server
  const teams = ref<Team[]>([])
  const currentTeam = ref<Team | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const mode = ref<CrudMode>('read')

  // Getters
  const getTeamById = computed(() => {
    return (id: number) => teams.value.find((item) => item.id === id)
  })

  const teamsByConference = computed(() => {
    return (conference: string) => teams.value.filter((team) => team.conference === conference)
  })

  const teamsByDivision = computed(() => {
    return (division: string) => teams.value.filter((team) => team.division === division)
  })

  // Actions - All data from REST API
  const fetchAll = async (refresh = false) => {
    if (teams.value.length > 0 && !refresh) return

    loading.value = true
    error.value = null
    try {
      const resp = await teamService.getAll()
      teams.value = resp.data
    } catch (err) {
      error.value = 'Failed to fetch teams from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number, useCache = true) => {
    if (useCache) {
      const cached = getTeamById.value(id)
      if (cached) {
        currentTeam.value = cached
        return cached
      }
    }

    loading.value = true
    error.value = null
    try {
      currentTeam.value = await teamService.getById(id)
      
      const index = teams.value.findIndex((item) => item.id === id)
      if (index !== -1 && currentTeam.value) {
        teams.value[index] = currentTeam.value
      }
      
      return currentTeam.value
    } catch (err) {
      error.value = 'Failed to fetch team from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (data: Omit<Team, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const newTeam = await teamService.create(data)
      teams.value.push(newTeam)
      currentTeam.value = newTeam
      return newTeam
    } catch (err) {
      error.value = 'Failed to create team on server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id: number, data: Partial<Team>) => {
    loading.value = true
    error.value = null
    try {
      const updatedTeam = await teamService.update(id, data)
      const index = teams.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        teams.value[index] = updatedTeam
      }
      currentTeam.value = updatedTeam
      return updatedTeam
    } catch (err) {
      error.value = 'Failed to update team on server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const remove = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await teamService.delete(id)
      teams.value = teams.value.filter((item) => item.id !== id)
      if (currentTeam.value?.id === id) {
        currentTeam.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete team on server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setMode = (newMode: CrudMode) => {
    mode.value = newMode
  }

  const clearCurrent = () => {
    currentTeam.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const refreshData = () => {
    return fetchAll(true)
  }

  return {
    // State
    teams,
    currentTeam,
    loading,
    error,
    mode,
    // Getters  
    getTeamById,
    teamsByConference,
    teamsByDivision,
    // Actions
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    setMode,
    clearCurrent,
    clearError,
    refreshData,
  }
})