import { Player } from './Player'

// src/domain/models/PlayerAward.ts
export interface PlayerAward {
  id?: number
  name: string
  yearAwarded: number
  playerId: number
  player?: Player
}
