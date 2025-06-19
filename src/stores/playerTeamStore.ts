// src/stores/playerTeamStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { playerTeamService } from '@/services/playerTeamService'
import type { PlayerTeam, CreatePlayerTeam, CrudMode } from '@/types'

export const usePlayerTeamStore = defineStore('playerTeam', () => {
  // State - in memory only, fetched from server
  const playerTeams = ref<PlayerTeam[]>([])
  const currentPlayerTeam = ref<PlayerTeam | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const mode = ref<CrudMode>('read')

  // Getters
  const getPlayerTeamById = computed(() => {
    return (id: number) => playerTeams.value.find((item) => item.id === id)
  })

  const getPlayerTeamsByPlayerId = computed(() => {
    return (playerId: number) => playerTeams.value.filter((item) => item.playerId === playerId)
  })

  const getPlayerTeamsByTeamId = computed(() => {
    return (teamId: number) => playerTeams.value.filter((item) => item.teamId === teamId)
  })

  const getCurrentPlayerTeams = computed(() => {
    return playerTeams.value.filter((item) => item.currentTeam)
  })

  // Actions - All data from REST API
  const fetchAll = async (refresh = false) => {
    if (playerTeams.value.length > 0 && !refresh) return

    loading.value = true
    error.value = null
    try {
      const resp = await playerTeamService.getAll()
      playerTeams.value = resp.data
    } catch (err) {
      error.value = 'Failed to fetch player teams from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number, useCache = true) => {
    if (useCache) {
      const cached = getPlayerTeamById.value(id)
      if (cached) {
        currentPlayerTeam.value = cached
        return cached
      }
    }

    loading.value = true
    error.value = null
    try {
      currentPlayerTeam.value = await playerTeamService.getById(id)
      
      const index = playerTeams.value.findIndex((item) => item.id === id)
      if (index !== -1 && currentPlayerTeam.value) {
        playerTeams.value[index] = currentPlayerTeam.value
      }
      
      return currentPlayerTeam.value
    } catch (err) {
      error.value = 'Failed to fetch player team from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchByPlayerId = async (playerId: number) => {
    loading.value = true
    error.value = null
    try {
      const playerTeamData = await playerTeamService.getByPlayerId(playerId)
      // Update the main array with fetched data
      playerTeamData.forEach(pt => {
        const index = playerTeams.value.findIndex(item => item.id === pt.id)
        if (index !== -1) {
          playerTeams.value[index] = pt
        } else {
          playerTeams.value.push(pt)
        }
      })
      return playerTeamData
    } catch (err) {
      error.value = 'Failed to fetch player teams by player ID from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchByTeamId = async (teamId: number) => {
    loading.value = true
    error.value = null
    try {
      const teamPlayerData = await playerTeamService.getByTeamId(teamId)
      // Update the main array with fetched data
      teamPlayerData.forEach(pt => {
        const index = playerTeams.value.findIndex(item => item.id === pt.id)
        if (index !== -1) {
          playerTeams.value[index] = pt
        } else {
          playerTeams.value.push(pt)
        }
      })
      return teamPlayerData
    } catch (err) {
      error.value = 'Failed to fetch player teams by team ID from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (data: CreatePlayerTeam) => {
    loading.value = true
    error.value = null
    try {
      const newPlayerTeam = await playerTeamService.create(data)
      playerTeams.value.push(newPlayerTeam)
      currentPlayerTeam.value = newPlayerTeam
      return newPlayerTeam
    } catch (err) {
      error.value = 'Failed to create player team on server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id: number, data: Partial<PlayerTeam>) => {
    loading.value = true
    error.value = null
    try {
      const updatedPlayerTeam = await playerTeamService.update(id, data)
      const index = playerTeams.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        playerTeams.value[index] = updatedPlayerTeam
      }
      currentPlayerTeam.value = updatedPlayerTeam
      return updatedPlayerTeam
    } catch (err) {
      error.value = 'Failed to update player team on server'
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
      await playerTeamService.delete(id)
      playerTeams.value = playerTeams.value.filter((item) => item.id !== id)
      if (currentPlayerTeam.value?.id === id) {
        currentPlayerTeam.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete player team on server'
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
    currentPlayerTeam.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const refreshData = () => {
    return fetchAll(true)
  }

  return {
    // State
    playerTeams,
    currentPlayerTeam,
    loading,
    error,
    mode,
    // Getters  
    getPlayerTeamById,
    getPlayerTeamsByPlayerId,
    getPlayerTeamsByTeamId,
    getCurrentPlayerTeams,
    // Actions
    fetchAll,
    fetchById,
    fetchByPlayerId,
    fetchByTeamId,
    create,
    update,
    remove,
    setMode,
    clearCurrent,
    clearError,
    refreshData,
  }
})