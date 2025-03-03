
import type { IPlayerService } from '@/domain/services/interfaces/IPlayerService';
import type { IPlayerRepository } from '../repositories/interfaces/IPlayerRepository';
import type { Player } from '@/domain/models/Player';

export class PlayerService implements IPlayerService {
  private playerRepository: IPlayerRepository;

  constructor(playerRepository: IPlayerRepository) {
    this.playerRepository = playerRepository;
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.playerRepository.findAll();
  }

  async getPlayerById(id: number): Promise<Player> {
    return this.playerRepository.findById(id);
  }

  async searchPlayersByName(firstName: string, lastName: string): Promise<Player[]> {
    return this.playerRepository.findByName(firstName, lastName);
  }

  async createPlayer(player: Player): Promise<Player> {
    return this.playerRepository.create(player);
  }

  async updatePlayer(id: number, player: Player): Promise<Player> {
    return this.playerRepository.update(id, player);
  }

  async deletePlayer(id: number | undefined): Promise<boolean> {
    return this.playerRepository.delete(id);
  }
}
