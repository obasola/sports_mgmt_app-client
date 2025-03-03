import type { DraftPick } from "./DraftPick";
import type { Player } from "./Player";
import type { Schedule } from "./Schedule";

// src/core/domain/models/Team.ts
export interface Team {
  id?: number;
  name: string;
  city: string;
  state: string;
  conference: string;
  division: string;
  stadium: string;
  players?: Player[];
  schedule?: Schedule[];
  scheduleId: number;
  picks?: DraftPick[];
}
.'/'
