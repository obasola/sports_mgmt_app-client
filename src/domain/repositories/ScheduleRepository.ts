
// src/domain/repositories/scheduleRepository.ts
import type { IScheduleRepository } from './interfaces/IScheduleRepository';
import type { Schedule } from '@/domain/models/Schedule';
import apiClient from '@/infrastructure/api/axios-config';

export class ScheduleRepository implements IScheduleRepository {
  private readonly basePath = '/schedules';

  async findAll(): Promise<Schedule[]> {
    try {
      const response = await apiClient.get<Schedule[]>(this.basePath);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Schedule> {
    try {
      const response = await apiClient.get<Schedule>(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule with id ${id}:`, error);
      throw error;
    }
  }

  async findByTeamId(teamId: number): Promise<Schedule[]> {
    try {
      const response = await apiClient.get<Schedule[]>(`${this.basePath}/team/${teamId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedules for team ${teamId}:`, error);
      throw error;
    }
  }

  async findByWeek(week: number): Promise<Schedule[]> {
    try {
      const response = await apiClient.get<Schedule[]>(`${this.basePath}/week/${week}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedules for week ${week}:`, error);
      throw error;
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Schedule[]> {
    try {
      const response = await apiClient.get<Schedule[]>(`${this.basePath}/dateRange`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedules for date range:`, error);
      throw error;
    }
  }
  async findHomeGames(teamId: number): Promise<Schedule[]> {
    try {
      const response = await apiClient.get<Schedule[]>(`${this.basePath}/team/${teamId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedules for team ${teamId}:`, error);
      throw error;
    }
  }
  async findAwayGames(teamId: number): Promise<Schedule[]> {
    try {
      const response = await apiClient.get<Schedule[]>(`${this.basePath}/team/${teamId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedules for team ${teamId}:`, error);
      throw error;
    }
  }

  async create(schedule: Schedule): Promise<Schedule> {
    try {
      const response = await apiClient.post<Schedule>(this.basePath, schedule);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }

  async update(id: number, schedule: Schedule): Promise<Schedule> {
    try {
      const response = await apiClient.put<Schedule>(`${this.basePath}/${id}`, schedule);
      return response.data;
    } catch (error) {
      console.error(`Error updating schedule with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting schedule with id ${id}:`, error);
      throw error;
    }
  }
}
