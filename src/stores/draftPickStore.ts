// src/stores/draftPickStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { draftPickService } from '@/services/draftPickService'
import type { DraftPick, CrudMode } from '@/types'

export const useDraftPickStore = defineStore('draftPick', () => {
  // State - in memory only, fetched from server
  const draftPicks = ref<DraftPick[]>([])
  const currentDraftPick = ref<DraftPick | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const mode = ref<CrudMode>('read')

  // Getters
  const getDraftPickById = computed(() => {
    return (id: number) => draftPicks.value.find((item) => item.id === id)
  })

  const getDraftPicksByYear = computed(() => {
    return (year: number) => draftPicks.value.filter((item) => item.draftYear === year)
  })

  const getDraftPicksByTeam = computed(() => {
    return (teamId: number) => draftPicks.value.filter((item) => item.teamId === teamId)
  })

  const getDraftPicksByRound = computed(() => {
    return (round: number) => draftPicks.value.filter((item) => item.round === round)
  })

  // Actions - All data from REST API
  const fetchAll = async (refresh = false) => {
    if (draftPicks.value.length > 0 && !refresh) return

    loading.value = true
    error.value = null
    try {
      draftPicks.value = await draftPickService.getAll()
    } catch (err) {
      error.value = 'Failed to fetch draft picks from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number, useCache = true) => {
    if (useCache) {
      const cached = getDraftPickById.value(id)
      if (cached) {
        currentDraftPick.value = cached
        return cached
      }
    }

    loading.value = true
    error.value = null
    try {
      currentDraftPick.value = await draftPickService.getById(id)
      
      const index = draftPicks.value.findIndex((item) => item.id === id)
      if (index !== -1 && currentDraftPick.value) {
        draftPicks.value[index] = currentDraftPick.value
      }
      
      return currentDraftPick.value
    } catch (err) {
      error.value = 'Failed to fetch draft pick from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchByYear = async (year: number) => {
    loading.value = true
    error.value = null
    try {
      const yearPicks = await draftPickService.getByYear(year)
      // Update cache with new data
      yearPicks.forEach(pick => {
        const index = draftPicks.value.findIndex(item => item.id === pick.id)
        if (index !== -1) {
          draftPicks.value[index] = pick
        } else {
          draftPicks.value.push(pick)
        }
      })
      return yearPicks
    } catch (err) {
      error.value = 'Failed to fetch draft picks by year from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchByTeam = async (teamId: number) => {
    loading.value = true
    error.value = null
    try {
      const teamPicks = await draftPickService.getByTeam(teamId)
      // Update cache with new data
      teamPicks.forEach(pick => {
        const index = draftPicks.value.findIndex(item => item.id === pick.id)
        if (index !== -1) {
          draftPicks.value[index] = pick
        } else {
          draftPicks.value.push(pick)
        }
      })
      return teamPicks
    } catch (err) {
      error.value = 'Failed to fetch draft picks by team from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (data: Omit<DraftPick, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const newDraftPick = await draftPickService.create(data)
      draftPicks.value.push(newDraftPick)
      currentDraftPick.value = newDraftPick
      return newDraftPick
    } catch (err) {
      error.value = 'Failed to create draft pick on server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id: number, data: Partial<DraftPick>) => {
    loading.value = true
    error.value = null
    try {
      const updatedDraftPick = await draftPickService.update(id, data)
      const index = draftPicks.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        draftPicks.value[index] = updatedDraftPick
      }
      currentDraftPick.value = updatedDraftPick
      return updatedDraftPick
    } catch (err) {
      error.value = 'Failed to update draft pick on server'
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
      await draftPickService.delete(id)
      draftPicks.value = draftPicks.value.filter((item) => item.id !== id)
      if (currentDraftPick.value?.id === id) {
        currentDraftPick.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete draft pick on server'
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
    currentDraftPick.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const refreshData = () => {
    return fetchAll(true)
  }

  return {
    // State
    draftPicks,
    currentDraftPick,
    loading,
    error,
    mode,
    // Getters  
    getDraftPickById,
    getDraftPicksByYear,
    getDraftPicksByTeam,
    getDraftPicksByRound,
    // Actions
    fetchAll,
    fetchById,
    fetchByYear,
    fetchByTeam,
    create,
    update,
    remove,
    setMode,
    clearCurrent,
    clearError,
    refreshData,
  }
})