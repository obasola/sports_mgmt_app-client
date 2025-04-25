

// src/domain/repositories/interfaces/ICombineScoreRepository.ts
import { IBaseRepository } from './IBaseRepository';
import type { CombineScore } from '@/domain/models/CombineScore';

/**
 * Combine score repository interface
 */
export interface ICombineScoreRepository extends IBaseRepository<CombineScore> {
  getByPlayerId(playerId: number): Promise<CombineScore | null>;
  findDuplicateByPlayer(playerId: number): Promise<CombineScore | null>;
}
