// src/domain/services/TeamDropdownService.ts
import { TeamService } from './TeamService';
import type { Team } from '@/domain/models/Team';

/**
 * Interface for simplified team data used in dropdowns
 */
export interface TeamDropdownItem {
  id: number;
  name: string;
  stadium: string;
  city: string;
  state: string;
  country?: string;
  conference: string;
  division: string;
}

/**
 * Service for handling team dropdown data
 */
export class TeamDropdownService {
  private teamService: TeamService;
  private teamCache: TeamDropdownItem[] = [];
  private lastFetchTime: number = 0;
  private readonly CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  constructor(teamService?: TeamService) {
    this.teamService = teamService || new TeamService();
  }

  /**
   * Get all teams for dropdown
   * Uses caching to avoid unnecessary API calls
   */
  async getAllTeams(): Promise<TeamDropdownItem[]> {
    const now = Date.now();
    
    // Check if cache is valid
    if (this.teamCache.length === 0 || (now - this.lastFetchTime) > this.CACHE_TIMEOUT) {
      try {
        const teams = await this.teamService.getAll();
        this.teamCache = teams.map(team => this.mapTeamToDropdownItem(team));
        this.lastFetchTime = now;
      } catch (error) {
        console.error('Error fetching teams for dropdown:', error);
        throw error;
      }
    }
    
    return [...this.teamCache]; // Return copy to prevent manipulation
  }

  /**
   * Get filtered teams (excluding a specific team)
   * Useful for opposing team dropdown
   */
  async getTeamsExcept(excludeTeamId: number): Promise<TeamDropdownItem[]> {
    const allTeams = await this.getAllTeams();
    return allTeams.filter(team => team.id !== excludeTeamId);
  }

  /**
   * Get a single team by ID
   */
  async getTeamById(teamId: number): Promise<TeamDropdownItem | null> {
    // Try cache first
    const cachedTeam = this.teamCache.find(team => team.id === teamId);
    if (cachedTeam) {
      return { ...cachedTeam };
    }
    
    // If not in cache, fetch from API
    try {
      const team = await this.teamService.getById(teamId);
      const dropdownItem = this.mapTeamToDropdownItem(team);
      
      // Add to cache if not already there
      if (!this.teamCache.some(t => t.id === team.id)) {
        this.teamCache.push(dropdownItem);
      }
      
      return dropdownItem;
    } catch (error) {
      console.error(`Error fetching team with ID ${teamId} for dropdown:`, error);
      return null;
    }
  }

  /**
   * Get only the division name (last word of division)
   */
  getDivisionShortName(division: string): string {
    const parts = division.split(' ');
    return parts[parts.length - 1];
  }

  /**
   * Map full team object to simplified dropdown item
   */
  private mapTeamToDropdownItem(team: Team): TeamDropdownItem {
    return {
      id: team.id!,
      name: team.name,
      stadium: team.stadium,
      city: team.city,
      state: team.state,
      country: team.country || 'USA', // Default to USA if not specified
      conference: team.conference,
      division: team.division
    };
  }
}

// Export a singleton instance for use throughout the app
export const teamDropdownService = new TeamDropdownService();