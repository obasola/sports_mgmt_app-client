// src/infrastructure/store/schedule.store.ts
import { defineStore } from 'pinia';
import type { Schedule } from '@/domain/models/Schedule';
import { ScheduleService } from '@/domain/services/ScheduleService';
import { ScheduleRepository } from '@/domain/repositories/ScheduleRepository';

const scheduleRepository = new ScheduleRepository();
const scheduleService = new ScheduleService(scheduleRepository);

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedules: [] as Schedule[],
    currentSchedule: null as Schedule | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getScheduleById: (state) => (id: number) => {
      return state.schedules.find(schedule => schedule.id === id);
    },
    getSchedulesByTeamId: (state) => (teamId: number) => {
      return state.schedules.filter(schedule => schedule.teamID === teamId);
    },
    getSchedulesByWeek: (state) => (week: number) => {
      return state.schedules.filter(schedule => schedule.scheduleWeek === week);
    },
    getHomeGames: (state) => {
      return state.schedules.filter(schedule => schedule.homeOrAway === 'home');
    },
    getAwayGames: (state) => {
      return state.schedules.filter(schedule => schedule.homeOrAway === 'away');
    },
    getWonGames: (state) => {
      return state.schedules.filter(schedule => schedule.wonLostFlag === 'W');
    },
    getLostGames: (state) => {
      return state.schedules.filter(schedule => schedule.wonLostFlag === 'L');
    }
  },

  actions: {
    async fetchSchedules() {
      this.isLoading = true;
      this.error = null;

      try {
        this.schedules = await scheduleService.getAllSchedules();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch schedules';
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchScheduleById(id: number) {
      this.isLoading = true;
      this.error = null;

      try {
        this.currentSchedule = await scheduleService.getScheduleById(id);
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to fetch schedule with id ${id}`;
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSchedulesByTeamId(teamId: number) {
      this.isLoading = true;
      this.error = null;

      try {
        this.schedules = await scheduleService.getSchedulesByTeamId(teamId);
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to fetch schedules for team ${teamId}`;
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSchedulesByWeek(week: number) {
      this.isLoading = true;
      this.error = null;

      try {
        this.schedules = await scheduleService.getSchedulesByWeek(week);
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to fetch schedules for week ${week}`;
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSchedulesByDateRange(startDate: Date, endDate: Date) {
      this.isLoading = true;
      this.error = null;

      try {
        this.schedules = await scheduleService.getSchedulesByDateRange(startDate, endDate);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch schedules by date range';
        console.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async createSchedule(schedule: Schedule) {
      this.isLoading = true;
      this.error = null;

      try {
        const newSchedule = await scheduleService.createSchedule(schedule);
        this.schedules.push(newSchedule);
        return newSchedule;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create schedule';
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateSchedule(id: number, schedule: Schedule) {
      this.isLoading = true;
      this.error = null;

      try {
        const updatedSchedule = await scheduleService.updateSchedule(id, schedule);
        const index = this.schedules.findIndex(sched => sched.id === id);

        if (index !== -1) {
          this.schedules[index] = updatedSchedule;
        }

        if (this.currentSchedule?.id === id) {
          this.currentSchedule = updatedSchedule;
        }

        return updatedSchedule;
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to update schedule with id ${id}`;
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteSchedule(id: number) {
      this.isLoading = true;
      this.error = null;

      try {
        const success = await scheduleService.deleteSchedule(id);

        if (success) {
          this.schedules = this.schedules.filter(schedule => schedule.id !== id);

          if (this.currentSchedule?.id === id) {
            this.currentSchedule = null;
          }
        }

        return success;
      } catch (error) {
        this.error = error instanceof Error ? error.message : `Failed to delete schedule with id ${id}`;
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
