
// src/domain/services/teamService.ts
import type { ITeamService } from '@/domain/services/interfaces/ITeamService';
import type { ITeamRepository } from '@/domain/repositories/interfaces/ITeamRepository';
import type { Team } from '@/domain/models/Team';

export class TeamService implements ITeamService {
  private teamRepository: ITeamRepository;

  constructor(teamRepository: ITeamRepository) {
    this.teamRepository = teamRepository;
  }

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepository.findAll();
  }

  async getTeamById(id: number): Promise<Team> {
    return this.teamRepository.findById(id);
  }

  async getTeamByName(name: string): Promise<Team | null> {
    return this.teamRepository.findByName(name);
  }

  async searchTeamsByConferenceAndDivision(conference: string, division: string): Promise<Team[]> {
    return this.teamRepository.findByTeams(conference, division);
  }

  async createTeam(team: Team): Promise<Team> {
    return this.teamRepository.create(team);
  }

  async updateTeam(id: number, team: Team): Promise<Team> {
    return this.teamRepository.update(id, team);
  }

  async deleteTeam(id: number): Promise<boolean> {
    return this.teamRepository.delete(id);
  }
}
