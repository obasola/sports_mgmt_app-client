// src/services/playerTeamService.ts
import { apiService } from './api'
import type { ApiResponse, PlayerTeam, CreatePlayerTeam } from '@/types'
 
export class PlayerTeamService {
  private readonly endpoint = '/player-teams'

  async getAll(): Promise<{data: PlayerTeam[], pagination: any}> {
    const response = await apiService.get<ApiResponse<PlayerTeam[]>>(this.endpoint)
    return {
      data: response.data.data,
      pagination: response.data.pagination
    }
  }

  async getById(id: number): Promise<PlayerTeam> {
    const response = await apiService.get<PlayerTeam>(`${this.endpoint}/${id}`)
    return response.data
  }

  async getByPlayerId(playerId: number): Promise<PlayerTeam[]> {
    const response = await apiService.get<PlayerTeam[]>(
      `${this.endpoint}/filter?playerId=${playerId}`
    )
    return response.data
  }

  async getByTeamId(teamId: number): Promise<PlayerTeam[]> {
    const response = await apiService.get<PlayerTeam[]>(
      `${this.endpoint}/filter?teamId=${teamId}`
    )
    return response.data
  }

  async getCurrentByTeam(teamId: number): Promise<PlayerTeam[]> {
    const response = await apiService.get<PlayerTeam[]>(
      `${this.endpoint}/filter?teamId=${teamId}&currentTeam=true`
    )
    return response.data
  }

  async create(data: CreatePlayerTeam): Promise<PlayerTeam> {
    const response = await apiService.post<PlayerTeam>(this.endpoint, data)
    return response.data
  }

  async update(id: number, data: Partial<PlayerTeam>): Promise<PlayerTeam> {
    const response = await apiService.put<PlayerTeam>(`${this.endpoint}/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiService.delete(`${this.endpoint}/${id}`)
  }
}

export const playerTeamService = new PlayerTeamService()