
  // src/domain/repositories/interfaces/IDraftPickRepository.ts
  import { IBaseRepository } from './IBaseRepository';
  import type { DraftPick } from '@/domain/models/DraftPick';
  
  /**
   * Draft pick repository interface
   */
  export interface IDraftPickRepository extends IBaseRepository<DraftPick> {
    getByTeamId(teamId: number): Promise<DraftPick[]>;
    getByPlayerId(playerId: number): Promise<DraftPick | null>;
    findDuplicateByPlayer(playerId: number): Promise<DraftPick | null>;
    findDuplicateByYearRoundPick(year: number, round: number, pickNumber: number): Promise<DraftPick | null>;
  }
  