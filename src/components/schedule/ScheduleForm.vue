<!-- src/components/schedule/ScheduleForm.vue -->
<template>
  <form class="schedule-form" @submit.prevent="submitForm">
    <h2 class="form-title">{{ formTitle }}</h2>
    
    
    <!-- Season Year -->
    <BaseSelect
      v-model="schedule.seasonYear"
      :options="seasonYearOptions"
      label="Season Year"
      required
    />
    
    <!-- Team selection -->
    <BaseSelect
      :modelValue="teamIdString"
      :options="teamOptions"
      label="Team"
      required
      @update:modelValue="handleTeamIdChange"
    />
    
    <!-- Opposing Team selection -->
    <BaseSelect
      :modelValue="oppTeamIdString"
      :options="opposingTeamOptions"
      label="Opposing Team"
      :disabled="!schedule.teamId"
      required
      @update:modelValue="handleOppTeamIdChange"
    />
    <!-- Home or Away selection (comes 3rd) -->
    <BaseSelect
      v-model="schedule.homeOrAway"
      :options="homeAwayOptions"
      label="Home or Away"
      required
      @update:modelValue="handleHomeAwayChange"
    />
    
    <!-- Schedule Week  selection -->

    <BaseSelect
      v-model="schedule.scheduleWeek"
      :options="scheduleWeekOptions"
      label="Schedule Week"
      required      
    />
    
    <!-- Game Date -->
    <BaseInput
      v-model="gameDateString"
      type="date"
      label="Game Date"
      @update:modelValue="updateGameDate"
    />
    
    <!-- Location/Stadium -->
    <BaseInput
      v-model="schedule.gameLocation"
      label="Location/Stadium"
      :disabled="autoFilledFields.includes('gameLocation')"
    />
    
    <!-- City -->
    <BaseInput
      v-model="schedule.gameCity"
      label="City"
      :disabled="autoFilledFields.includes('gameCity')"
    />
    
    <!-- State/Province -->
    <BaseInput
      v-model="schedule.gameStateProvince"
      label="State/Province"
      :disabled="autoFilledFields.includes('gameStateProvince')"
    />
    
    <!-- Country -->
    <BaseInput
      v-model="schedule.gameCountry"
      label="Country"
      :disabled="autoFilledFields.includes('gameCountry')"
    />
    
    <!-- Opposing Team Conference -->
    <BaseInput
      v-model="schedule.oppTeamConference"
      label="Opp. Team Conference"
      :disabled="autoFilledFields.includes('oppTeamConference')"
    />
    
    <!-- Opposing Team Division -->
    <BaseInput
      v-model="schedule.oppTeamDivision"
      label="Opp. Team Division"
      :disabled="autoFilledFields.includes('oppTeamDivision')"
    />
    
    <!-- Game Results Section (only shown for edit mode) -->
    <div v-if="isEditMode" class="game-results-section">
      <h3>Game Results</h3>
      
      <!-- Won/Lost Flag -->
      <BaseSelect
        v-model="schedule.wonLostFlag"
        :options="wonLostOptions"
        label="Game Outcome"
      />
      
      <!-- Team Score -->
      <BaseInput
        v-model="schedule.teamScore"
        type="number"
        label="Team Score"
        min="0"
      />
      
      <!-- Opposing Team Score -->
      <BaseInput
        v-model="schedule.oppTeamScore"
        type="number"
        label="Opposing Team Score"
        min="0"
      />
      
      <!-- Result (automatically calculated) -->
      <BaseInput
        v-model="schedule.result"
        label="Result"
        disabled
      />
    </div>
    
    <div class="form-actions">
      <button type="submit" class="btn-primary">
        {{ isEditMode ? 'Update' : 'Create' }} Schedule
      </button>
      <button type="button" class="btn-secondary" @click="cancel">
        Cancel
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import BaseInput from '../common/BaseInput.vue';
import BaseSelect from '../common/BaseSelect.vue';
import { TeamService } from '@/domain/services/TeamService';
import { ScheduleService } from '@/domain/services/ScheduleService';
import { Team } from '@/domain/models/Team';
import { Schedule } from '@/domain/models/Schedule';

interface SelectOption {
  value: string | number;
  label: string;
}

