import { CombineScore } from './CombineScore'
import { DraftPick } from './DraftPick'
import { PlayerAward } from './PlayerAward'
import { Team } from './Team'

// src/domain/models/Player.ts
export interface Player {
  id?: number
  firstName: string
  lastName: string
  age: number
  height: number
  weight: number
  handSize: number
  armLength: number
  homeCity: string
  homeState: string
  university: string
  yearEnteredLeague: Date
  position: string
  team?: Team
  awards?: PlayerAward[]
  pick?: DraftPick
  combineScore?: CombineScore
}