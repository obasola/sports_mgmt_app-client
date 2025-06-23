// src/services/playerService.ts
import { apiService } from './api'
import type { ApiResponse, Player } from '@/types'



export class PlayerService {
  private readonly endpoint = '/players'

  async getAll(): Promise<{data: Player[], pagination: any}> {
    const response = await apiService.get<ApiResponse<Player[]>>(this.endpoint)
    return {
      data: response.data.data,
      pagination: response.data.pagination
    }
  }

  async getById(id: number): Promise<Player> {
    const response = await apiService.get<Player>(`${this.endpoint}/${id}`)
    return response.data
  }

  async getByName(name: string): Promise<Player[]> {
    const response = await apiService.get<Player[]>(
      `${this.endpoint}/filter?name=${name}`
    )
    return response.data
  }

  async create(player: Omit<Player, 'id'>): Promise<Player> {
    const response = await apiService.post<Player>(this.endpoint, player)
    return response.data
  }

  async update(id: number, player: Partial<Player>): Promise<Player> {
    const response = await apiService.put<Player>(
      `${this.endpoint}/${id}`,
      player
    )
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiService.delete(`${this.endpoint}/${id}`)
  }
}

export const playerService = new PlayerService()
