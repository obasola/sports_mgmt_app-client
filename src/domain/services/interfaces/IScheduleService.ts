// src/domain/services/interfaces/IScheduleService.ts
import type { Schedule } from '@/domain/models/Schedule';

export interface IScheduleService {
  getAllSchedules(): Promise<Schedule[]>;
  getScheduleById(id: number): Promise<Schedule>;
  getSchedulesByTeamId(teamId: number): Promise<Schedule[]>;
  getSchedulesByWeek(week: number): Promise<Schedule[]>;
  getSchedulesByDateRange(startDate: Date, endDate: Date): Promise<Schedule[]>;
  createSchedule(schedule: Schedule): Promise<Schedule>;
  updateSchedule(id: number, schedule: Schedule): Promise<Schedule>;
  deleteSchedule(id: number): Promise<boolean>;
}
