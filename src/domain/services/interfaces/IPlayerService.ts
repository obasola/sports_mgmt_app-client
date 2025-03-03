import type { Player } from "@/domain/models";

export interface IPlayerService {
  getAllPlayers(): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player>;
  searchPlayersByName(firstName: string, lastName: string): Promise<Player[]>;
  createPlayer(player: Player): Promise<Player>;
  updatePlayer(id: number, player: Player): Promise<Player>;
  deletePlayer(id: number): Promise<boolean>;
}
