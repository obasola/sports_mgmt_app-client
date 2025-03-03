import type { CombineScore } from "./CombineScore";
import type { PlayerAward } from "./PlayerAward";
import type { Team } from "./Team";
import type { DraftPick } from "./DraftPick";

// src/core/domain/models/Player.ts
export interface Player {
  id?: number;
  firstName: string;
  lastName: string;
  age: number;
  height: number;
  weight: number;
  handSize: number;
  armLength: number;
  homeCity: string;
  homeState: string;
  university: string;
  yearEnteredLeague: number;
  position: string;
  teamId: number;
  Team?: Team;
  award?: PlayerAward[];
  pickId: number;
  pick?: DraftPick;
  combineScore?: CombineScore;
}





