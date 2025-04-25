// src/infrastructure/repositories/CombineScoreRepository.ts

import { CombineScore } from "@/domain/models";
import apiClient from "@/utils/axios-config";
import { ICombineScoreRepository } from "./interfaces";

export class CombineScoreRepository implements ICombineScoreRepository {
  async getAll(): Promise<CombineScore[]> {
    const response = await apiClient.get('/combine-scores');
    return response.data;
  }

  async getById(id: number): Promise<CombineScore> {
    const response = await apiClient.get(`/combine-scores/${id}`);
    return response.data;
  }

  async getByPlayerId(playerId: number): Promise<CombineScore | null> {
    try {
      const response = await apiClient.get(`/combine-scores/player/:playerId/${playerId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async findDuplicateByPlayer(playerId: number): Promise<CombineScore | null> {
    return this.getByPlayerId(playerId);
  }

  async create(combineScore: CombineScore): Promise<CombineScore> {
    const response = await apiClient.post('/combine-scores', combineScore);
    return response.data;
  }

  async update(id: number, combineScore: CombineScore): Promise<CombineScore> {
    const response = await apiClient.put(`/combine-scores/${id}`, combineScore);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/combine-scores/${id}`);
  }
}
