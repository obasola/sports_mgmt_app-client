// src/infrastructure/store/modules/combineScore.ts
import { defineStore } from 'pinia';
import type { CombineScore } from '@/domain/models/CombineScore';
import { CombineScoreService } from '@/domain/services/CombineScoreService';
import { DuplicateEntityError } from '@/domain/services/errors/DuplicateEntityError';

// Create service instance
const combineScoreService = new CombineScoreService();

// Define state interface
interface CombineScoreState {
  scores: CombineScore[];
  currentScore: CombineScore | null;
  isLoading: boolean;
  error: string | null;
  duplicateId: number | null;
}

export const useCombineScoreStore = defineStore('combineScore', {
  state: (): CombineScoreState => ({
    scores: [],
    currentScore: null,
    isLoading: false,
    error: null,
    duplicateId: null
  }),
  
  getters: {
    /**
     * Get a combine score by ID
     */
    getScoreById: (state) => (id: number) => {
      return state.scores.find(score => score.id === id);
    },
    
    /**
     * Get a combine score by player ID
     */
    getScoreByPlayerId: (state) => (playerId: number) => {
      return state.scores.find(score => score.playerId === playerId);
    },
    
    /**
     * Check if a player has a combine score
     */
    hasScoreForPlayer: (state) => (playerId: number) => {
      return state.scores.some(score => score.playerId === playerId);
    },
    
    /**
     * Get all combine scores sorted by fortyTime (fastest first)
     */
    getScoresSortedBySpeed: (state) => {
      return [...state.scores].sort((a, b) => a.fortyTime - b.fortyTime);
    },
    
    /**
     * Get all combine scores sorted by benchPress (highest first)
     */
    getScoresSortedByStrength: (state) => {
      return [...state.scores].sort((a, b) => b.tenYardSplit - a.tenYardSplit);
    }
  },
  
  actions: {
    /**
     * Reset error state
     */
    resetErrorState() {
      this.error = null;
      this.duplicateId = null;
    },
    
    /**
     * Fetch all combine scores
     */
    async fetchCombineScores() {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.scores = await combineScoreService.getAll();
      } catch (error) {
        this.error = (error as Error).message;
        console.error('Error fetching combine scores:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Fetch combine score by player ID
     * Returns the score if found, null otherwise
     */
    async fetchScoreByPlayerId(playerId: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const score = await combineScoreService.getByPlayerId(playerId);
        
        if (score) {
          // Set as current score
          this.currentScore = score;
          
          // Update the scores array (add or update)
          const existingIndex = this.scores.findIndex(s => s.id === score.id);
          if (existingIndex === -1) {
            this.scores.push(score);
          } else {
            this.scores[existingIndex] = score;
          }
        } else {
          // No score found for this player
          this.currentScore = null;
        }
        
        return score;
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error fetching combine score for player ${playerId}:`, error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Fetch combine score by ID
     */
    async fetchScoreById(id: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const score = await combineScoreService.getById(id);
        this.currentScore = score;
        
        // Update the score in the array if it exists
        const existingIndex = this.scores.findIndex(s => s.id === id);
        if (existingIndex !== -1) {
          this.scores[existingIndex] = score;
        } else {
          this.scores.push(score);
        }
        
        return score;
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error fetching combine score ${id}:`, error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Create a new combine score
     * Throws DuplicateEntityError if a score already exists for the player
     */
    async createCombineScore(score: CombineScore) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const newScore = await combineScoreService.create(score);
        this.scores.push(newScore);
        this.currentScore = newScore;
        return newScore;
      } catch (error) {
        // Handle duplicate error
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message;
          this.duplicateId = error.existingId;
        } else {
          this.error = (error as Error).message;
        }
        console.error('Error creating combine score:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Create or update a combine score
     * If a score already exists for the player, it will be updated
     */
    async createOrUpdateCombineScore(score: CombineScore) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const result = await combineScoreService.createOrUpdate(score);
        
        // Find existing score in store
        const existingIndex = this.scores.findIndex(s => s.id === result.id);
        
        if (existingIndex !== -1) {
          // Update existing score
          this.scores[existingIndex] = result;
        } else {
          // Add new score
          this.scores.push(result);
        }
        
        // Update current score
        this.currentScore = result;
        
        return result;
      } catch (error) {
        this.error = (error as Error).message;
        console.error('Error creating/updating combine score:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Update an existing combine score
     */
    async updateCombineScore(id: number, score: CombineScore) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const updatedScore = await combineScoreService.update(id, score);
        
        // Update the score in the store
        const index = this.scores.findIndex(s => s.id === id);
        if (index !== -1) {
          this.scores[index] = updatedScore;
        } else {
          // If not in store yet, add it
          this.scores.push(updatedScore);
        }
        
        // Update current score if applicable
        if (this.currentScore?.id === id) {
          this.currentScore = updatedScore;
        }
        
        return updatedScore;
      } catch (error) {
        // Handle duplicate error
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message;
          this.duplicateId = error.existingId;
        } else {
          this.error = (error as Error).message;
        }
        console.error(`Error updating combine score ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Delete a combine score
     */
    async deleteCombineScore(id: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        await combineScoreService.delete(id);
        
        // Remove from local store
        this.scores = this.scores.filter(score => score.id !== id);
        
        // Clear current score if it's the deleted one
        if (this.currentScore?.id === id) {
          this.currentScore = null;
        }
        
        return true;
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error deleting combine score ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Check if a combine score exists for a player
     * This performs a server check rather than relying on local state
     */
    async checkScoreExistsForPlayer(playerId: number): Promise<boolean> {
      try {
        const score = await combineScoreService.getByPlayerId(playerId);
        return !!score;
      } catch (error) {
        console.error(`Error checking if score exists for player ${playerId}:`, error);
        return false;
      }
    },
    
    /**
     * Get player ranking by metric
     * Returns the ranking of a player compared to all other players for a specific metric
     * @param playerId The player ID to rank
     * @param metric The metric to rank by ('fortyTime', 'benchPress', etc.)
     * @returns An object with rank and percentile, or null if player has no score
     */
    async getPlayerRankingByMetric(playerId: number, metric: keyof Omit<CombineScore, 'id' | 'playerId' | 'player'>): Promise<{rank: number, total: number, percentile: number} | null> {
      // Make sure we have all scores
      if (this.scores.length === 0) {
        await this.fetchCombineScores();
      }
      
      const playerScore = this.scores.find(score => score.playerId === playerId);
      if (!playerScore) return null;
      
      let sortedScores: CombineScore[];
      
      // Special case for 40 yard dash where lower is better
      if (metric === 'fortyTime') {
        sortedScores = [...this.scores].sort((a, b) => a[metric] - b[metric]);
      } else {
        // For all other metrics, higher is better
        sortedScores = [...this.scores].sort((a, b) => b[metric] - a[metric]);
      }
      
      const rank = sortedScores.findIndex(score => score.playerId === playerId) + 1;
      const total = sortedScores.length;
      const percentile = 100 - (rank / total * 100);
      
      return { rank, total, percentile };
    }
  }
});