export default defineComponent({
  name: 'ScheduleForm',
  components: {
    BaseInput,
    BaseSelect
  },
  props: {
    scheduleId: {
      type: Number,
      default: null
    }
  },
  setup(props, { emit }) {
    // Services
    const teamService = new TeamService();
    const scheduleService = new ScheduleService();
    
    // State
    const teams = ref<Team[]>([]);
    const schedule = ref<Schedule>({
      id: undefined,
      teamId: undefined,
      seasonYear: new Date().getFullYear().toString(),
      oppTeamId: 0,
      oppTeamConference: '',
      oppTeamDivision: '',
      scheduleWeek: undefined,
      gameDate: undefined,
      gameCity: '',
      gameStateProvince: '',
      gameCountry: '',
      gameLocation: '',
      wonLostFlag: '',
      homeOrAway: '',
      oppTeamScore: undefined,
      teamScore: 0,
      result: ''
    });
    
    // Handle ID string values for select components
    const teamIdString = ref<string>('');
    const oppTeamIdString = ref<string>('');
    
    // Handle date separately for the form
    const gameDateString = ref<string>('');
    
    // Track which fields are automatically filled
    const autoFilledFields = ref<string[]>([]);
    
    // Computed properties
    const isEditMode = computed(() => !!props.scheduleId);
    
    const formTitle = computed(() => {
      return isEditMode.value ? 'Edit Game Schedule' : 'Add New Game Schedule';
    });
    
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const teamOptions = computed(() => {
      return teams.value.map(team => ({
        value: team.id ? team.id.toString() : '',
          label: team.name || ''
      }));
    });
    
    const opposingTeamOptions = computed(() => {
      if (!schedule.value.teamId) return [];
      
      return teams.value
        .filter(team => team.id !== Number(schedule.value.teamId))
        .map(team => ({
          value: team.id ? team.id.toString() : '',
          label: team.name || ''
        }));
    });
    
    const homeAwayOptions = computed(() => [
      { value: 'H', label: 'Home' },
      { value: 'A', label: 'Away' }
    ]);

    const scheduleWeekOptions = computed(() => [
      { value: '1', label: '01' },
      { value: '2', label: '02' },
      { value: '3', label: '03' },
      { value: '4', label: '04' },
      { value: '5', label: '05' },
      { value: '6', label: '06' },
      { value: '7', label: '07' },
      { value: '8', label: '08' },
      { value: '9', label: '09' },
      { value: '10', label: '10' },
      { value: '11', label: '11' },
      { value: '12', label: '12' },
      { value: '13', label: '13' },
      { value: '14', label: '14' },
      { value: '15', label: '15' },
      { value: '16', label: '16' },
      { value: '17', label: '17' },
      { value: '18', label: '18' }
    ]);
    
    const seasonYearOptions = computed(() => {
      const currentYear = new Date().getFullYear();
      const years: SelectOption[] = [];
      
      for (let i = currentYear - 5; i <= currentYear + 1; i++) {
        years.push({
          value: i.toString(),
          label: i.toString()
        });
      }
      
      return years;
    });
    
    const wonLostOptions = computed(() => [
      { value: 'W', label: 'Won' },
      { value: 'L', label: 'Lost' },
      { value: 'T', label: 'Tie' }
    ]);
    
    // Methods
    const updateGameDate = (dateStr: string) => {
      if (dateStr) {
        schedule.value.gameDate = new Date(dateStr);
      } else {
        schedule.value.gameDate = undefined;
      }
    };
    
    const loadTeams = async () => {
      try {
        teams.value = await teamService.getAll();
      } catch (error) {
        console.error('Failed to load teams:', error);
      }
    };
    
    const loadSchedule = async () => {
      if (!props.scheduleId) return;
      
      try {
        const loadedSchedule = await scheduleService.getById(props.scheduleId);
        
        // Format date if it exists
        if (loadedSchedule.gameDate) {
          const date = new Date(loadedSchedule.gameDate);
          gameDateString.value = formatDate(date);
          loadedSchedule.gameDate = date;
        }
        
        // Convert numeric IDs to numbers if they're strings
        if (typeof loadedSchedule.teamId === 'string') {
          loadedSchedule.teamId = Number(loadedSchedule.teamId);
        }
        
        if (typeof loadedSchedule.oppTeamId === 'string') {
          loadedSchedule.oppTeamId = Number(loadedSchedule.oppTeamId);
        }
        
        // Copy properties to local schedule ref
        Object.assign(schedule.value, loadedSchedule);
        
        // Update string values for select components
        teamIdString.value = loadedSchedule.teamId?.toString() || '';
        oppTeamIdString.value = loadedSchedule.oppTeamId?.toString() || '';
      } catch (error) {
        console.error('Failed to load schedule:', error);
      }
    };
    
    const getTeamById = (id: number | undefined): Team | undefined => {
      if (!id) return undefined;
      return teams.value.find(team => team.id === id);
    };
    
    const updateLocationInfo = () => {
      alert("entering updateLocationInfo");
      if (!schedule.value.homeOrAway || !schedule.value.teamId || !schedule.value.oppTeamId) {
        return;
      }
      
      const isHome = schedule.value.homeOrAway === 'H';
      const teamIdToUse = isHome ? schedule.value.teamId : schedule.value.oppTeamId;
      const team = getTeamById(Number(teamIdToUse));
      
      if (team) {
        // Update location fields
        schedule.value.gameLocation = team.stadium || '';
        schedule.value.gameCity = team.city || '';
        schedule.value.gameStateProvince = team.state || '';
        schedule.value.gameCountry = team.country || '';
        
        // Mark fields as auto-filled
        autoFilledFields.value = ['gameLocation', 'gameCity', 'gameStateProvince', 'gameCountry'];
        alert("Leaving updateLocationInfo - fields auto-filled");
      }
    };
    
    const updateOpposingTeamInfo = () => {
      const opposingTeam = getTeamById(Number(schedule.value.oppTeamId));
      
      if (opposingTeam) {
        // Set opposing team conference
        schedule.value.oppTeamConference = opposingTeam.conference || '';
        
        // Set opposing team division (only last word of division value)
        if (opposingTeam.division) {
          const divisionParts = opposingTeam.division.split(' ');
          const shortDivision = divisionParts[divisionParts.length - 1];
          schedule.value.oppTeamDivision = shortDivision;
        } else {
          schedule.value.oppTeamDivision = '';
        }
        
        // Mark fields as auto-filled
        autoFilledFields.value = [...autoFilledFields.value, 'oppTeamConference', 'oppTeamDivision'];
      }
    };
    
    const handleHomeAwayChange = () => {
      updateLocationInfo();
    };
    
    const handleTeamIdChange = (value: string) => {
      // Convert string value to number and update schedule
      schedule.value.teamId = value ? Number(value) : undefined;
      teamIdString.value = value;
      
      // Reset opposing team when team changes
      schedule.value.oppTeamId = 0;
      oppTeamIdString.value = '';
      
      // Update location if home/away is already set
      if (schedule.value.homeOrAway) {
        updateLocationInfo();
      }
    };
    
    const handleOppTeamIdChange = (value: string) => {
      // Convert string value to number and update schedule
      schedule.value.oppTeamId = value ? Number(value) : 0;
      oppTeamIdString.value = value;
      
      updateOpposingTeamInfo();
      
      // Update location if home/away is set to away
      if (schedule.value.homeOrAway === 'A') {
        updateLocationInfo();
      }
    };
    
    const submitForm = async () => {
      try {
        // Prepare data for submission
        const scheduleData: Schedule = { ...schedule.value };
        
        // Ensure teamScore has a default value if undefined
        if (scheduleData.teamScore === undefined) {
          scheduleData.teamScore = 0;
        }
        
        // Calculate result string if in edit mode with scores
        if (isEditMode.value && scheduleData.teamScore !== undefined && scheduleData.oppTeamScore !== undefined) {
          if (scheduleData.teamScore > scheduleData.oppTeamScore) {
            scheduleData.result = 'W';
            scheduleData.wonLostFlag = 'W';
          } else if (scheduleData.teamScore < scheduleData.oppTeamScore) {
            scheduleData.result = 'L';
            scheduleData.wonLostFlag = 'L';
          } else {
            scheduleData.result = 'T';
            scheduleData.wonLostFlag = 'T';
          }
        }
        
        // Save the schedule
        if (isEditMode.value && props.scheduleId) {
          await scheduleService.update(props.scheduleId, scheduleData);
          emit('update', scheduleData);
        } else {
          const newSchedule = await scheduleService.create(scheduleData);
          emit('create', newSchedule);
        }
        
        emit('close');
      } catch (error) {
        console.error('Failed to save schedule:', error);
      }
    };
    
    const cancel = () => {
      emit('close');
    };
    
    // Watch for changes to team scores to update result
    watch(
      [() => schedule.value.teamScore, () => schedule.value.oppTeamScore],
      ([teamScore, oppTeamScore]) => {
        if (teamScore === undefined || oppTeamScore === undefined) return;
        
        if (teamScore > oppTeamScore) {
          schedule.value.result = 'Win';
          schedule.value.wonLostFlag = 'W';
        } else if (teamScore < oppTeamScore) {
          schedule.value.result = 'Loss';
          schedule.value.wonLostFlag = 'L';
        } else {
          schedule.value.result = 'Tie';
          schedule.value.wonLostFlag = 'T';
        }
      }
    );
    
    // Initialize component
    onMounted(async () => {
      await loadTeams();
      if (props.scheduleId) {
        await loadSchedule();
      }
    });
    
    return {
      schedule,
      gameDateString,
      teamIdString,
      oppTeamIdString,
      autoFilledFields,
      isEditMode,
      formTitle,
      teamOptions,
      opposingTeamOptions,
      homeAwayOptions,
      seasonYearOptions,
      scheduleWeekOptions,
      wonLostOptions,
      updateGameDate,
      handleHomeAwayChange,
      handleTeamIdChange,
      handleOppTeamIdChange,
      submitForm,
      cancel
    };
  }
});
</script>

<style scoped>
.schedule-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  font-size: 1.5rem;
  text-align: center;
}

.game-results-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(233, 196, 106, 0.3);
}

.game-results-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-size: 1.25rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--white);
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: var(--light-gray);
  color: var(--dark-text);
}

.btn-secondary:hover {
  background-color: var(--gray);
}

/* Dark theme adjustments */
@media (prefers-color-scheme: dark) {
  .schedule-form {
    background-color: var(--dark-bg);
  }
  
  .btn-secondary {
    background-color: var(--dark-gray);
    color: var(--light-color);
  }
  
  .btn-secondary:hover {
    background-color: var(--medium-gray);
  }
}
</style>