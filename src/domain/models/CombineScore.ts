import { Player } from "./Player"

export interface CombineScore {
  id?: number
  fortyTime: number
  tenYardSplit: number
  verticalLeap: number
  broadJump: number
  threeCone: number
  twentyYardShuttle: number
  playerId: number
  player?: Player
}