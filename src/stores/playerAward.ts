
// src/infrastructure/store/modules/playerAward.ts
import { defineStore } from 'pinia';
import type { PlayerAward } from '@/domain/models/PlayerAward';
import { PlayerAwardService } from '@/domain/services/PlayerAwardService';
import { DuplicateEntityError } from '@/domain/services/errors/DuplicateEntityError';

const playerAwardService = new PlayerAwardService();

interface PlayerAwardState {
  awards: PlayerAward[];
  currentAward: PlayerAward | null;
  isLoading: boolean;
  error: string | null;
  duplicateId: number | null;
}

export const usePlayerAwardStore = defineStore('playerAward', {
  state: (): PlayerAwardState => ({
    awards: [],
    currentAward: null,
    isLoading: false,
    error: null,
    duplicateId: null
  }),
  
  getters: {
    getAwardById: (state) => (id: number) => {
      return state.awards.find(award => award.id === id);
    },
    getAwardsByPlayerId: (state) => (playerId: number) => {
      return state.awards.filter(award => award.playerId === playerId);
    }
  },
  
  actions: {
    // Reset error state
    resetErrorState() {
      this.error = null;
      this.duplicateId = null;
    },
    
    // Fetch all awards
    async fetchAwards() {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.awards = await playerAwardService.getAll();
      } catch (error) {
        this.error = (error as Error).message;
        console.error('Error fetching awards:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch awards by player ID
    async fetchAwardsByPlayerId(playerId: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.awards = await playerAwardService.getByPlayerId(playerId);
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error fetching awards for player ${playerId}:`, error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch a specific award by ID
    async fetchAwardById(id: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.currentAward = await playerAwardService.getById(id);
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error fetching award ${id}:`, error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Create a new award
    async createAward(award: PlayerAward) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const newAward = await playerAwardService.create(award);
        this.awards.push(newAward);
        return newAward;
      } catch (error) {
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message;
          this.duplicateId = error.existingId;
        } else {
          this.error = (error as Error).message;
        }
        console.error('Error creating award:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Create or update an award (handles duplicates)
    async createOrUpdateAward(award: PlayerAward) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const result = await playerAwardService.createOrUpdate(award);
        
        // Check if this is a new award or an update to an existing one
        const existingIndex = this.awards.findIndex(a => a.id === result.id);
        
        if (existingIndex !== -1) {
          // Update existing award in store
          this.awards[existingIndex] = result;
        } else {
          // Add new award to store
          this.awards.push(result);
        }
        
        return result;
      } catch (error) {
        this.error = (error as Error).message;
        console.error('Error creating/updating award:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Update an existing award
    async updateAward(id: number, award: PlayerAward) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const updatedAward = await playerAwardService.update(id, award);
        
        // Update the award in the store
        const index = this.awards.findIndex(a => a.id === id);
        if (index !== -1) {
          this.awards[index] = updatedAward;
        }
        
        // If this is the current award, update it as well
        if (this.currentAward?.id === id) {
          this.currentAward = updatedAward;
        }
        
        return updatedAward;
      } catch (error) {
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message;
          this.duplicateId = error.existingId;
        } else {
          this.error = (error as Error).message;
        }
        console.error(`Error updating award ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Delete an award
    async deleteAward(id: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        await playerAwardService.delete(id);
        
        // Remove the award from the store
        this.awards = this.awards.filter(award => award.id !== id);
        
        // If this is the current award, clear it
        if (this.currentAward?.id === id) {
          this.currentAward = null;
        }
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error deleting award ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});