// src/services/draftPickService.ts
import { apiService } from './api'
import type { DraftPick } from '@/types'
import { ApiResponse } from './apiResponse'


export class DraftPickService {
  private readonly endpoint = '/draft-picks'

  async getAll(): Promise<{data: DraftPick[], pagination: any}> {
    const response = await apiService.get<ApiResponse<DraftPick[]>>(this.endpoint)
    return {
      data: response.data.data,
      pagination: response.data.pagination
    }
  }

  async getById(id: number): Promise<DraftPick> {
    const response = await apiService.get<DraftPick>(`${this.endpoint}/${id}`)
    return response.data
  }

  async getByYear(year: number): Promise<DraftPick[]> {
    const response = await apiService.get<DraftPick[]>(
      `${this.endpoint}/filter?year=${year}`
    )
    return response.data
  }

  async getByTeam(teamId: number): Promise<DraftPick[]> {
    const response = await apiService.get<DraftPick[]>(
      `${this.endpoint}/filter?teamId=${teamId}`
    )
    return response.data
  }

  async getByRound(round: number): Promise<DraftPick[]> {
    const response = await apiService.get<DraftPick[]>(
      `${this.endpoint}/filter?round=${round}`
    )
    return response.data
  }

  async create(data: Omit<DraftPick, 'id'>): Promise<DraftPick> {
    const response = await apiService.post<DraftPick>(this.endpoint, data)
    return response.data
  }

  async update(id: number, data: Partial<DraftPick>): Promise<DraftPick> {
    const response = await apiService.put<DraftPick>(`${this.endpoint}/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiService.delete(`${this.endpoint}/${id}`)
  }
}

export const draftPickService = new DraftPickService()