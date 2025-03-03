// src/domain/repositories/interfaces/IPlayerAwardRepository.ts
import type { PlayerAward } from '@/domain/models/PlayerAward';

export interface IPlayerAwardRepository {
  findAll(): Promise<PlayerAward[]>;
  findById(id: number): Promise<PlayerAward>;
  findByPlayerId(playerId: number): Promise<PlayerAward[]>;
  findByYear(year: number): Promise<PlayerAward[]>;
  findByAwardName(awardName: string): Promise<PlayerAward[]>;
  create(playerAward: PlayerAward): Promise<PlayerAward>;
  update(id: number, playerAward: PlayerAward): Promise<PlayerAward>;
  delete(id: number): Promise<boolean>;
}
