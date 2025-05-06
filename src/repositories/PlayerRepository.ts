// src/infrastructure/repositories/PlayerRepository.ts
import apiClient from '@/utils/axios-config';
import type { Player } from '@/domain/models/Player';
import type { PlayerAward } from '@/domain/models/PlayerAward';
import type { CombineScore } from '@/domain/models/CombineScore';
import type { IPlayerRepository } from '@/repositories/interfaces/IPlayerRepository';
import { DraftProspect } from '@/domain/models/DraftProspect';


/**
 * Implementation of the Player repository
 */
export class PlayerRepository implements IPlayerRepository {
  async getAll(): Promise<Player[]> {
    const response = await apiClient.get('/players');
    return response.data;
  }
  /** NOT implemented on backend yet!!! */
  async getAllUnassigned(): Promise<Player[]> {
    const response = await apiClient.get('/players/unassigned');
    return response.data;
  }

  async findDuplicate(firstName: string, lastName: string, university: string): Promise<Player | null> {
    // Get all players and filter locally (in a real app, this would be an API endpoint)
    const players = await this.getAll();

    const duplicate = players.find(p =>
      p.firstName.toLowerCase() === firstName.toLowerCase() &&
      p.lastName.toLowerCase() === lastName.toLowerCase() &&
      p.university.toLowerCase() === university.toLowerCase()
    );

    return duplicate || null;
  }

  async getById(id: number): Promise<Player> {
    const response = await apiClient.get(`/players/${id}`);
    return response.data;
  }

  async getByTeamId(teamId: number): Promise<Player[]> {
    const response = await apiClient.get(`/teams/${teamId}/players`);
    return response.data;
  }

  async getPlayersByTeamId(teamId: number): Promise<Player[]> {
    const response = await apiClient.get(`player-teams/team/${teamId}`);
    return response.data;
  }

  async getPlayerAwards(playerId: number): Promise<PlayerAward[]> {
    const response = await apiClient.get(`/players/${playerId}/awards`);
    return response.data;
  }

  async getPlayerCombineScore(playerId: number): Promise<CombineScore> {
    const response = await apiClient.get(`/players/${playerId}/combine-score`);
    return response.data;
  }

  async create(player: Player): Promise<Player> {
    const response = await apiClient.post('/players', player);
    return response.data;
  }

  async update(id: number, player: Player): Promise<Player> {
    const response = await apiClient.put(`/players/${id}`, player);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/players/${id}`);
  }

  // Draft-specific methods
  async getProspects(): Promise<DraftProspect[]> {
    try {
      const prospects = await apiClient.get(`/prospects`);
      return prospects.data;
    } catch (error) {
      console.error('Error fetching prospects:', error);
      throw error;
    }
  }


  async getDraftedPlayers(): Promise<DraftProspect[]> {
    try {
      const currentYear = new Date().getFullYear();
      const draftedPlayers = await apiClient.get(`/draft/prospects/draftYear/${currentYear}`);
      return draftedPlayers.data;
    } catch (error) {
      console.error('Error fetching drafted players:', error);
      throw error;
    }
  }

  async getProspectById(id: number): Promise<DraftProspect | null> {
    try {
      const prospect = await apiClient.get(`/players/${id}`);
      return prospect.data || null;
    } catch (error) {
      console.error(`Error fetching prospect with id ${id}:`, error);
      throw error;
    }
  }
}
