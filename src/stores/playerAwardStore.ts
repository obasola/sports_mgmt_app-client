// src/stores/playerAwardStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { playerAwardService } from '@/services/playerAwardService'
import type { PlayerAward, CrudMode } from '@/types'

export const usePlayerAwardStore = defineStore('playerAward', () => {
  // State - in memory only, fetched from server
  const playerAwards = ref<PlayerAward[]>([])
  const currentPlayerAward = ref<PlayerAward | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const mode = ref<CrudMode>('read')

  // Getters
  const getPlayerAwardById = computed(() => {
    return (id: number) => playerAwards.value.find((item) => item.id === id)
  })

  const getPlayerAwardsByPlayerId = computed(() => {
    return (playerId: number) => playerAwards.value.filter((item) => item.playerId === playerId)
  })

  // Actions - All data from REST API
  const fetchAll = async (refresh = false) => {
    if (playerAwards.value.length > 0 && !refresh) return

    loading.value = true
    error.value = null
    try {
      playerAwards.value = await playerAwardService.getAll()
    } catch (err) {
      error.value = 'Failed to fetch player awards from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number, useCache = true) => {
    if (useCache) {
      const cached = getPlayerAwardById.value(id)
      if (cached) {
        currentPlayerAward.value = cached
        return cached
      }
    }

    loading.value = true
    error.value = null
    try {
      currentPlayerAward.value = await playerAwardService.getById(id)
      
      const index = playerAwards.value.findIndex((item) => item.id === id)
      if (index !== -1 && currentPlayerAward.value) {
        playerAwards.value[index] = currentPlayerAward.value
      }
      
      return currentPlayerAward.value
    } catch (err) {
      error.value = 'Failed to fetch player award from server'
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
      const awards = await playerAwardService.getByPlayerId(playerId)
      // Update cache with fetched awards
      awards.forEach(award => {
        const index = playerAwards.value.findIndex(item => item.id === award.id)
        if (index !== -1) {
          playerAwards.value[index] = award
        } else {
          playerAwards.value.push(award)
        }
      })
      return awards
    } catch (err) {
      error.value = 'Failed to fetch player awards from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (data: Omit<PlayerAward, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const newPlayerAward = await playerAwardService.create(data)
      playerAwards.value.push(newPlayerAward)
      currentPlayerAward.value = newPlayerAward
      return newPlayerAward
    } catch (err) {
      error.value = 'Failed to create player award on server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id: number, data: Partial<PlayerAward>) => {
    loading.value = true
    error.value = null
    try {
      const updatedPlayerAward = await playerAwardService.update(id, data)
      const index = playerAwards.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        playerAwards.value[index] = updatedPlayerAward
      }
      currentPlayerAward.value = updatedPlayerAward
      return updatedPlayerAward
    } catch (err) {
      error.value = 'Failed to update player award on server'
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
      await playerAwardService.delete(id)
      playerAwards.value = playerAwards.value.filter((item) => item.id !== id)
      if (currentPlayerAward.value?.id === id) {
        currentPlayerAward.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete player award on server'
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
    currentPlayerAward.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const refreshData = () => {
    return fetchAll(true)
  }

  return {
    // State
    playerAwards,
    currentPlayerAward,
    loading,
    error,
    mode,
    // Getters  
    getPlayerAwardById,
    getPlayerAwardsByPlayerId,
    // Actions
    fetchAll,
    fetchById,
    fetchByPlayerId,
    create,
    update,
    remove,
    setMode,
    clearCurrent,
    clearError,
    refreshData,
  }
})