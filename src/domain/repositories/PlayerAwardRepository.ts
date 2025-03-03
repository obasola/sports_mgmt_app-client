// src/domain/repositories/playerAwardRepository.ts
import type { IPlayerAwardRepository } from './interfaces/IPlayerAwardRepository';
import type { PlayerAward } from '@/domain/models/PlayerAward';
import apiClient from '@/infrastructure/api/axios-config';

export class PlayerAwardRepository implements IPlayerAwardRepository {
  private readonly basePath = '/player-awards';

  async findAll(): Promise<PlayerAward[]> {
    try {
      const response = await apiClient.get<PlayerAward[]>(this.basePath);
      return response.data;
    } catch (error) {
      console.error('Error fetching player awards:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<PlayerAward> {
    try {
      const response = await apiClient.get<PlayerAward>(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching player award with id ${id}:`, error);
      throw error;
    }
  }

  async findByPlayerId(playerId: number): Promise<PlayerAward[]> {
    try {
      const response = await apiClient.get<PlayerAward[]>(`${this.basePath}/player/${playerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching player awards for player ${playerId}:`, error);
      throw error;
    }
  }

  async findByYear(year: number): Promise<PlayerAward[]> {
    try {
      const response = await apiClient.get<PlayerAward[]>(`${this.basePath}/year/${year}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching player awards for year ${year}:`, error);
      throw error;
    }
  }
  async  findByAwardName(awardName: string): Promise<PlayerAward[]>{
    try {
      const response = await apiClient.get<PlayerAward[]>(`${this.basePath}/awardName/${awardName}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching player awards for awardName ${awardName}:`, error);
      throw error;
    }
  }

  async create(playerAward: PlayerAward): Promise<PlayerAward> {
    try {
      const response = await apiClient.post<PlayerAward>(this.basePath, playerAward);
      return response.data;
    } catch (error) {
      console.error('Error creating player award:', error);
      throw error;
    }
  }

  async update(id: number, playerAward: PlayerAward): Promise<PlayerAward> {
    try {
      const response = await apiClient.put<PlayerAward>(`${this.basePath}/${id}`, playerAward);
      return response.data;
    } catch (error) {
      console.error(`Error updating player award with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting player award with id ${id}:`, error);
      throw error;
    }
  }
}
