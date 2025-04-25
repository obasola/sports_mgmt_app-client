// src/domain/services/PlayerAwardService.ts
import { IPlayerAwardRepository } from '@/repositories/interfaces'
import { BaseService } from './BaseService'
import type { PlayerAward } from '@/domain/models/PlayerAward'
import { DuplicateEntityError } from './errors/DuplicateEntityError'
import { PlayerAwardRepository } from '@/repositories/PlayerAwardRepository'

export class PlayerAwardService extends BaseService<PlayerAward, IPlayerAwardRepository> {
  constructor(repository: IPlayerAwardRepository = new PlayerAwardRepository()) {
    super(repository)
  }

  /**
   * Get awards by player ID
   */
  async getByPlayerId(playerId: number): Promise<PlayerAward[]> {
    return this.repository.getByPlayerId(playerId)
  }

  /**
   * Create a new award with duplicate checking
   */
  async create(award: PlayerAward): Promise<PlayerAward> {
    // Check for duplicates
    const existingAward = await this.repository.findDuplicate(
      award.playerId,
      award.name,
      award.yearAwarded
    )

    if (existingAward) {
      throw new DuplicateEntityError(
        `Player already has the "${award.name}" award for ${award.yearAwarded}`,
        'PlayerAward',
        existingAward.id
      )
    }

    return this.repository.create(award)
  }

  /**
   * Update award with duplicate checking
   */
  async update(id: number, award: PlayerAward): Promise<PlayerAward> {
    // Check for duplicates (excluding the current award)
    const existingAward = await this.repository.findDuplicate(
      award.playerId,
      award.name,
      award.yearAwarded
    )

    if (existingAward && existingAward.id !== id) {
      throw new DuplicateEntityError(
        `Player already has another "${award.name}" award for ${award.yearAwarded}`,
        'PlayerAward',
        existingAward.id
      )
    }

    return this.repository.update(id, award)
  }

  /**
   * Create or update award (handles duplicates automatically)
   */
  async createOrUpdate(award: PlayerAward): Promise<PlayerAward> {
    try {
      return await this.create(award)
    } catch (error) {
      if (error instanceof DuplicateEntityError && error.existingId) {
        return this.repository.update(error.existingId, award)
      }
      throw error
    }
  }
}
