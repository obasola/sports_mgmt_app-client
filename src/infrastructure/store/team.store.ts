
import type { Team } from '@/domain/models';
import { TeamRepository } from '@/domain/repositories/TeamRepository';
import { TeamService } from '@/domain/services/TeamService';
import { defineStore } from 'pinia';

const teamRepository = new TeamRepository();
const teamService = new TeamService(teamRepository);

export const useTeamStore = defineStore('team', {
  state: () => ({
    teams: [] as Team[],
    currentTeam: null as Team | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getTeamById: (state) => (id: number) => {
      return state.teams.find(team => team.id === id);
    },
    getTeamsByConference: (state) => (conference: string) => {
      return state.teams.filter(team => team.conference === conference);
    },
    getTeamsByDivision: (state) => (division: string) => {
      return state.teams.filter(team => team.division === division);
    }
  },

  actions: {
    async fetchTeams() {
      this.isLoading = true;
      this.error = null;

      try {
        this.teams = await teamService.getAllTeams();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch teams';
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTeamById(id: number) {
      this.isLoading = true;
      this.error = null;

      try {
        this.currentTeam = await teamService.getTeamById(id);
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to fetch team with id ${id}`;
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTeamByName(name: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const team = await teamService.getTeamByName(name);
        if (team) {
          this.currentTeam = team;
        }
        return team;
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to fetch team by name`;
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async searchTeamsByConferenceAndDivision(conference: string, division: string) {
      this.isLoading = true;
      this.error = null;

      try {
        this.teams = await teamService.searchTeamsByConferenceAndDivision(conference, division);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to search teams by conference and division';
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async createTeam(team: Team) {
      this.isLoading = true;
      this.error = null;

      try {
        const newTeam = await teamService.createTeam(team);
        this.teams.push(newTeam);
        return newTeam;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create team';
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateTeam(id: number, team: Team) {
      this.isLoading = true;
      this.error = null;

      try {
        const updatedTeam = await teamService.updateTeam(id, team);
        const index = this.teams.findIndex(t => t.id === id);

        if (index !== -1) {
          this.teams[index] = updatedTeam;
        }

        if (this.currentTeam?.id === id) {
          this.currentTeam = updatedTeam;
        }

        return updatedTeam;
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to update team with id ${id}`;
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteTeam(id: number) {
      this.isLoading = true;
      this.error = null;

      try {
        const success = await teamService.deleteTeam(id);

        if (success) {
          this.teams = this.teams.filter(team => team.id !== id);

          if (this.currentTeam?.id === id) {
            this.currentTeam = null;
          }
        }

        return success;
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to delete team with id ${id}`;
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
