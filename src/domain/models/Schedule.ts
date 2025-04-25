// src/domain/models/Schedule.ts
export interface Schedule {
  id?: number;
  teamId?: number;
  seasonYear: string;
  oppTeamId: number;
  oppTeamConference?: string;
  oppTeamDivision?: string;
  scheduleWeek?: number;
  gameDate?: Date;
  gameCity?: string;
  gameStateProvince?: string;
  gameCountry?: string;
  gameLocation?: string;
  wonLostFlag?: string;
  homeOrAway?: string;
  oppTeamScore?: number;
  teamScore: number;
  result?: string;
  
  // Additional fields for UI purposes - not stored in backend
 // opposingTeamConference?: string; // Conference of the opposing team
 // opposingTeamDivision?: string; // Division of the opposing team (short name)
}

