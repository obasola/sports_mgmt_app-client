// src/infrastructure/repositories/PlayerAwardRepository.ts
import { PlayerAward } from "@/domain/models";
import apiClient from "@/utils/axios-config";
import { IPlayerAwardRepository } from "./interfaces";

export class PlayerAwardRepository implements IPlayerAwardRepository {
  async getAll(): Promise<PlayerAward[]> {
    const response = await apiClient.get('/player-awards');
    return response.data;
  }

  async getById(id: number): Promise<PlayerAward> {
    const response = await apiClient.get(`/player-awards/${id}`);
    return response.data;
  }

  async getByPlayerId(playerId: number): Promise<PlayerAward[]> {
    const response = await apiClient.get(`/players/${playerId}/awards`);
    return response.data;
  }

  async findDuplicate(playerId: number, name: string, yearAwarded: number): Promise<PlayerAward | null> {
    const awards = await this.getByPlayerId(playerId);
    
    const duplicate = awards.find(a => 
      a.name.toLowerCase() === name.toLowerCase() &&
      a.yearAwarded === yearAwarded
    );
    
    return duplicate || null;
  }

  async create(award: PlayerAward): Promise<PlayerAward> {
    const response = await apiClient.post('/player-awards', award);
    return response.data;
  }

  async update(id: number, award: PlayerAward): Promise<PlayerAward> {
    const response = await apiClient.put(`/player-awards/${id}`, award);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/player-awards/${id}`);
  }
}
