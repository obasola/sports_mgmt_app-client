// src/domain/services/scheduleService.ts
import type{ IScheduleService } from '@/domain/services/interfaces/IScheduleService';
import type{ IScheduleRepository } from '@/domain/repositories/interfaces/IScheduleRepository';
import type{ Schedule } from '@/domain/models/Schedule';

export class ScheduleService implements IScheduleService {
  private scheduleRepository: IScheduleRepository;

  constructor(scheduleRepository: IScheduleRepository) {
    this.scheduleRepository = scheduleRepository;
  }

  async getAllSchedules(): Promise<Schedule[]> {
    return this.scheduleRepository.findAll();
  }

  async getScheduleById(id: number): Promise<Schedule> {
    return this.scheduleRepository.findById(id);
  }

  async getSchedulesByTeamId(teamId: number): Promise<Schedule[]> {
    return this.scheduleRepository.findByTeamId(teamId);
  }

  async getSchedulesByWeek(week: number): Promise<Schedule[]> {
    return this.scheduleRepository.findByWeek(week);
  }

  async getSchedulesByDateRange(startDate: Date, endDate: Date): Promise<Schedule[]> {
    return this.scheduleRepository.findByDateRange(startDate, endDate);
  }

  async createSchedule(schedule: Schedule): Promise<Schedule> {
    return this.scheduleRepository.create(schedule);
  }

  async updateSchedule(id: number, schedule: Schedule): Promise<Schedule> {
    return this.scheduleRepository.update(id, schedule);
  }

  async deleteSchedule(id: number): Promise<boolean> {
    return this.scheduleRepository.delete(id);
  }
}
