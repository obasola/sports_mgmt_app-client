// src/domain/services/PlayerService.ts
import { IPlayerRepository } from '@/repositories/interfaces'
import { PlayerRepository } from '@/repositories/PlayerRepository'
import { BaseService } from './BaseService'
import type { Player } from '@/domain/models/Player'
import { DuplicateEntityError } from './errors/DuplicateEntityError'

export class PlayerService extends BaseService<Player, IPlayerRepository> {
  constructor(repository: IPlayerRepository = new PlayerRepository()) {
    super(repository)
  }

  /**
   * Get players by team ID
   */
  async getAll(): Promise<Player[]> {
    return this.repository.getAll();
  }

  async getAllUnassigned(): Promise<Player[]> {
    return this.repository.getAllUnassigned();
  }


  /**
   * Get players by team ID
   */
  async getByTeamId(teamId: number): Promise<Player[]> {
    return this.repository.getByTeamId(teamId)
  }

  /**
   * Create a new player with duplicate checking
   * If a duplicate exists, throws a DuplicateEntityError
   */
  async create(player: Player): Promise<Player> {
    // Check for duplicates
    const existingPlayer = await this.repository.findDuplicate(
      player.firstName,
      player.lastName,
      player.university
    )

    if (existingPlayer) {
      throw new DuplicateEntityError(
        `A player named ${player.firstName} ${player.lastName} from ${player.university} already exists`,
        'Player',
        existingPlayer.id
      )
    }

    return this.repository.create(player)
  }

  /**
   * Update player with duplicate checking
   */
  async update(id: number, player: Player): Promise<Player> {
    // Check for duplicates (excluding the current player)
    const existingPlayer = await this.repository.findDuplicate(
      player.firstName,
      player.lastName,
      player.university
    )

    if (existingPlayer && existingPlayer.id !== id) {
      throw new DuplicateEntityError(
        `Another player named ${player.firstName} ${player.lastName} from ${player.university} already exists`,
        'Player',
        existingPlayer.id
      )
    }

    return this.repository.update(id, player)
  }

  /**
   * Create or update player (handles duplicates automatically)
   * If a duplicate exists, it updates the existing player
   */
  async createOrUpdate(player: Player): Promise<Player> {
    try {
      return await this.create(player)
    } catch (error) {
      if (error instanceof DuplicateEntityError && error.existingId) {
        return this.repository.update(error.existingId, player)
      }
      throw error
    }
  }
  /** Requires mods to Repository class and/or routes
  async getUndraftedPlayers(): Promise<Player[]> {
    // This endpoint would need to be implemented on the backend
    // to return players who don't have an associated draft record
    const response = await apiClient.get(`${this.baseUrl}/undrafted`);
    return response.data;
  }
  */
}
