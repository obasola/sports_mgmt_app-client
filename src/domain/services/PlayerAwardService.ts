// src/domain/services/playerAwardService.ts
import type { IPlayerAwardService } from '@/domain/services/interfaces/IPlayerAwardService';
import type { IPlayerAwardRepository } from '@/domain/repositories/interfaces/IPlayerAwardRepository';
import type { PlayerAward } from '@/domain/models/PlayerAward';

export class PlayerAwardService implements IPlayerAwardService {
  private playerAwardRepository: IPlayerAwardRepository;

  constructor(playerAwardRepository: IPlayerAwardRepository) {
    this.playerAwardRepository = playerAwardRepository;
  }

  async getAllPlayerAwards(): Promise<PlayerAward[]> {
    return this.playerAwardRepository.findAll();
  }

  async getPlayerAwardById(id: number): Promise<PlayerAward> {
    return this.playerAwardRepository.findById(id);
  }

  async getPlayerAwardsByPlayerId(playerId: number): Promise<PlayerAward[]> {
    return this.playerAwardRepository.findByPlayerId(playerId);
  }

  async getPlayerAwardsByYear(year: number): Promise<PlayerAward[]> {
    return this.playerAwardRepository.findByYear(year);
  }

  async createPlayerAward(playerAward: PlayerAward): Promise<PlayerAward> {
    return this.playerAwardRepository.create(playerAward);
  }

  async updatePlayerAward(id: number, playerAward: PlayerAward): Promise<PlayerAward> {
    return this.playerAwardRepository.update(id, playerAward);
  }

  async deletePlayerAward(id: number): Promise<boolean> {
    return this.playerAwardRepository.delete(id);
  }
}
