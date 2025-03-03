// src/domain/services/interfaces/IPlayerAwardService.ts
import type { PlayerAward } from '@/domain/models/PlayerAward';

export interface IPlayerAwardService {
  getAllPlayerAwards(): Promise<PlayerAward[]>;
  getPlayerAwardById(id: number): Promise<PlayerAward>;
  getPlayerAwardsByPlayerId(playerId: number): Promise<PlayerAward[]>;
  getPlayerAwardsByYear(year: number): Promise<PlayerAward[]>;
  createPlayerAward(playerAward: PlayerAward): Promise<PlayerAward>;
  updatePlayerAward(id: number, playerAward: PlayerAward): Promise<PlayerAward>;
  deletePlayerAward(id: number): Promise<boolean>;
}
