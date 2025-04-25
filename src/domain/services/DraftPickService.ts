// src/domain/services/DraftPickService.ts
import { DraftPickRepository } from '@/repositories/DraftPickRepository'
import { IDraftPickRepository } from '@/repositories/interfaces'
import { BaseService } from './BaseService'
import type { DraftPick } from '@/domain/models/DraftPick'
import { DuplicateEntityError } from './errors/DuplicateEntityError'

export class DraftPickService extends BaseService<DraftPick, IDraftPickRepository> {
  constructor(repository: IDraftPickRepository = new DraftPickRepository()) {
    super(repository)
  }

  /**
   * Get picks by team ID
   */
  async getByTeamId(teamId: number): Promise<DraftPick[]> {
    return this.repository.getByTeamId(teamId)
  }

  /**
   * Get pick by player ID
   */
  async getByPlayerId(playerId: number): Promise<DraftPick | null> {
    return this.repository.getByPlayerId(playerId)
  }

  /**
   * Create a new draft pick with duplicate checking
   */
  async create(pick: DraftPick): Promise<DraftPick> {
    // Check for duplicates by player
    if (pick.playerId) {
      const existingPickByPlayer = await this.repository.findDuplicateByPlayer(pick.playerId)
      if (existingPickByPlayer) {
        throw new DuplicateEntityError(
          `This player is already associated with draft pick #${existingPickByPlayer.pickNumber} in round ${existingPickByPlayer.round} of the ${existingPickByPlayer.draftYear} draft`,
          'DraftPick',
          existingPickByPlayer.id
        )
      }
    }

    // Check for duplicates by year, round, and pick number
    const existingPickByPosition = await this.repository.findDuplicateByYearRoundPick(
      pick.draftYear,
      pick.round,
      pick.pickNumber
    )

    if (existingPickByPosition) {
      throw new DuplicateEntityError(
        `Pick #${pick.pickNumber} in round ${pick.round} of the ${pick.draftYear} draft already exists`,
        'DraftPick',
        existingPickByPosition.id
      )
    }

    return this.repository.create(pick)
  }

  /**
   * Update draft pick with duplicate checking
   */
  async update(id: number, pick: DraftPick): Promise<DraftPick> {
    // Check for duplicates by player (excluding current pick)
    if (pick.playerId) {
      const existingPickByPlayer = await this.repository.findDuplicateByPlayer(pick.playerId)
      if (existingPickByPlayer && existingPickByPlayer.id !== id) {
        throw new DuplicateEntityError(
          `This player is already associated with another draft pick`,
          'DraftPick',
          existingPickByPlayer.id
        )
      }
    }

    // Check for duplicates by year, round, and pick number (excluding current pick)
    const existingPickByPosition = await this.repository.findDuplicateByYearRoundPick(
      pick.draftYear,
      pick.round,
      pick.pickNumber
    )

    if (existingPickByPosition && existingPickByPosition.id !== id) {
      throw new DuplicateEntityError(
        `Another pick with this position already exists in the draft`,
        'DraftPick',
        existingPickByPosition.id
      )
    }

    return this.repository.update(id, pick)
  }

  /**
   * Create or update draft pick (handles duplicates automatically)
   */
  async createOrUpdate(pick: DraftPick): Promise<DraftPick> {
    try {
      return await this.create(pick)
    } catch (error) {
      if (error instanceof DuplicateEntityError && error.existingId) {
        return this.repository.update(error.existingId, pick)
      }
      throw error
    }
  }
}
