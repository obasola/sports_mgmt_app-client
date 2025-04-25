// src/domain/services/TeamService.ts
import { BaseService } from './BaseService'
import type { Team } from '@/domain/models/Team'
import type { Player } from '@/domain/models/Player'
import type { Schedule } from '@/domain/models/Schedule'
import type { DraftPick } from '@/domain/models/DraftPick'
import { ITeamRepository } from '@/repositories/interfaces'
import { TeamRepository } from '@/repositories/TeamRepository'
import { DuplicateEntityError } from './errors/DuplicateEntityError'

export class TeamService extends BaseService<Team, ITeamRepository> {
  constructor(repository: ITeamRepository = new TeamRepository()) {
    super(repository)
  }

  /**
   * Fetches all teams from the API
   * @returns Promise with array of teams
   */
  async getTeams(): Promise<Team[]> {
    try {
      const response = this.repository.getAll();
      return response;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }

  /**
   * Get team players
   */
  async getTeamPlayers(teamId: number): Promise<Player[]> {
    return this.repository.getTeamPlayers(teamId)
  }

  /**
   * Get team schedule
   */
  async getTeamSchedule(teamId: number): Promise<Schedule[]> {
    return this.repository.getTeamSchedule(teamId)
  }

  /**
   * Fetches a team by ID
   * @param id Team ID
   * @returns Promise with team data
   */
  async getTeamById(id: number): Promise<Team> {
    try {
      const response = this.repository.getById(id);
      return response;
    } catch (error) {
      console.error(`Error fetching team with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get team draft picks
   */
  async getTeamDraftPicks(teamId: number): Promise<DraftPick[]> {
    return this.repository.getTeamDraftPicks(teamId)
  }

  /**
   * Create a new team with duplicate checking
   */
  async create(team: Team): Promise<Team> {
    // Check for duplicates by name
    const existingTeam = await this.repository.findDuplicateByName(team.name)

    if (existingTeam) {
      throw new DuplicateEntityError(
        `A team named "${team.name}" already exists`,
        'Team',
        existingTeam.id
      )
    }

    return this.repository.create(team)
  }

  /**
   * Update team with duplicate checking
   */
  async update(id: number, team: Team): Promise<Team> {
    // Check for duplicates (excluding the current team)
    const existingTeam = await this.repository.findDuplicateByName(team.name)

    if (existingTeam && existingTeam.id !== id) {
      throw new DuplicateEntityError(
        `Another team named "${team.name}" already exists`,
        'Team',
        existingTeam.id
      )
    }

    return this.repository.update(id, team)
  }

  /**
   * Create or update team (handles duplicates automatically)
   */
  async createOrUpdate(team: Team): Promise<Team> {
    try {
      return await this.create(team)
    } catch (error) {
      if (error instanceof DuplicateEntityError && error.existingId) {
        return this.repository.update(error.existingId, team)
      }
      throw error
    }
  }
}
