
  // src/domain/repositories/interfaces/ITeamRepository.ts
  import { IBaseRepository } from './IBaseRepository';
  import type { Team } from '@/domain/models/Team';
  import type { Player } from '@/domain/models/Player';
  import type { Schedule } from '@/domain/models/Schedule';
  import type { DraftPick } from '@/domain/models/DraftPick';
  
  /**
   * Team repository interface
   */
  export interface ITeamRepository extends IBaseRepository<Team> {
    getTeamPlayers(teamId: number): Promise<Player[]>;
    getTeamSchedule(teamId: number): Promise<Schedule[]>;
    getTeamDraftPicks(teamId: number): Promise<DraftPick[]>;
    findDuplicateByName(name: string): Promise<Team | null>;
    
  }