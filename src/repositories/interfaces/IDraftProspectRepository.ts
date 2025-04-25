// src/domain/repositories/interfaces/IDraftPickRepository.ts

import type { DraftProspect } from '@/domain/models/DraftProspect'

/**
 * Draft pick repository interface
 */

export interface IDraftProspectRepository {
  // Get all available prospects (not drafted yet)
  getAllProspects(): Promise<DraftProspect[]>
  getProspectsByTeamNeeds(teamId: number): Promise<DraftProspect[]>
  // Get a specific prospect by ID
  getProspectById(id: number): Promise<DraftProspect | null>

  // Get prospects that match a team's needs
  getProspectsByTeamNeeds(teamId: number): Promise<DraftProspect[]>

  // Get drafted prospects
  getDraftedProspects(): Promise<DraftProspect[]>

  // Get prospects drafted by a specific team in a given year
  getTeamDraftedProspects(teamId: number, year: number): Promise<DraftProspect[]>

  // Draft a prospect with a specific pick
  draftProspect(pickId: number, prospectId: number): Promise<DraftProspect>

  // Add a new prospect
  createProspect(prospect: DraftProspect): Promise<DraftProspect>

  // Update a prospect
  updateProspect(prospect: DraftProspect): Promise<DraftProspect>

  // Delete a prospect
  deleteProspect(id: number): Promise<boolean>
}
