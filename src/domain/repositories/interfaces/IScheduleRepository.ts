// src/domain/repositories/interfaces/IScheduleRepository.ts
import type { Schedule } from '@/domain/models/Schedule';

export interface IScheduleRepository {
  findAll(): Promise<Schedule[]>;
  findById(id: number): Promise<Schedule>;
  findByTeamId(teamId: number): Promise<Schedule[]>;
  findByWeek(week: number): Promise<Schedule[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Schedule[]>;
  findHomeGames(teamId: number): Promise<Schedule[]>;
  findAwayGames(teamId: number): Promise<Schedule[]>;
  create(schedule: Schedule): Promise<Schedule>;
  update(id: number, schedule: Schedule): Promise<Schedule>;
  delete(id: number): Promise<boolean>;
}
