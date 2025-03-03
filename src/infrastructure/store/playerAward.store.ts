// src/infrastructure/store/playerAward.store.ts
import { defineStore } from 'pinia';
import type { PlayerAward } from '@/domain/models/PlayerAward';
import { PlayerAwardService } from '@/domain/services/PlayerAwardService';
import { PlayerAwardRepository } from '@/domain/repositories/PlayerAwardRepository';

const playerAwardRepository = new PlayerAwardRepository();
const playerAwardService = new PlayerAwardService(playerAwardRepository);

export const usePlayerAwardStore = defineStore('playerAward', {
  state: () => ({
    playerAwards: [] as PlayerAward[],
    currentPlayerAward: null as PlayerAward | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getPlayerAwardById: (state) => (id: number) => {
      return state.playerAwards.find(award => award.id === id);
    },
    getPlayerAwardsByPlayerId: (state) => (playerId: number) => {
      return state.playerAwards.filter(award => award.playerId === playerId);
    },
    getPlayerAwardsByYear: (state) => (year: number) => {
      return state.playerAwards.filter(award => award.awardYear === year);
    }
  },

  actions: {
    async fetchPlayerAwards() {
      this.isLoading = true;
      this.error = null;

      try {
        this.playerAwards = await playerAwardService.getAllPlayerAwards();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch player awards';
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPlayerAwardById(id: number) {
      this.isLoading = true;
      this.error = null;

      try {
        this.currentPlayerAward = await playerAwardService.getPlayerAwardById(id);
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to fetch player award with id ${id}`;
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPlayerAwardsByPlayerId(playerId: number) {
      this.isLoading = true;
      this.error = null;

      try {
        this.playerAwards = await playerAwardService.getPlayerAwardsByPlayerId(playerId);
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to fetch player awards for player ${playerId}`;
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPlayerAwardsByYear(year: number) {
      this.isLoading = true;
      this.error = null;

      try {
        this.playerAwards = await playerAwardService.getPlayerAwardsByYear(year);
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to fetch player awards for year ${year}`;
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async createPlayerAward(playerAward: PlayerAward) {
      this.isLoading = true;
      this.error = null;

      try {
        const newPlayerAward = await playerAwardService.createPlayerAward(playerAward);
        this.playerAwards.push(newPlayerAward);
        return newPlayerAward;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create player award';
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updatePlayerAward(id: number, playerAward: PlayerAward) {
      this.isLoading = true;
      this.error = null;

      try {
        const updatedPlayerAward = await playerAwardService.updatePlayerAward(id, playerAward);
        const index = this.playerAwards.findIndex(award => award.id === id);

        if (index !== -1) {
          this.playerAwards[index] = updatedPlayerAward;
        }

        if (this.currentPlayerAward?.id === id) {
          this.currentPlayerAward = updatedPlayerAward;
        }

        return updatedPlayerAward;
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to update player award with id ${id}`;
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deletePlayerAward(id: number | undefined) {
      this.isLoading = true;
      this.error = null;

      try {
        const success = await playerAwardService.deletePlayerAward(id);

        if (success) {
          this.playerAwards = this.playerAwards.filter(award => award.id !== id);

          if (this.currentPlayerAward?.id === id) {
            this.currentPlayerAward = null;
          }
        }

        return success;
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to delete player award with id ${id}`;
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
