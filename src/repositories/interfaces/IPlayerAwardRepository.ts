
  // src/domain/repositories/interfaces/IPlayerAwardRepository.ts
  import { IBaseRepository } from './IBaseRepository';
  import type { PlayerAward } from '@/domain/models/PlayerAward';
  
  /**
   * Player award repository interface
   */
  export interface IPlayerAwardRepository extends IBaseRepository<PlayerAward> {
    getByPlayerId(playerId: number): Promise<PlayerAward[]>;
    findDuplicate(playerId: number, name: string, yearAwarded: number): Promise<PlayerAward | null>;
  }
  