// src/domain/models/DraftSelection.ts
export interface DraftSelection {
  id?: number;
  draftYear: number;
  draftRound: number;
  pickNumber: number;
  playerId: number;
  teamId: number;
  teamName?: string;
  playerName?: string;
  position: string;
  college?: string;
}
