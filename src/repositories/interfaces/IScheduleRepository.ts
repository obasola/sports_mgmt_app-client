
// src/domain/repositories/interfaces/IScheduleRepository.ts
import { IBaseRepository } from './IBaseRepository';
import type { Schedule } from '@/domain/models/Schedule';

/**
 * Schedule repository interface
 */
export interface IScheduleRepository extends IBaseRepository<Schedule> {
  getByTeamId(teamId: number): Promise<Schedule[]>;
  getBySeasonYear(year: number): Promise<Schedule[]>;
  findDuplicate(teamId: number, seasonYear: number): Promise<Schedule | null>;
}
