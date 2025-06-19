// src/services/playerAwardService.ts
import { apiService } from './api'
import type { PlayerAward } from '@/types'
import { ApiResponse } from './apiResponse'

export class PlayerAwardService {
  private readonly endpoint = '/player-awards'

  async getAll(): Promise<{data: PlayerAward[], pagination: any}> {
    const response = await apiService.get<ApiResponse<PlayerAward[]>>(this.endpoint)
    return {
      data: response.data.data,
      pagination: response.data.pagination
    }
  }

  async getById(id: number): Promise<PlayerAward> {
    const response = await apiService.get<PlayerAward>(`${this.endpoint}/${id}`)
    return response.data
  }

  async getByPlayerId(playerId: number): Promise<PlayerAward[]> {
    const response = await apiService.get<PlayerAward[]>(
      `${this.endpoint}/player/${playerId}`
    )
    return response.data
  }

  async getByAwardName(awardName: string): Promise<PlayerAward[]> {
    const response = await apiService.get<PlayerAward[]>(
      `${this.endpoint}/filter?awardName=${awardName}`
    )
    return response.data
  }

  async create(data: Omit<PlayerAward, 'id'>): Promise<PlayerAward> {
    const response = await apiService.post<PlayerAward>(this.endpoint, data)
    return response.data
  }

  async update(id: number, data: Partial<PlayerAward>): Promise<PlayerAward> {
    const response = await apiService.put<PlayerAward>(`${this.endpoint}/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiService.delete(`${this.endpoint}/${id}`)
  }
}

export const playerAwardService = new PlayerAwardService()