import { Player } from "./Player"
import { Team } from "./Team"

// src/domain/models/DraftPick.ts
export interface DraftPick {
  id?: number
  draftYear: number
  round: number
  pickNumber: number
  playerId?: number
  teamId: number
  playerFirstName?: string
  playerLastName?: string
  pickFrom: number
  pickTo: number
  combineScore: number
  team?: Team
  player?: Player
}
