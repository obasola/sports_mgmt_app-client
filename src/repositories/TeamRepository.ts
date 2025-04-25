// src/infrastructure/repositories/TeamRepository.ts
import apiClient from '@/utils/axios-config';
import type { Team } from '@/domain/models/Team';
import type { Player } from '@/domain/models/Player';
import type { Schedule } from '@/domain/models/Schedule';
import type { DraftPick } from '@/domain/models/DraftPick';
import { ITeamRepository } from './interfaces/ITeamRepository';

export class TeamRepository implements ITeamRepository {
  async getAll(): Promise<Team[]> {
    const response = await apiClient.get('/teams');
    return response.data;
  }

  async getById(id: number): Promise<Team> {
    const response = await apiClient.get(`/teams/${id}`);
    return response.data;
  }

  async getTeamPlayers(teamId: number): Promise<Player[]> {
    const response = await apiClient.get(`/teams/${teamId}/players`);
    return response.data;
  }

  async getTeamSchedule(teamId: number): Promise<Schedule[]> {
    const response = await apiClient.get(`/schedules/team/${teamId}`);
    return response.data;
  }

  async getTeamDraftPicks(teamId: number): Promise<DraftPick[]> {
    const response = await apiClient.get(`/teams/${teamId}/draft-picks`);
    return response.data;
  }

  async findDuplicateByName(name: string): Promise<Team | null> {
    const teams = await this.getAll();
    
    const duplicate = teams.find(t => 
      t.name.toLowerCase() === name.toLowerCase()
    );
    
    return duplicate || null;
  }


  async create(team: Team): Promise<Team> {
    const response = await apiClient.post('/teams', team);
    return response.data;
  }
  
  async update(id: number, team: Team): Promise<Team> {
    const response = await apiClient.put(`/teams/${id}`, team);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/teams/${id}`);
  }
}