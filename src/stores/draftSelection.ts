// src/stores/draftSelection.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { DraftSelection } from '@/domain/models/DraftSelection';
import DraftSelectionService from '../domain/services/DraftSelectionService';
import { Player } from '@/domain/models/Player';
import { Team } from '@/domain/models/Team';
import { PlayerService } from '../domain/services/PlayerService';
import { TeamService } from '../domain/services/TeamService';

export const useDraftSelectionStore = defineStore('draftSelection', () => {
  // State
  const draftSelections = ref<DraftSelection[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const players = ref<Player[]>([]);
  const teams = ref<Team[]>([]);

  const playerService = new PlayerService();
  const teamService = new TeamService();

  // Getters
  const getDraftSelectionById = computed(() => {
    return (id: number) => draftSelections.value.find(draft => draft.id === id);
  });

  const getPlayerById = computed(() => {
    return (id: number) => players.value.find(player => player.id === id);
  });

  const getTeamById = computed(() => {
    return (id: number) => teams.value.find(team => team.id === id);
  });

  // Actions
  async function fetchDraftSelections() {
    loading.value = true;
    error.value = null;

    try {
      // Use the updated service method that includes player and team details
      draftSelections.value = await DraftSelectionService.getAllWithDetails();
    } catch (err: any) {
      error.value = 'Failed to fetch draft selections';
      console.error('Error fetching draft selections:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchDraftSelectionById(id: number) {
    loading.value = true;
    error.value = null;

    try {
      const draftSelection = await DraftSelectionService.getById(id);

      // Update the list if the selection is not already there
      if (!draftSelections.value.some(d => d.id === id)) {
        draftSelections.value.push(draftSelection);
      } else {
        // Update the existing selection
        const index = draftSelections.value.findIndex(d => d.id === id);
        draftSelections.value[index] = draftSelection;
      }

      return draftSelection;
    } catch (err: any) {
      error.value = `Failed to fetch draft selection with ID ${id}`;
      console.error('Error fetching draft selection:', err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createDraftSelection(draftSelection: Partial<DraftSelection>) {
    loading.value = true;
    error.value = null;

    try {
      // Ensure required data is populated
      if (!draftSelection.playerId || !draftSelection.teamId || !draftSelection.pickNumber) {
        throw new Error('Required fields missing: Player, Team, and Pick Number are required');
      }

      // Add player and team names if available
      if (draftSelection.playerId) {
        const player = getPlayerById.value(draftSelection.playerId);
        if (player) {
          draftSelection.playerName = `${player.firstName} ${player.lastName}`;

          // Set position and college from player if not specified
          if (!draftSelection.position && player.position) {
            draftSelection.position = player.position;
          }

          if (!draftSelection.college && player.university) {
            draftSelection.college = player.university;
          }
        }
      }

      if (draftSelection.teamId) {
        const team = getTeamById.value(draftSelection.teamId);
        if (team) {
          draftSelection.teamName = team.name;
        }
      }

      // This call will create both the draft pick and player-team relationship
      const createdDraftSelection = await DraftSelectionService.create(draftSelection);

      // Add to local state
      draftSelections.value.push(createdDraftSelection);

      return createdDraftSelection;
    } catch (err: any) {
      error.value = err.message || 'Failed to create draft selection';
      console.error('Error creating draft selection:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateDraftSelection(id: number, draftSelection: Partial<DraftSelection>) {
    loading.value = true;
    error.value = null;

    try {
      // Add player and team names if available
      if (draftSelection.playerId) {
        const player = getPlayerById.value(draftSelection.playerId);
        if (player) {
          draftSelection.playerName = `${player.firstName} ${player.lastName}`;

          // Set position and college from player if not specified
          if (!draftSelection.position && player.position) {
            draftSelection.position = player.position;
          }

          if (!draftSelection.college && player.university) {
            draftSelection.college = player.university;
          }
        }
      }

      if (draftSelection.teamId) {
        const team = getTeamById.value(draftSelection.teamId);
        if (team) {
          draftSelection.teamName = team.name;
        }
      }

      // This call will update both the draft pick and player-team relationship
      const updatedDraftSelection = await DraftSelectionService.update(id, draftSelection);

      // Update in the local array
      const index = draftSelections.value.findIndex(d => d.id === id);
      if (index !== -1) {
        draftSelections.value[index] = updatedDraftSelection;
      }

      return updatedDraftSelection;
    } catch (err: any) {
      error.value = err.message || `Failed to update draft selection with ID ${id}`;
      console.error('Error updating draft selection:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteDraftSelection(id: number) {
    loading.value = true;
    error.value = null;

    try {
      await DraftSelectionService.delete(id);

      // Remove from the local array
      draftSelections.value = draftSelections.value.filter(d => d.id !== id);

      return true;
    } catch (err: any) {
      error.value = `Failed to delete draft selection with ID ${id}`;
      console.error('Error deleting draft selection:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPlayers() {
    loading.value = true;
    error.value = null;

    // service method NOT implemented yet!
    try {
      players.value = await playerService.getAllUnassigned();
    } catch (err: any) {
      error.value = 'Failed to fetch players';
      console.error('Error fetching players:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchTeams() {
    loading.value = true;
    error.value = null;

    try {
      teams.value = await teamService.getAll();
    } catch (err: any) {
      error.value = 'Failed to fetch teams';
      console.error('Error fetching teams:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchDependencies() {
    await Promise.all([
      fetchPlayers(),
      fetchTeams()
    ]);
  }

  return {
    // State
    draftSelections,
    loading,
    error,
    players,
    teams,

    // Getters
    getDraftSelectionById,
    getPlayerById,
    getTeamById,

    // Actions
    fetchDraftSelections,
    fetchDraftSelectionById,
    createDraftSelection,
    updateDraftSelection,
    deleteDraftSelection,
    fetchPlayers,
    fetchTeams,
    fetchDependencies
  };
});
