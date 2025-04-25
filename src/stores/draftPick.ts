// src/infrastructure/store/modules/draftPick.ts
import { defineStore } from 'pinia'
import type { DraftPick } from '@/domain/models/DraftPick'
import { DraftPickService } from '@/domain/services/DraftPickService'
import { DuplicateEntityError } from '@/domain/services/errors/DuplicateEntityError'

const draftPickService = new DraftPickService()

interface DraftPickState {
  selectedTeams: number[]
  currentRound: number
  draftPicks: DraftPick[]
  picks: DraftPick[]
  currentPick: DraftPick | null
  isLoading: boolean
  error: string | null
  duplicateId: number | null
}

export const useDraftPickStore = defineStore('draftPick', {
  state: (): DraftPickState => ({
    selectedTeams: [],
    currentRound: 1,
    draftPicks: [],
    picks: [],
    currentPick: null,
    isLoading: false,
    error: null,
    duplicateId: null
  }),

  getters: {
    getPickById: state => (id: number) => {
      return state.picks.find(pick => pick.id === id)
    },
    getPicksByTeamId: state => (teamId: number) => {
      return state.picks.filter(pick => pick.teamId === teamId)
    },
    getPicksByYear: state => (year: number) => {
      return state.picks.filter(pick => pick.draftYear === year)
    },
    getDraftPicksByRound: (state) => (round: number) => {
      return state.draftPicks.filter(pick => pick.round === round);
    },
    
    getDraftPicksByTeam: (state) => (teamId: number) => {
      return state.draftPicks.filter(pick => pick.teamId === teamId);
    },

  },

  actions: {
    
    setSelectedTeams(teamIds: number[]) {
      this.selectedTeams = teamIds;
    },
    setCurrentRound(round: number) {
      this.currentRound = round;
    },
    /*
    addDraftPick(pick: DraftPick) {
      // Check if this pick already exists
      const existingPickIndex = this.draftPicks.findIndex(
        p => p.round === pick.round && p.pick === pick.pick
      );
      
      if (existingPickIndex !== -1) {
        // Update existing pick
        this.draftPicks[existingPickIndex] = pick;
      } else {
        // Add new pick
        this.draftPicks.push(pick);
      }
    },
    
    removeDraftPick(round: number, pick: number) {
      const index = this.draftPicks.findIndex(
        p => p.round === round && p.pick === pick
      );
      
      if (index !== -1) {
        this.draftPicks.splice(index, 1);
      }
    },
    */
    clearDraftPicks() {
      this.draftPicks = [];
    },
    /***************************************************************************** */
    // Reset error state
    resetErrorState() {
      this.error = null
      this.duplicateId = null
    },

    // Fetch all draft picks
    async fetchDraftPicks() {
      this.isLoading = true
      this.resetErrorState()

      try {
        this.picks = await draftPickService.getAll()
      } catch (error) {
        this.error = (error as Error).message
        console.error('Error fetching draft picks:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Fetch picks by team ID
    async fetchPicksByTeamId(teamId: number) {
      this.isLoading = true
      this.resetErrorState()

      try {
        this.picks = await draftPickService.getByTeamId(teamId)
      } catch (error) {
        this.error = (error as Error).message
        console.error(`Error fetching picks for team ${teamId}:`, error)
      } finally {
        this.isLoading = false
      }
    },

    // Fetch pick by player ID
    async fetchPickByPlayerId(playerId: number) {
      this.isLoading = true
      this.resetErrorState()

      try {
        const pick = await draftPickService.getByPlayerId(playerId)
        if (pick) {
          // Update the current pick
          this.currentPick = pick

          // Add to picks array if not already there
          const existingIndex = this.picks.findIndex(p => p.id === pick.id)
          if (existingIndex === -1) {
            this.picks.push(pick)
          }
        } else {
          this.currentPick = null
        }
        return pick
      } catch (error) {
        this.error = (error as Error).message
        console.error(`Error fetching pick for player ${playerId}:`, error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    // Fetch a specific pick by ID
    async fetchPickById(id: number) {
      this.isLoading = true
      this.resetErrorState()

      try {
        this.currentPick = await draftPickService.getById(id)
      } catch (error) {
        this.error = (error as Error).message
        console.error(`Error fetching draft pick ${id}:`, error)
      } finally {
        this.isLoading = false
      }
    },

    // Create a new draft pick
    async createDraftPick(pick: DraftPick) {
      this.isLoading = true
      this.resetErrorState()

      try {
        const newPick = await draftPickService.create(pick)
        this.picks.push(newPick)
        return newPick
      } catch (error) {
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message
          this.duplicateId = error.existingId
        } else {
          this.error = (error as Error).message
        }
        console.error('Error creating draft pick:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Create or update a draft pick (handles duplicates)
    async createOrUpdateDraftPick(pick: DraftPick) {
      this.isLoading = true
      this.resetErrorState()

      try {
        const result = await draftPickService.createOrUpdate(pick)

        // Check if this is a new pick or an update to an existing one
        const existingIndex = this.picks.findIndex(p => p.id === result.id)

        if (existingIndex !== -1) {
          // Update existing pick in store
          this.picks[existingIndex] = result
        } else {
          // Add new pick to store
          this.picks.push(result)
        }

        return result
      } catch (error) {
        this.error = (error as Error).message
        console.error('Error creating/updating draft pick:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Update an existing draft pick
    async updateDraftPick(id: number, pick: DraftPick) {
      this.isLoading = true
      this.resetErrorState()

      try {
        const updatedPick = await draftPickService.update(id, pick)

        // Update the pick in the store
        const index = this.picks.findIndex(p => p.id === id)
        if (index !== -1) {
          this.picks[index] = updatedPick
        }

        // If this is the current pick, update it as well
        if (this.currentPick?.id === id) {
          this.currentPick = updatedPick
        }

        return updatedPick
      } catch (error) {
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message
          this.duplicateId = error.existingId
        } else {
          this.error = (error as Error).message
        }
        console.error(`Error updating draft pick ${id}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Delete a draft pick
    async deleteDraftPick(id: number) {
      this.isLoading = true
      this.resetErrorState()

      try {
        await draftPickService.delete(id)

        // Remove the pick from the store
        this.picks = this.picks.filter(pick => pick.id !== id)

        // If this is the current pick, clear it
        if (this.currentPick?.id === id) {
          this.currentPick = null
        }
      } catch (error) {
        this.error = (error as Error).message
        console.error(`Error deleting draft pick ${id}:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})
