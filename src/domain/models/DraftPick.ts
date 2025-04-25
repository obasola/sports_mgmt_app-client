import { Player } from "./Player"
import { Team } from "./Team"

// src/domain/models/DraftPick.ts
export interface DraftPick {
  id?: number
  round: number
  pickNumber: number
  draftYear: number
  pickFrom: number
  pickTo: number
  combineScore: number
  teamId: number
  playerId: number
  team?: Team
  player?: Player
}
