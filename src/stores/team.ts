
// src/infrastructure/store/modules/team.ts

import { Team } from "@/domain/models";
import { TeamService } from "@/domain/services";
import { DuplicateEntityError } from "@/domain/services/errors/DuplicateEntityError";
import { defineStore } from "pinia";


const teamService = new TeamService();

interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  teamPlayers: null;
  isLoading: boolean;
  error: string | null;
  duplicateId: number | null;
}

export const useTeamStore = defineStore('team', {
  state: (): TeamState => ({
    teams: [],
    currentTeam: null,
    teamPlayers: null,
    isLoading: false,
    error: null,
    duplicateId: null
  }),
  
  getters: {
    getTeamById: (state) => (id: number) => {
      return state.teams.find(team => team.id === id);
    }
  },
  
  actions: {
    // Reset error state
    resetErrorState() {
      this.error = null;
      this.duplicateId = null;
    },
    
    // Fetch all teams
    async fetchTeams() {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.teams = await teamService.getAll();
      } catch (error) {
        this.error = (error as Error).message;
        console.error('Error fetching teams:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch a specific team by ID
    async fetchTeamById(id: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.currentTeam = await teamService.getById(id);
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error fetching team ${id}:`, error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch team players
    async fetchTeamPlayers(teamId: number) {
      this.isLoading = true;
      
      try {
        const players = await teamService.getTeamPlayers(teamId);
        
        // Add players to current team if loaded
        if (this.currentTeam && this.currentTeam.id === teamId) {
          //this.currentTeam.players = players;
        }
        
        return players;
      } catch (error) {
        console.error(`Error fetching players for team ${teamId}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch team schedule
    async fetchTeamSchedule(teamId: number) {
      this.isLoading = true;
      
      try {
        const schedule = await teamService.getTeamSchedule(teamId);
        
        // Add schedule to current team if loaded
        if (this.currentTeam && this.currentTeam.id === teamId) {
         // this.currentTeam.schedule = schedule;
        }
        
        return schedule;
      } catch (error) {
        console.error(`Error fetching schedule for team ${teamId}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch team draft picks
    async fetchTeamDraftPicks(teamId: number) {
      this.isLoading = true;
      
      try {
        const picks = await teamService.getTeamDraftPicks(teamId);
        
        // Add picks to current team if loaded
        if (this.currentTeam && this.currentTeam.id === teamId) {
          //this.currentTeam.picks = picks;
        }
        
        return picks;
      } catch (error) {
        console.error(`Error fetching draft picks for team ${teamId}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Create a new team
    async createTeam(team: Team) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const newTeam = await teamService.create(team);
        this.teams.push(newTeam);
        return newTeam;
      } catch (error) {
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message;
          this.duplicateId = error.existingId;
        } else {
          this.error = (error as Error).message;
        }
        console.error('Error creating team:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Create or update a team (handles duplicates)
    async createOrUpdateTeam(team: Team) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const result = await teamService.createOrUpdate(team);
        
        // Check if this is a new team or an update to an existing one
        const existingIndex = this.teams.findIndex(t => t.id === result.id);
        
        if (existingIndex !== -1) {
          // Update existing team in store
          this.teams[existingIndex] = result;
        } else {
          // Add new team to store
          this.teams.push(result);
        }
        
        return result;
      } catch (error) {
        this.error = (error as Error).message;
        console.error('Error creating/updating team:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Update an existing team
    async updateTeam(id: number, team: Team) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const updatedTeam = await teamService.update(id, team);
        
        // Update the team in the store
        const index = this.teams.findIndex(t => t.id === id);
        if (index !== -1) {
          this.teams[index] = updatedTeam;
        }
        
        // If this is the current team, update it as well
        if (this.currentTeam?.id === id) {
          this.currentTeam = updatedTeam;
        }
        
        return updatedTeam;
      } catch (error) {
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message;
          this.duplicateId = error.existingId;
        } else {
          this.error = (error as Error).message;
        }
        console.error(`Error updating team ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Delete a team
    async deleteTeam(id: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        await teamService.delete(id);
        
        // Remove the team from the store
        this.teams = this.teams.filter(team => team.id !== id);
        
        // If this is the current team, clear it
        if (this.currentTeam?.id === id) {
          this.currentTeam = null;
        }
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error deleting team ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
