// src/domain/services/CombineScoreService.ts
import { CombineScoreRepository } from '@/repositories/CombineScoreRepository'
import { ICombineScoreRepository } from '@/repositories/interfaces'
import { CombineScore } from '../models'
import { BaseService } from './BaseService'
import { DuplicateEntityError } from './errors/DuplicateEntityError'

export class CombineScoreService extends BaseService<CombineScore, ICombineScoreRepository> {
  constructor(repository: ICombineScoreRepository = new CombineScoreRepository()) {
    super(repository)
  }

  /**
   * Get combine score by player ID
   */
  async getByPlayerId(playerId: number): Promise<CombineScore | null> {
    return this.repository.getByPlayerId(playerId)
  }

  /**
   * Create a new combine score with duplicate checking
   */
  async create(combineScore: CombineScore): Promise<CombineScore> {
    // Check for duplicates by player
    const existingScore = await this.repository.findDuplicateByPlayer(combineScore.playerId)

    if (existingScore) {
      throw new DuplicateEntityError(
        `This player already has combine scores recorded`,
        'CombineScore',
        existingScore.id
      )
    }

    return this.repository.create(combineScore)
  }

  /**
   * Update combine score with duplicate checking
   */
  async update(id: number, combineScore: CombineScore): Promise<CombineScore> {
    // Check for duplicates by player (excluding current score)
    const existingScore = await this.repository.findDuplicateByPlayer(combineScore.playerId)

    if (existingScore && existingScore.id !== id) {
      throw new DuplicateEntityError(
        `This player already has other combine scores recorded`,
        'CombineScore',
        existingScore.id
      )
    }

    return this.repository.update(id, combineScore)
  }

  /**
   * Create or update combine score (handles duplicates automatically)
   */
  async createOrUpdate(combineScore: CombineScore): Promise<CombineScore> {
    try {
      return await this.create(combineScore)
    } catch (error) {
      if (error instanceof DuplicateEntityError && error.existingId) {
        return this.repository.update(error.existingId, combineScore)
      }
      throw error
    }
  }
}
