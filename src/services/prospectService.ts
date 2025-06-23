// src/services/prospectService.ts
import { apiService } from './api'
import type { ApiResponse, Prospect } from '@/types'


export class ProspectService {
  private readonly endpoint = '/prospects'

  async getAll(): Promise<{data: Prospect[], pagination: any}> {
    const response = await apiService.get<ApiResponse<Prospect[]>>(this.endpoint)
    return {
      data: response.data.data,
      pagination: response.data.pagination
    }
  }

  async getById(id: number): Promise<Prospect> {
    const response = await apiService.get<Prospect>(`${this.endpoint}/${id}`)
    return response.data
  }

  async getByName(name: string): Promise<Prospect[]> {
    const response = await apiService.get<Prospect[]>(
      `${this.endpoint}/filter?name=${name}`
    )
    return response.data
  }

  async getByPosition(position: string): Promise<Prospect[]> {
    const response = await apiService.get<Prospect[]>(
      `${this.endpoint}/filter?position=${position}`
    )
    return response.data
  }

  async getByCollege(college: string): Promise<Prospect[]> {
    const response = await apiService.get<Prospect[]>(
      `${this.endpoint}/filter?college=${college}`
    )
    return response.data
  }

  async getByDraftYear(year: number): Promise<Prospect[]> {
    const response = await apiService.get<Prospect[]>(
      `${this.endpoint}/filter?draftYear=${year}`
    )
    return response.data
  }

  async getUndrafted(): Promise<Prospect[]> {
    const response = await apiService.get<Prospect[]>(
      `${this.endpoint}/filter?drafted=false`
    )
    return response.data
  }

  async create(data: Omit<Prospect, 'id'>): Promise<Prospect> {
    const response = await apiService.post<Prospect>(this.endpoint, data)
    return response.data
  }

  async update(id: number, data: Partial<Prospect>): Promise<Prospect> {
    const response = await apiService.put<Prospect>(`${this.endpoint}/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiService.delete(`${this.endpoint}/${id}`)
  }
}

export const prospectService = new ProspectService()