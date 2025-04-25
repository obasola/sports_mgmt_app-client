import { IDraftProspectRepository } from '@/repositories/interfaces/IDraftProspectRepository';
import { DraftProspect } from '@/domain/models/DraftProspect';
import apiClient from '@/utils/axios-config';

class DraftProspectRepository implements IDraftProspectRepository {
  async getAllProspects(): Promise<DraftProspect[]> {
    try {
      const response = await apiClient.get('/draft/prospects/available');
      return response.data;
    } catch (error) {
      console.error('Error fetching available prospects:', error);
      throw error;
    }
  }

  async getProspectById(id: number): Promise<DraftProspect | null> {
    try {
      const response = await apiClient.get(`/draft/prospects/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching prospect with id ${id}:`, error);
      // Return null if 404 (not found)
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getProspectsByTeamNeeds(teamId: number): Promise<DraftProspect[]> {
    try {
      const response = await apiClient.get(`/draft/teams/${teamId}/prospects/needs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching prospects by team needs:', error);
      throw error;
    }
  }

  async getDraftedProspects(): Promise<DraftProspect[]> {
    try {
      const currentYear = new Date().getFullYear();
      const response = await apiClient.get(`/draft/prospects/drafted/${currentYear}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching drafted prospects:', error);
      throw error;
    }
  }

  async getTeamDraftedProspects(teamId: number, year: number): Promise<DraftProspect[]> {
    try {
      const response = await apiClient.get(`/draft/teams/${teamId}/prospects/drafted/${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team drafted prospects:', error);
      throw error;
    }
  }

  async draftProspect(pickId: number, prospectId: number): Promise<DraftProspect> {
    try {
      const response = await apiClient.post('/draft/draft', {
        pickId,
        prospectId
      });
      return response.data;
    } catch (error) {
      console.error('Error drafting prospect:', error);
      throw error;
    }
  }

  async createProspect(prospect: DraftProspect): Promise<DraftProspect> {
    try {
      const response = await apiClient.post('/draft/prospects', prospect);
      return response.data;
    } catch (error) {
      console.error('Error creating prospect:', error);
      throw error;
    }
  }

  async updateProspect(prospect: DraftProspect): Promise<DraftProspect> {
    try {
      const response = await apiClient.put(`/draft/prospects/${prospect.id}`, prospect);
      return response.data;
    } catch (error) {
      console.error(`Error updating prospect:`, error);
      throw error;
    }
  }

  async deleteProspect(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/draft/prospects/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting prospect with id ${id}:`, error);
      throw error;
    }
  }
}

// Singleton implementation
let draftProspectRepository: DraftProspectRepository | null = null;

export function useDraftProspectRepository(): IDraftProspectRepository {
  if (!draftProspectRepository) {
    draftProspectRepository = new DraftProspectRepository();
  }
  
  return draftProspectRepository;
}