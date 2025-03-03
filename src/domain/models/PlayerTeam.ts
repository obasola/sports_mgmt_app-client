// src/domain/models/playerTeam.model.ts
import type { Player } from './Player';
import type { Team } from './Team';

export interface PlayerTeam {
  id?: number;
  playerId: number;
  teamId: number;
  current_team: number; // 1 = true, 0 = false
  Player?: Player;
  Team?: Team;
  startYear?: number; // Optional additional information
  endYear?: number;   // Optional additional information
}
