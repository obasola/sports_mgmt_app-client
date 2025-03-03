import { PlayerRepository } from '@/domain/repositories/PlayerRepository';
import { PlayerService} from '@/domain/services/PlayerService'
import type { Player } from '@/domain/models';
import { defineStore } from 'pinia';

const playerRepository = new PlayerRepository();
const playerService = new PlayerService(playerRepository);

export const usePlayerStore = defineStore('player', {
  state: () => ({
    players: [] as Player[],
    currentPlayer: null as Player | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getPlayerById: (state) => (id: number) => {
      return state.players.find(player => player.id === id);
    },
    getPlayersByTeam: (state) => (teamId: number) => {
      return state.players.filter(player => player.teamId === teamId);
    },
    getPlayersByPosition: (state) => (position: string) => {
      return state.players.filter(player => player.position === position);
    }
  },

  actions: {
    async fetchPlayers() {
      this.isLoading = true;
      this.error = null;

      try {
        this.players = await playerService.getAllPlayers();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch players';
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPlayerById(id: number) {
      this.isLoading = true;
      this.error = null;

      try {
        this.currentPlayer = await playerService.getPlayerById(id);
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to fetch player with id ${id}`;
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async searchPlayersByName(firstName: string, lastName: string) {
      this.isLoading = true;
      this.error = null;

      try {
        this.players = await playerService.searchPlayersByName(firstName, lastName);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to search players by name';
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async createPlayer(player: Player) {
      this.isLoading = true;
      this.error = null;

      try {
        const newPlayer = await playerService.createPlayer(player);
        this.players.push(newPlayer);
        return newPlayer;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create player';
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updatePlayer(id: number, player: Player) {
      this.isLoading = true;
      this.error = null;

      try {
        const updatedPlayer = await playerService.updatePlayer(id, player);
        const index = this.players.findIndex(p => p.id === id);

        if (index !== -1) {
          this.players[index] = updatedPlayer;
        }

        if (this.currentPlayer?.id === id) {
          this.currentPlayer = updatedPlayer;
        }

        return updatedPlayer;
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to update player with id ${id}`;
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deletePlayer(id: number | undefined) {
      this.isLoading = true;
      this.error = null;

      try {
        const success = await playerService.deletePlayer(id);

        if (success) {
          this.players = this.players.filter(player => player.id !== id);

          if (this.currentPlayer?.id === id) {
            this.currentPlayer = null;
          }
        }

        return success;
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to delete player with id ${id}`;
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
