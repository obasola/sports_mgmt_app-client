import { apiService } from './api'
import type { Team } from '@/types'
import { ApiResponse } from './apiResponse'

export class TeamService {
  private readonly endpoint = '/teams'

  async getAll(): Promise<{data: Team[], pagination: any}> {
    const response = await apiService.get<ApiResponse<Team[]>>(this.endpoint)
    return {
      data: response.data.data,
      pagination: response.data.pagination
    }
  }

  async getById(id: number): Promise<Team> {
    const response = await apiService.get<Team>(`${this.endpoint}/${id}`)
    return response.data
  }

  async getByName(name: string): Promise<Team[]> {
    const response = await apiService.get<Team[]>(
      `${this.endpoint}/filter?name=${name}`
    )
    return response.data
  }

  async create(data: Omit<Team, 'id'>): Promise<Team> {
    const response = await apiService.post<Team>(this.endpoint, data)
    return response.data
  }

  async update(id: number, data: Partial<Team>): Promise<Team> {
    const response = await apiService.put<Team>(`${this.endpoint}/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiService.delete(`${this.endpoint}/${id}`)
  }
}

export const teamService = new TeamService()
