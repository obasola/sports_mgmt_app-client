// src/services/combineScoreService.ts
import { apiService } from './api'
import type { CombineScore } from '@/types'
import { ApiResponse } from './apiResponse'

export class CombineScoreService {
  private readonly endpoint = '/combine-scores'

  async getAll(): Promise<{data: CombineScore[], pagination: any}> {
    const response = await apiService.get<ApiResponse<CombineScore[]>>(this.endpoint)
    return {
      data: response.data.data,
      pagination: response.data.pagination
    }
  }

  async getById(id: number): Promise<CombineScore> {
    const response = await apiService.get<CombineScore>(`${this.endpoint}/${id}`)
    return response.data
  }

  async getByPlayer(playerId: number): Promise<CombineScore> {
    const response = await apiService.get<CombineScore>(
      `${this.endpoint}/player/${playerId}`
    )
    return response.data
  }

  async create(score: Omit<CombineScore, 'id'>): Promise<CombineScore> {
    const response = await apiService.post<CombineScore>(this.endpoint, score)
    return response.data
  }

  async update(id: number, score: Partial<CombineScore>): Promise<CombineScore> {
    const response = await apiService.put<CombineScore>(
      `${this.endpoint}/${id}`,
      score
    )
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiService.delete(`${this.endpoint}/${id}`)
  }
}

export const combineScoreService = new CombineScoreService()