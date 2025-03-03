// src/core/domain/interfaces/ITeamRepository.ts
import type { Team } from '@/domain/models/Team';
import type { IRepository } from '@/domain/repositories/interfaces/IRepository';
import type { PlayerAward } from '@/domain/models/PlayerAward';
import type { CombineScore } from '@/domain/models/CombineScore';

export interface ITeamRepository extends IRepository<Team> {
  findAll(): Promise<Team[]>;
  findById(id: number): Promise<Team>;
  findByName(name: string): Promise<Team | null>;
  findByTeams(conference: string, division: string): Promise<Team[]>;

  findWithPlayers(id: number): Promise<Team>;
  findWithSchedules(id: number): Promise<Team>;

  create(team: Team): Promise<Team>;
  update(id: number, team: Team): Promise<Team>;
  delete(id: number): Promise<boolean>;
}
