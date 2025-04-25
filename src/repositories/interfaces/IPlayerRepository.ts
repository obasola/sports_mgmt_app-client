
  // src/domain/repositories/interfaces/IPlayerRepository.ts
  import { IBaseRepository } from './IBaseRepository';
  import type { Player } from '@/domain/models/Player';
  import type { PlayerAward } from '@/domain/models/PlayerAward';
  import type { CombineScore } from '@/domain/models/CombineScore';
import { DraftProspect } from '@/domain/models/DraftProspect';
  

  /**
   * Player repository interface
   */
  export interface IPlayerRepository extends IBaseRepository<Player> {
    getByTeamId(teamId: number): Promise<Player[]>;
    getPlayersByTeamId(teamId: number): Promise<Player[]>;
    getPlayerAwards(playerId: number): Promise<PlayerAward[]>;
    getPlayerCombineScore(playerId: number): Promise<CombineScore>;
    findDuplicate(firstName: string, lastName: string, university: string): Promise<Player | null>;

    // Draft-specific methods
    getProspects(): Promise<DraftProspect[]>;
    getDraftedPlayers(): Promise<DraftProspect[]>;
    getProspectById(id: number): Promise<DraftProspect | null>;
  }
  
  