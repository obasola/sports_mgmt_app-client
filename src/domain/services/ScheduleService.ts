// src/domain/services/ScheduleService.ts

import { IScheduleRepository } from '@/repositories/interfaces'
import { ScheduleRepository } from '@/repositories/ScheduleRepository'
import { Schedule } from '../models'
import { BaseService } from './BaseService'
import { DuplicateEntityError } from './errors/DuplicateEntityError'

export class ScheduleService extends BaseService<Schedule, IScheduleRepository> {
  constructor(repository: IScheduleRepository = new ScheduleRepository()) {
    super(repository)
  }

  /**
   * Get schedules by team ID
   */
  async getByteamId(teamId: number): Promise<Schedule[]> {
    return this.repository.getByTeamId(teamId)
  }

  /**
   * Get schedules by season year
   */
  async getBySeasonYear(year: number): Promise<Schedule[]> {
    return this.repository.getBySeasonYear(year)
  }

  /**
   * Create a new schedule with duplicate checking
   */
  async create(schedule: Schedule): Promise<Schedule> {
    const teamId = this.getteamId(schedule);

    // Check for duplicates by team and season year
    const existingSchedule = await this.repository.findDuplicate(
      teamId, // Using teamId as the teamId for duplicate checking
      Number(schedule.seasonYear)
      
    )

    if (existingSchedule) {
      throw new DuplicateEntityError(
        `A schedule for this team and season (${schedule.seasonYear}) already exists`,
        'Schedule',
        existingSchedule.id
      )
    }

    return this.repository.create(schedule)
  }

  /**
   * Update schedule with duplicate checking
   */
  async update(id: number, schedule: Schedule): Promise<Schedule> {
    const teamId = this.getteamId(schedule);
    // Check for duplicates (excluding the current schedule)
    const existingSchedule = await this.repository.findDuplicate(
      teamId,
      Number( schedule.seasonYear )
    )

    if (existingSchedule && existingSchedule.id !== id) {
      throw new DuplicateEntityError(
        `Another schedule for this team and season (${schedule.seasonYear}) already exists`,
        'Schedule',
        existingSchedule.id
      )
    }

    return this.repository.update(id, schedule)
  }

  /**
   * Create or update schedule (handles duplicates automatically)
   */
  async createOrUpdate(schedule: Schedule): Promise<Schedule> {
    try {
      return await this.create(schedule)
    } catch (error) {
      if (error instanceof DuplicateEntityError && error.existingId) {
        return this.repository.update(error.existingId, schedule)
      }
      throw error
    }
  }
  getteamId(schedule: Schedule) : number {
    let teamId: number = 0;
    if(typeof schedule.teamId === 'number') {
        teamId = schedule.teamId;
    }
    else
    if(typeof schedule.teamId === 'number' && schedule.homeOrAway === 'H') {
        teamId = schedule.teamId;
    }
    else
    if(typeof schedule.oppTeamId === 'number' && schedule.homeOrAway === 'A') {
        teamId = schedule.oppTeamId;
    }
    return teamId;
  }
}
