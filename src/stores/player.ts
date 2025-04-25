// src/infrastructure/store/modules/player.ts

import { Player } from "@/domain/models";
import { PlayerService } from "@/domain/services";
import { DuplicateEntityError } from "@/domain/services/errors/DuplicateEntityError";
import { defineStore } from "pinia";

const playerService = new PlayerService();

interface PlayerState {
  players: Player[];
  currentPlayer: Player | null;
  isLoading: boolean;
  error: string | null;
  duplicateId: number | null;
}

export const usePlayerStore = defineStore('player', {
  state: (): PlayerState => ({
    players: [],
    currentPlayer: null,
    isLoading: false,
    error: null,
    duplicateId: null
  }),
  
  getters: {
    getPlayerById: (state) => (id: number) => {
      return state.players.find(player => player.id === id);
    },
    getPlayersByTeamId: (state) => (teamId: number) => {
      return state.players.filter(player => player.team?.id === teamId);
    },
    getPlayerFullName: (state) => {
      if (!state.currentPlayer) return '';
      return `${state.currentPlayer.firstName} ${state.currentPlayer.lastName}`;
    }
  },
  
  actions: {
    // Reset error state
    resetErrorState() {
      this.error = null;
      this.duplicateId = null;
    },
    
    // batch processing support
    async importPlayers(players: Player[]) {
      const results = { success: 0, failed: 0 };

      for (const player of players) {
        try {
          await playerService.createOrUpdate(player);
          results.success++;
        } catch {
          results.failed++;
        }
      }

      return results;
    },

    // Fetch all players
    async fetchPlayers() {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.players = await playerService.getAll();
      } catch (error) {
        this.error = (error as Error).message;
        console.error('Error fetching players:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch players by team ID
    async fetchPlayersByTeamId(teamId: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.players = await playerService.getByTeamId(teamId);
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error fetching players for team ${teamId}:`, error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch a specific player by ID
    async fetchPlayerById(id: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.currentPlayer = await playerService.getById(id);
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error fetching player ${id}:`, error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Create a new player
    async createPlayer(player: Player) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const newPlayer = await playerService.create(player);
        this.players.push(newPlayer);
        return newPlayer;
      } catch (error) {
        // Special handling for duplicate player errors
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message;
          this.duplicateId = error.existingId;
        } else {
          this.error = (error as Error).message;
        }
        console.error('Error creating player:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Create or update a player (handles duplicates)
    async createOrUpdatePlayer(player: Player) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const result = await playerService.createOrUpdate(player);
        
        // Check if this is a new player or an update to an existing one
        const existingIndex = this.players.findIndex(p => p.id === result.id);
        
        if (existingIndex !== -1) {
          // Update existing player in store
          this.players[existingIndex] = result;
        } else {
          // Add new player to store
          this.players.push(result);
        }
        
        return result;
      } catch (error) {
        this.error = (error as Error).message;
        console.error('Error creating/updating player:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Update an existing player
    async updatePlayer(id: number, player: Player) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const updatedPlayer = await playerService.update(id, player);
        
        // Update the player in the store
        const index = this.players.findIndex(p => p.id === id);
        if (index !== -1) {
          this.players[index] = updatedPlayer;
        }
        
        // If this is the current player, update it as well
        if (this.currentPlayer?.id === id) {
          this.currentPlayer = updatedPlayer;
        }
        
        return updatedPlayer;
      } catch (error) {
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message;
          this.duplicateId = error.existingId;
        } else {
          this.error = (error as Error).message;
        }
        console.error(`Error updating player ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Delete a player
    async deletePlayer(id: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        await playerService.delete(id);
        
        // Remove the player from the store
        this.players = this.players.filter(player => player.id !== id);
        
        // If this is the current player, clear it
        if (this.currentPlayer?.id === id) {
          this.currentPlayer = null;
        }
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error deleting player ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
