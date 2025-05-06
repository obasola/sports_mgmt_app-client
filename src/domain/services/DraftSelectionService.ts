// src/services/DraftSelectionService.ts
import apiClient from '@/utils/axios-config';
import { DraftSelection } from '@/domain/models/DraftSelection';
import { getNextSeptemberMonday} from '../../utils/DraftUtils';

class DraftSelectionService {
  /**
   * Get all draft selections
   */
  async getAll(): Promise<DraftSelection[]> {
    const response = await apiClient.get('/draft-picks');
    return response.data;
  }

  /**
   * Get a draft selection by ID
   */
  async getById(id: number): Promise<DraftSelection> {
    const response = await apiClient.get(`/draft-picks/${id}`);
    return response.data;
  }

  /**
   * Create a new draft selection and associated player-team relationship
   */
  async create(draftSelection: Partial<DraftSelection>): Promise<DraftSelection> {
    // 1. Create the draft pick
    const draftPickData = {
      round: draftSelection.draftRound || Math.ceil((draftSelection.pickNumber || 1) / 32),
      pickNumber: draftSelection.pickNumber,
      draftYear: draftSelection.draftYear || new Date().getFullYear(),
      currentTeamId: draftSelection.teamId,
      playerId: draftSelection.playerId,
      used: true,
      originalTeam: draftSelection.teamId
    };

    const draftPickResponse = await apiClient.post('/draft-picks', draftPickData);

    // 2. Create the player-team relationship
    if (draftPickResponse.data && draftSelection.teamId && draftSelection.playerId) {
      // Calculate the start date (first Monday of September in current year)
      const startDate = getNextSeptemberMonday();

      const playerTeamData = {
        playerId: draftSelection.playerId,
        teamId: draftSelection.teamId,
        makeCurrent: true,
        startDate: startDate.toISOString()
      };

      await apiClient.post('/player-teams', playerTeamData);
    }

    return draftPickResponse.data;
  }

  /**
   * Update an existing draft selection
   */
  async update(id: number, draftSelection: Partial<DraftSelection>): Promise<DraftSelection> {
    // 1. Update the draft pick
    const draftPickData: any = {};

    if (draftSelection.draftRound) draftPickData.round = draftSelection.draftRound;
    if (draftSelection.pickNumber) draftPickData.pickNumber = draftSelection.pickNumber;
    if (draftSelection.draftYear) draftPickData.draftYear = draftSelection.draftYear;
    if (draftSelection.teamId) draftPickData.currentTeamId = draftSelection.teamId;
    if (draftSelection.playerId) draftPickData.playerId = draftSelection.playerId;
    if (draftSelection.teamId) draftPickData.originalTeam = draftSelection.teamId;

    const draftPickResponse = await apiClient.put(`/draft-picks/${id}`, draftPickData);

    // 2. Update or create player-team relationship if team or player changed
    if ((draftSelection.teamId || draftSelection.playerId) && draftPickResponse.data) {
      // First, check if player already has a current team
      const currentPlayerId = draftSelection.playerId || draftPickResponse.data.playerId;
      const currentTeamId = draftSelection.teamId || draftPickResponse.data.currentTeamId;

      if (currentPlayerId && currentTeamId) {
        try {
          const playerTeamResponse = await apiClient.get(`/player-teams/player/${currentPlayerId}/current-team`);

          if (playerTeamResponse.data && playerTeamResponse.data.id) {
            // Update existing player-team
            if (playerTeamResponse.data.teamId !== currentTeamId) {
              await apiClient.put(`/player-teams/${playerTeamResponse.data.id}`, {
                teamId: currentTeamId,
                currentTeam: true
              });
            }
          } else {
            // Create new player-team
            const startDate = getNextSeptemberMonday();

            const playerTeamData = {
              playerId: currentPlayerId,
              teamId: currentTeamId,
              makeCurrent: true,
              startDate: startDate.toISOString()
            };

            await apiClient.post('/player-teams', playerTeamData);
          }
        } catch (error) {
          console.error('Error updating player-team relationship:', error);
          // Continue anyway, as the draft pick update was successful
        }
      }
    }

    return draftPickResponse.data;
  }

  /**
   * Delete a draft selection
   */
  async delete(id: number): Promise<boolean> {
    await apiClient.delete(`/draft-picks/${id}`);
    return true;
  }

  /**
   * Get draft picks with player and team details
   */
  async getAllWithDetails(): Promise<DraftSelection[]> {
    const response = await apiClient.get('/draft-picks/with-details');
    return response.data;
  }
}

export default new DraftSelectionService();
