// src/stores/prospectStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { prospectService } from '@/services/prospectService'
import type { Prospect, CrudMode } from '@/types'

export const useProspectStore = defineStore('prospect', () => {
  // State - in memory only, fetched from server
  const prospects = ref<Prospect[]>([])
  const currentProspect = ref<Prospect | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const mode = ref<CrudMode>('read')

  // Getters
  const getProspectById = computed(() => {
    return (id: number) => prospects.value.find((item) => item.id === id)
  })

  const getProspectsByPosition = computed(() => {
    return (position: string) => prospects.value.filter((item) => item.position === position)
  })

  const getProspectsByCollege = computed(() => {
    return (college: string) => prospects.value.filter((item) => item.college === college)
  })

  const getUndraftedProspects = computed(() => {
    return prospects.value.filter((item) => !item.drafted)
  })

  const getDraftedProspects = computed(() => {
    return prospects.value.filter((item) => item.drafted)
  })

  // Actions - All data from REST API
  const fetchAll = async (refresh = false) => {
    if (prospects.value.length > 0 && !refresh) return

    loading.value = true
    error.value = null
    try {
      const resp = await prospectService.getAll()
      prospects.value = resp.data
    } catch (err) {
      error.value = 'Failed to fetch prospects from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: number, useCache = true) => {
    if (useCache) {
      const cached = getProspectById.value(id)
      if (cached) {
        currentProspect.value = cached
        return cached
      }
    }

    loading.value = true
    error.value = null
    try {
      currentProspect.value = await prospectService.getById(id)
      
      const index = prospects.value.findIndex((item) => item.id === id)
      if (index !== -1 && currentProspect.value) {
        prospects.value[index] = currentProspect.value
      }
      
      return currentProspect.value
    } catch (err) {
      error.value = 'Failed to fetch prospect from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchByPosition = async (position: string) => {
    loading.value = true
    error.value = null
    try {
      return await prospectService.getByPosition(position)
    } catch (err) {
      error.value = 'Failed to fetch prospects by position from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchByCollege = async (college: string) => {
    loading.value = true
    error.value = null
    try {
      return await prospectService.getByCollege(college)
    } catch (err) {
      error.value = 'Failed to fetch prospects by college from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUndrafted = async () => {
    loading.value = true
    error.value = null
    try {
      return await prospectService.getUndrafted()
    } catch (err) {
      error.value = 'Failed to fetch undrafted prospects from server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (data: Omit<Prospect, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const newProspect = await prospectService.create(data)
      prospects.value.push(newProspect)
      currentProspect.value = newProspect
      return newProspect
    } catch (err) {
      error.value = 'Failed to create prospect on server'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id: number, data: Partial<Prospect>) => {
    loading.value = true
    error.value = null
    try {
      const updatedProspect = await prospectService.update(id, data)
      const index = prospects.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        prospects.value[index] = updatedProspect
      }
      currentProspect.value = updatedProspect
      return updatedProspect
    } catch (err) {
      error.value = 'Failed to update prospect on server'
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
      await prospectService.delete(id)
      prospects.value = prospects.value.filter((item) => item.id !== id)
      if (currentProspect.value?.id === id) {
        currentProspect.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete prospect on server'
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
    currentProspect.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const refreshData = () => {
    return fetchAll(true)
  }

  return {
    // State
    prospects,
    currentProspect,
    loading,
    error,
    mode,
    // Getters  
    getProspectById,
    getProspectsByPosition,
    getProspectsByCollege,
    getUndraftedProspects,
    getDraftedProspects,
    // Actions
    fetchAll,
    fetchById,
    fetchByPosition,
    fetchByCollege,
    fetchUndrafted,
    create,
    update,
    remove,
    setMode,
    clearCurrent,
    clearError,
    refreshData,
  }
})