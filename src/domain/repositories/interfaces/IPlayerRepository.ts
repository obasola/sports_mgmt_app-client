// src/core/domain/interfaces/IPlayerRepository.ts
import type { Player } from '@/domain/models/Player';
import type { IRepository } from '@/domain/repositories/interfaces/IRepository';

export interface IPlayerRepository extends IRepository<Player> {
  findAll(): Promise<Player[]>;
  findById(id: number): Promise<Player>;
  findByName(firstName: string, lastName: string): Promise<Player[]>;
  findByTeamId(teamId: number): Promise<Player[]>;
  findByPosition(position: string): Promise<Player[]>;
  create(player: Player): Promise<Player>;
  update(id: number, player: Player): Promise<Player>;
  delete(id: number | undefined): Promise<boolean>;
}


