import type { Team } from "@/domain/models";

export interface ITeamService {
  getAllTeams(): Promise<Team[]>;
  getTeamById(id: number): Promise<Team>;
  getTeamByName(name: string): Promise<Team | null>;
  searchTeamsByConferenceAndDivision(conference: string, division: string): Promise<Team[]>;
  createTeam(team: Team): Promise<Team>;
  updateTeam(id: number, team: Team): Promise<Team>;
  deleteTeam(id: number): Promise<boolean>;
}
