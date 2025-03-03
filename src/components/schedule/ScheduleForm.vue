<!-- src/components/schedule/ScheduleForm.vue -->
<template>
  <div class="schedule-form">
    <form @submit.prevent="submitForm">
      <div class="p-fluid">
        <div class="formgrid grid">
          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <Dropdown
                id="teamID"
                v-model="schedule.teamID"
                :options="teams"
                optionLabel="name"
                optionValue="id"
                :filter="true"
                :class="{ 'p-invalid': v$.teamID.$invalid && v$.teamID.$dirty }"
                required
              />
              <label for="teamID">Main Team*</label>
            </span>
            <small class="p-error" v-if="v$.teamID.$invalid && v$.teamID.$dirty">
              {{ v$.teamID.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <Dropdown
                id="homeTeamId"
                v-model="schedule.homeTeamId"
                :options="teams"
                optionLabel="name"
                optionValue="id"
                :filter="true"
                :class="{ 'p-invalid': v$.homeTeamId.$invalid && v$.homeTeamId.$dirty }"
                required
              />
              <label for="homeTeamId">Home Team*</label>
            </span>
            <small class="p-error" v-if="v$.homeTeamId.$invalid && v$.homeTeamId.$dirty">
              {{ v$.homeTeamId.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <Dropdown
                id="awayTeamId"
                v-model="schedule.awayTeamId"
                :options="teams"
                optionLabel="name"
                optionValue="id"
                :filter="true"
                :class="{ 'p-invalid': v$.awayTeamId.$invalid && v$.awayTeamId.$dirty }"
                required
              />
              <label for="awayTeamId">Away Team*</label>
            </span>
            <small class="p-error" v-if="v$.awayTeamId.$invalid && v$.awayTeamId.$dirty">
              {{ v$.awayTeamId.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <InputNumber
                id="scheduleWeek"
                v-model="schedule.scheduleWeek"
                :min="1"
                :max="52"
                :class="{ 'p-invalid': v$.scheduleWeek.$invalid && v$.scheduleWeek.$dirty }"
                required
              />
              <label for="scheduleWeek">Schedule Week*</label>
            </span>
            <small class="p-error" v-if="v$.scheduleWeek.$invalid && v$.scheduleWeek.$dirty">
              {{ v$.scheduleWeek.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <Calendar
                id="gameDate"
                v-model="schedule.gameDate"
                dateFormat="yy-mm-dd"
                :showIcon="true"
                :class="{ 'p-invalid': v$.gameDate.$invalid && v$.gameDate.$dirty }"
                required
              />
              <label for="gameDate">Game Date*</label>
            </span>
            <small class="p-error" v-if="v$.gameDate.$invalid && v$.gameDate.$dirty">
              {{ v$.gameDate.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <Dropdown
                id="homeOrAway"
                v-model="schedule.homeOrAway"
                :options="homeAwayOptions"
                :class="{ 'p-invalid': v$.homeOrAway.$invalid && v$.homeOrAway.$dirty }"
                required
                @change="updateTeamsBasedOnHomeAway"
              />
              <label for="homeOrAway">Home/Away*</label>
            </span>
            <small class="p-error" v-if="v$.homeOrAway.$invalid && v$.homeOrAway.$dirty">
              {{ v$.homeOrAway.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <InputText
                id="gameCity"
                v-model.trim="schedule.gameCity"
                :class="{ 'p-invalid': v$.gameCity.$invalid && v$.gameCity.$dirty }"
                required
              />
              <label for="gameCity">Game City*</label>
            </span>
            <small class="p-error" v-if="v$.gameCity.$invalid && v$.gameCity.$dirty">
              {{ v$.gameCity.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <InputText
                id="gameStateProvince"
                v-model.trim="schedule.gameStateProvince"
                :class="{ 'p-invalid': v$.gameStateProvince.$invalid && v$.gameStateProvince.$dirty }"
                required
              />
              <label for="gameStateProvince">State/Province*</label>
            </span>
            <small class="p-error" v-if="v$.gameStateProvince.$invalid && v$.gameStateProvince.$dirty">
              {{ v$.gameStateProvince.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <InputText
                id="gameCountry"
                v-model.trim="schedule.gameCountry"
                :class="{ 'p-invalid': v$.gameCountry.$invalid && v$.gameCountry.$dirty }"
                required
              />
              <label for="gameCountry">Country*</label>
            </span>
            <small class="p-error" v-if="v$.gameCountry.$invalid && v$.gameCountry.$dirty">
              {{ v$.gameCountry.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col-12">
            <span class="p-float-label">
              <InputText
                id="gameLocation"
                v-model.trim="schedule.gameLocation"
                :class="{ 'p-invalid': v$.gameLocation.$invalid && v$.gameLocation.$dirty }"
                required
              />
              <label for="gameLocation">Game Location*</label>
            </span>
            <small class="p-error" v-if="v$.gameLocation.$invalid && v$.gameLocation.$dirty">
              {{ v$.gameLocation.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputText
                id="awayTeamConference"
                v-model.trim="schedule.awayTeamConference"
                :class="{ 'p-invalid': v$.awayTeamConference.$invalid && v$.awayTeamConference.$dirty }"
                required
              />
              <label for="awayTeamConference">Away Team Conference*</label>
            </span>
            <small class="p-error" v-if="v$.awayTeamConference.$invalid && v$.awayTeamConference.$dirty">
              {{ v$.awayTeamConference.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputText
                id="awayTeamDivision"
                v-model.trim="schedule.awayTeamDivision"
                :class="{ 'p-invalid': v$.awayTeamDivision.$invalid && v$.awayTeamDivision.$dirty }"
                required
              />
              <label for="awayTeamDivision">Away Team Division*</label>
            </span>
            <small class="p-error" v-if="v$.awayTeamDivision.$invalid && v$.awayTeamDivision.$dirty">
              {{ v$.awayTeamDivision.$errors[0].$message }}
            </small>
          </div>
        </div>

        <h3 class="mt-4 mb-3">Game Results</h3>

        <div class="formgrid grid">
          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <Dropdown
                id="wonLostFlag"
                v-model="schedule.wonLostFlag"
                :options="wonLostOptions"
                :class="{ 'p-invalid': v$.wonLostFlag.$invalid && v$.wonLostFlag.$dirty }"
                required
              />
              <label for="wonLostFlag">Won/Lost*</label>
            </span>
            <small class="p-error" v-if="v$.wonLostFlag.$invalid && v$.wonLostFlag.$dirty">
              {{ v$.wonLostFlag.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <InputNumber
                id="homeScore"
                v-model="schedule.homeScore"
                :min="0"
                :class="{ 'p-invalid': v$.homeScore.$invalid && v$.homeScore.$dirty }"
                required
              />
              <label for="homeScore">Home Score*</label>
            </span>
            <small class="p-error" v-if="v$.homeScore.$invalid && v$.homeScore.$dirty">
              {{ v$.homeScore.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <InputNumber
                id="awayTeamScore"
                v-model="schedule.awayTeamScore"
                :min="0"
                :class="{ 'p-invalid': v$.awayTeamScore.$invalid && v$.awayTeamScore.$dirty }"
                required
              />
              <label for="awayTeamScore">Away Team Score*</label>
            </span>
            <small class="p-error" v-if="v$.awayTeamScore.$invalid && v$.awayTeamScore.$dirty">
              {{ v$.awayTeamScore.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="formgrid grid mt-4">
          <div class="field col-12">
            <Button
              type="submit"
              :label="isEditMode ? 'Update Schedule' : 'Create Schedule'"
              class="p-button-primary mr-2"
              :loading="submitting"
            />
            <Button
              type="button"
              label="Cancel"
              class="p-button-secondary"
              @click="cancelForm"
              :disabled="submitting"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, minLength } from '@vuelidate/validators';
import { useScheduleStore } from '../../infrastructure/store/schedule.store';
import { useTeamStore } from '../../infrastructure/store/team.store';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import type { Schedule } from '../../domain/models/Schedule';

// Props
const props = defineProps({
  scheduleId: {
    type: [Number, String],
    default: null
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
});

// Emit events
const emit = defineEmits(['saved', 'cancelled']);

// Store and router
const scheduleStore = useScheduleStore();
const teamStore = useTeamStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const submitting = ref(false);
const homeAwayOptions = ['home', 'away'];
const wonLostOptions = ['W', 'L'];

const schedule = reactive<Schedule>({
  teamID: Number(route.query.teamId) || 0,
  homeTeamId: 0,
  awayTeamId: 0,
  scheduleWeek: 1,
  gameDate: new Date(),
  gameCity: '',
  gameStateProvince: '',
  gameCountry: 'USA',
  gameLocation: '',
  awayTeamConference: '',
  awayTeamDivision: '',
  wonLostFlag: 'W',
  homeOrAway: 'home',
  awayTeamScore: 0,
  homeScore: 0
});

// Computed
const teams = computed(() => teamStore.teams);

// Set home/away teams based on which team is selected
watch(() => schedule.teamID, (newTeamId) => {
  if (newTeamId && !props.isEditMode) {
    updateTeamsBasedOnHomeAway();
  }
}, { immediate: true });

// Validation rules
const rules = {
  teamID: { required, minValue: minValue(1) },
  homeTeamId: { required, minValue: minValue(1) },
  awayTeamId: { required, minValue: minValue(1) },
  scheduleWeek: { required, minValue: minValue(1) },
  gameDate: { required },
  gameCity: { required, minLength: minLength(2) },
  gameStateProvince: { required, minLength: minLength(2) },
  gameCountry: { required, minLength: minLength(2) },
  gameLocation: { required, minLength: minLength(2) },
  awayTeamConference: { required, minLength: minLength(2) },
  awayTeamDivision: { required, minLength: minLength(2) },
  wonLostFlag: { required },
  homeOrAway: { required },
  awayTeamScore: { required, minValue: minValue(0) },
  homeScore: { required, minValue: minValue(0) }
};

const v$ = useVuelidate(rules, schedule);

// Methods
const updateTeamsBasedOnHomeAway = () => {
  if (!schedule.teamID) return;

  if (schedule.homeOrAway === 'home') {
    schedule.homeTeamId = schedule.teamID;
    schedule.awayTeamId = schedule.awayTeamId === schedule.teamID ? 0 : schedule.awayTeamId;
  } else {
    schedule.awayTeamId = schedule.teamID;
    schedule.homeTeamId = schedule.homeTeamId === schedule.teamID ? 0 : schedule.homeTeamId;
  }

  // Update conference and division if we have team data
  if (schedule.awayTeamId) {
    const awayTeam = teams.value.find(t => t.id === schedule.awayTeamId);
    if (awayTeam) {
      schedule.awayTeamConference = awayTeam.conference;
      schedule.awayTeamDivision = awayTeam.division;
    }
  }

  // If home team is set, update game location
  if (schedule.homeTeamId) {
    const homeTeam = teams.value.find(t => t.id === schedule.homeTeamId);
    if (homeTeam) {
      schedule.gameCity = homeTeam.city;
      schedule.gameStateProvince = homeTeam.state;
      schedule.gameLocation = homeTeam.stadium;
    }
  }
};

const loadTeams = async () => {
  if (teams.value.length === 0) {
    try {
      await teamStore.fetchTeams();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load teams', life: 3000 });
    }
  }
};

const loadSchedule = async (id: number) => {
  try {
    await scheduleStore.fetchScheduleById(id);
    const loadedSchedule = scheduleStore.currentSchedule;

    if (loadedSchedule) {
      // Convert date string to Date object
      const gameDate = loadedSchedule.gameDate instanceof Date
        ? loadedSchedule.gameDate
        : new Date(loadedSchedule.gameDate);

      // Copy schedule data to our reactive object
      Object.assign(schedule, { ...loadedSchedule, gameDate });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Schedule not found', life: 3000 });
      router.push({ name: 'Schedules' });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load schedule', life: 3000 });
    router.push({ name: 'Schedules' });
  }
};

const submitForm = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Please correct the form errors', life: 3000 });
    return;
  }

  submitting.value = true;

  try {
    if (props.isEditMode && props.scheduleId) {
      await scheduleStore.updateSchedule(Number(props.scheduleId), schedule);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Schedule updated successfully', life: 3000 });
    } else {
      await scheduleStore.createSchedule(schedule);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Schedule created successfully', life: 3000 });
    }

    emit('saved');

    // If this was created from team detail, go back to that team
    if (route.query.teamId && !props.isEditMode) {
      router.push({ name: 'TeamDetail', params: { id: route.query.teamId } });
    } else {
      router.push({ name: 'Schedules' });
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: props.isEditMode ? 'Failed to update schedule' : 'Failed to create schedule',
      life: 3000
    });
  } finally {
    submitting.value = false;
  }
};

const cancelForm = () => {
  emit('cancelled');

  // If this was created from team detail, go back to that team
  if (route.query.teamId && !props.isEditMode) {
    router.push({ name: 'TeamDetail', params: { id: route.query.teamId } });
  } else {
    router.push({ name: 'Schedules' });
  }
};

// Lifecycle hooks
onMounted(async () => {
  await loadTeams();

  if (props.isEditMode && props.scheduleId) {
    await loadSchedule(Number(props.scheduleId));
  } else if (schedule.teamID && teams.value.length > 0) {
    updateTeamsBasedOnHomeAway();
  }
});
</script>

<style scoped>
.schedule-form {
  max-width: 1000px;
  margin: 0 auto;
}

h3 {
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 0.5rem;
}
</style>
