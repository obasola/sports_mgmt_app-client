
// src/infrastructure/repositories/DraftPickRepository.ts
import apiClient from '@/utils/axios-config';
import type { DraftPick } from '@/domain/models/DraftPick';
import { IDraftPickRepository } from './interfaces/IDraftPickRepository';


export class DraftPickRepository implements IDraftPickRepository {
  async getAll(): Promise<DraftPick[]> {
    const response = await apiClient.get('/draft-picks');
    return response.data;
  }

  async getById(id: number): Promise<DraftPick> {
    const response = await apiClient.get(`/draft-picks/${id}`);
    return response.data;
  }

  async getByTeamId(teamId: number): Promise<DraftPick[]> {
    const response = await apiClient.get(`/teams/${teamId}/draft-picks`);
    return response.data;
  }

  async getByPlayerId(playerId: number): Promise<DraftPick | null> {
    try {
      const response = await apiClient.get(`/players/${playerId}/draft-pick`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async findDuplicateByPlayer(playerId: number): Promise<DraftPick | null> {
    return this.getByPlayerId(playerId);
  }

  async findDuplicateByYearRoundPick(year: number, round: number, pickNumber: number): Promise<DraftPick | null> {
    const picks = await this.getAll();
    
    const duplicate = picks.find(p => 
      p.draftYear === year &&
      p.round === round &&
      p.pickNumber === pickNumber
    );
    
    return duplicate || null;
  }

  async create(pick: DraftPick): Promise<DraftPick> {
    const response = await apiClient.post('/draft-picks', pick);
    return response.data;
  }

  async update(id: number, pick: DraftPick): Promise<DraftPick> {
    const response = await apiClient.put(`/draft-picks/${id}`, pick);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/draft-picks/${id}`);
  }
}
