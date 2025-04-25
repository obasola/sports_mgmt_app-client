// src/infrastructure/repositories/ScheduleRepository.ts

import { Schedule } from '@/domain/models'
import apiClient from '@/utils/axios-config'
import { IScheduleRepository } from './interfaces'

export class ScheduleRepository implements IScheduleRepository {
  async getAll(): Promise<Schedule[]> {
    const response = await apiClient.get('/schedules')
    return response.data
  }

  async getById(id: number): Promise<Schedule> {
    const response = await apiClient.get(`/schedules/${id}`)
    return response.data
  }

  async getByTeamId(teamId: number): Promise<Schedule[]> {
    const response = await apiClient.get(`/schedules/team/${teamId}`)
    return response.data
  }

  async getBySeasonYear(year: number): Promise<Schedule[]> {
    const response = await apiClient.get(`/schedules/year/${year}`)
    return response.data
  }

  async findDuplicate(teamId: number, seasonYear: number): Promise<Schedule | null> {
    const schedules = await this.getByTeamId(teamId)

    const duplicate = schedules.find(s => Number(s.seasonYear) === seasonYear)

    return duplicate || null
  }

  async create(schedule: Schedule): Promise<Schedule> {
    const response = await apiClient.post('/schedules', schedule)
    return response.data
  }

  async update(id: number, schedule: Schedule): Promise<Schedule> {
    const response = await apiClient.put(`/schedules/${id}`, schedule)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/schedules/${id}`)
  }
}
