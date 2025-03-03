// src/core/domain/models/Schedule.ts
export interface Schedule {
  id?: number;
  teamID: number;
  homeTeamId: number;
  awayTeamId: number;
  scheduleWeek: number;
  gameDate: Date;
  gameCity: string;
  gameStateProvince: string;
  gameCountry: string;
  gameLocation: string;
  awayTeamConference: string;
  awayTeamDivision: string;
  wonLostFlag: string;
  homeOrAway: string;
  awayTeamScore: number;
  homeScore: number;
}

