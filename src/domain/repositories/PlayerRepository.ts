// src/domain/repositories/playerRepository.ts
import type { IPlayerRepository } from '@/domain/repositories/interfaces/IPlayerRepository';
import type { Player } from '@/domain/models/Player';
import apiClient from '../../infrastructure/api/axios-config';

export class PlayerRepository implements IPlayerRepository {
  private readonly basePath = '/players';

  async findAll(): Promise<Player[]> {
    try {
      const response = await apiClient.get<Player[]>(this.basePath);
      return response.data;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Player> {
    try {
      const response = await apiClient.get<Player>(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching player with id ${id}:`, error);
      throw error;
    }
  }

  async findByName(firstName: string, lastName: string): Promise<Player[]> {
    try {
      const response = await apiClient.get<Player[]>(`${this.basePath}/search`, {
        params: { firstName, lastName }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching players by name:`, error);
      throw error;
    }
  }

  async create(player: Player): Promise<Player> {
    try {
      const response = await apiClient.post<Player>(this.basePath, player);
      return response.data;
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  }

  async update(id: number, player: Player): Promise<Player> {
    try {
      const response = await apiClient.put<Player>(`${this.basePath}/${id}`, player);
      return response.data;
    } catch (error) {
      console.error(`Error updating player with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting player with id ${id}:`, error);
      throw error;
    }
  }
}
