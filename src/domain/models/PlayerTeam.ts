import { Player } from './Player'
import { Team } from './Team'

// src/domain/models/PlayerTeam.ts
export interface PlayerTeam {
  id?: number
  startDate: Date
  currentTeam: boolean
  playerId: number
  player?: Player
  teamId: number
  team?: Team
  endDate?: Date
}
