
// src/infrastructure/store/modules/schedule.ts
import { defineStore } from 'pinia';
import type { Schedule } from '@/domain/models/Schedule';
import { ScheduleService } from '@/domain/services/ScheduleService';
import { DuplicateEntityError } from '@/domain/services/errors/DuplicateEntityError';

const scheduleService = new ScheduleService();

interface ScheduleState {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  isLoading: boolean;
  error: string | null;
  duplicateId: number | null;
}

export const useScheduleStore = defineStore('schedule', {
  state: (): ScheduleState => ({
    schedules: [],
    currentSchedule: null,
    isLoading: false,
    error: null,
    duplicateId: null
  }),
  
  getters: {
    getScheduleById: (state) => (id: number) => {
      return state.schedules.find(schedule => schedule.id === id);
    },
    getSchedulesByTeamId: (state) => (teamId: number) => {
      return state.schedules.filter(schedule => 
        schedule.teamId === teamId || schedule.oppTeamId === teamId
      );
    },
    getSchedulesByYear: (state) => (year: number) => {
      return state.schedules.filter(schedule => Number(schedule.seasonYear) === year);
    }
  },
  
  actions: {
    // Reset error state
    resetErrorState() {
      this.error = null;
      this.duplicateId = null;
    },
    
    // Fetch all schedules
    async fetchSchedules() {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.schedules = await scheduleService.getAll();
      } catch (error) {
        this.error = (error as Error).message;
        console.error('Error fetching schedules:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch schedules by team ID
    async fetchSchedulesByTeamId(teamId: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.schedules = await scheduleService.getByteamId(teamId);
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error fetching schedules for team ${teamId}:`, error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch schedules by season year
    async fetchSchedulesByYear(year: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.schedules = await scheduleService.getBySeasonYear(year);
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error fetching schedules for year ${year}:`, error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch a specific schedule by ID
    async fetchScheduleById(id: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        this.currentSchedule = await scheduleService.getById(id);
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error fetching schedule ${id}:`, error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Create a new schedule
    async createSchedule(schedule: Schedule) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const newSchedule = await scheduleService.create(schedule);
        this.schedules.push(newSchedule);
        return newSchedule;
      } catch (error) {
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message;
          this.duplicateId = error.existingId;
        } else {
          this.error = (error as Error).message;
        }
        console.error('Error creating schedule:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Create or update a schedule (handles duplicates)
    async createOrUpdateSchedule(schedule: Schedule) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const result = await scheduleService.createOrUpdate(schedule);
        
        // Check if this is a new schedule or an update to an existing one
        const existingIndex = this.schedules.findIndex(s => s.id === result.id);
        
        if (existingIndex !== -1) {
          // Update existing schedule in store
          this.schedules[existingIndex] = result;
        } else {
          // Add new schedule to store
          this.schedules.push(result);
        }
        
        return result;
      } catch (error) {
        this.error = (error as Error).message;
        console.error('Error creating/updating schedule:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Update an existing schedule
    async updateSchedule(id: number, schedule: Schedule) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        const updatedSchedule = await scheduleService.update(id, schedule);
        
        // Update the schedule in the store
        const index = this.schedules.findIndex(s => s.id === id);
        if (index !== -1) {
          this.schedules[index] = updatedSchedule;
        }
        
        // If this is the current schedule, update it as well
        if (this.currentSchedule?.id === id) {
          this.currentSchedule = updatedSchedule;
        }
        
        return updatedSchedule;
      } catch (error) {
        if (error instanceof DuplicateEntityError && error.existingId) {
          this.error = error.message;
          this.duplicateId = error.existingId;
        } else {
          this.error = (error as Error).message;
        }
        console.error(`Error updating schedule ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Delete a schedule
    async deleteSchedule(id: number) {
      this.isLoading = true;
      this.resetErrorState();
      
      try {
        await scheduleService.delete(id);
        
        // Remove the schedule from the store
        this.schedules = this.schedules.filter(schedule => schedule.id !== id);
        
        // If this is the current schedule, clear it
        if (this.currentSchedule?.id === id) {
          this.currentSchedule = null;
        }
      } catch (error) {
        this.error = (error as Error).message;
        console.error(`Error deleting schedule ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
