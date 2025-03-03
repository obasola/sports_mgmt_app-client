// src/domain/repositories/teamRepository.ts
import type { ITeamRepository } from './interfaces/ITeamRepository';
import type { Team } from '@/domain/models/Team';
import apiClient from '@/infrastructure/api/axios-config';

export class TeamRepository implements ITeamRepository {
  private readonly basePath = '/teams';

  async findAll(): Promise<Team[]> {
    try {
      const response = await apiClient.get<Team[]>(this.basePath);
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Team> {
    try {
      const response = await apiClient.get<Team>(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team with id ${id}:`, error);
      throw error;
    }
  }

  async findByName(name: string): Promise<Team | null> {
    try {
      const response = await apiClient.get<Team[]>(`${this.basePath}/search`, {
        params: { name }
      });
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error searching team by name:`, error);
      throw error;
    }
  }

  // get all teams in conference and division
  async findByTeams(conference: string, division: string): Promise<Team[]> {
    try {
      const response = await apiClient.get<Team[]>(`${this.basePath}/byTeam`, {
        params: { conference, division }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching teams by conference and division:`, error);
      throw error;
    }
  }

  async create(team: Team): Promise<Team> {
    try {
      const response = await apiClient.post<Team>(this.basePath, team);
      return response.data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  async update(id: number, team: Team): Promise<Team> {
    try {
      const response = await apiClient.put<Team>(`${this.basePath}/${id}`, team);
      return response.data;
    } catch (error) {
      console.error(`Error updating team with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting team with id ${id}:`, error);
      throw error;
    }
  }
}
