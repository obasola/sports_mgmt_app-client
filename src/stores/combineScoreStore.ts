// src/stores/combineScoreStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { CombineScore, CrudMode } from '@/types'
import { combineScoreService } from '@/services/combineScoreService'

export const useCombineScoreStore = defineStore('combineScore', () => {
  // State
  const scores = ref<CombineScore[]>([])
  const currentScore = ref<CombineScore | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const mode = ref<CrudMode>('read')

  // Getters
  const getScoreById = computed(() => {
    return (id: number) => scores.value.find((s) => s.id === id)
  })

  const getScoreByPlayer = computed(() => {
    return (playerId: number) =>
      scores.value.find((s) => s.playerId === playerId)
  })

  const getTopPerformers = computed(() => {
    return (metric: keyof CombineScore, limit = 10) => {
      return [...scores.value]
        .sort((a, b) => {
          const aVal = a[metric] as number
          const bVal = b[metric] as number
          // For times (smaller is better)
          if (metric.includes('Time') || metric.includes('Split')) {
            return aVal - bVal
          }
          // For measurements (bigger is better)
          return bVal - aVal
        })
        .slice(0, limit)
    }
  })

  // Actions
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const resp = await combineScoreService.getAll()
      scores.value = resp.data
    } catch (err) {
      error.value = 'Failed to fetch combine scores'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      currentScore.value = await combineScoreService.getById(id)
    } catch (err) {
      error.value = 'Failed to fetch combine score'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchByPlayer = async (playerId: number) => {
    loading.value = true
    error.value = null
    try {
      currentScore.value = await combineScoreService.getByPlayer(playerId)
    } catch (err) {
      error.value = 'Failed to fetch combine score for player'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const create = async (score: Omit<CombineScore, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const newScore = await combineScoreService.create(score)
      scores.value.push(newScore)
      currentScore.value = newScore
      return newScore
    } catch (err) {
      error.value = 'Failed to create combine score'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id: number, score: Partial<CombineScore>) => {
    loading.value = true
    error.value = null
    try {
      const updatedScore = await combineScoreService.update(id, score)
      const index = scores.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        scores.value[index] = updatedScore
      }
      currentScore.value = updatedScore
      return updatedScore
    } catch (err) {
      error.value = 'Failed to update combine score'
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
      await combineScoreService.delete(id)
      scores.value = scores.value.filter((s) => s.id !== id)
      if (currentScore.value?.id === id) {
        currentScore.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete combine score'
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
    currentScore.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    scores,
    currentScore,
    loading,
    error,
    mode,
    // Getters
    getScoreById,
    getScoreByPlayer,
    getTopPerformers,
    // Actions
    fetchAll,
    fetchById,
    fetchByPlayer,
    create,
    update,
    remove,
    setMode,
    clearCurrent,
    clearError,
  }
})