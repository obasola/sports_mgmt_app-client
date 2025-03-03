<!-- src/components/schedule/ScheduleDetail.vue -->
<template>
  <div class="schedule-details">
    <Card v-if="schedule">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <h2>Game Details - Week {{ schedule.scheduleWeek }}</h2>
          <div>
            <Button
              icon="pi pi-pencil"
              label="Edit"
              class="p-button-primary mr-2"
              @click="editSchedule"
            />
            <Button
              icon="pi pi-trash"
              label="Delete"
              class="p-button-danger"
              @click="confirmDelete"
            />
          </div>
        </div>
      </template>

      <template #content>
        <div class="grid">
          <div class="col-12 md:col-6">
            <div class="schedule-info">
              <h3>Game Information</h3>
              <div class="p-2">
                <p><strong>Team ID:</strong> {{ schedule.teamID }}</p>
                <p><strong>Game Date:</strong> {{ formatDate(schedule.gameDate) }}</p>
                <p><strong>Location:</strong> {{ schedule.gameLocation }}</p>
                <p><strong>City:</strong> {{ schedule.gameCity }}, {{ schedule.gameStateProvince }}, {{ schedule.gameCountry }}</p>
                <p><strong>Home/Away:</strong> {{ schedule.homeOrAway === 'home' ? 'Home Game' : 'Away Game' }}</p>
              </div>
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="teams-info">
              <h3>Teams</h3>
              <div class="p-2">
                <p><strong>Home Team:</strong> {{ getTeamName(schedule.homeTeamId) }}</p>
                <p><strong>Away Team:</strong> {{ getTeamName(schedule.awayTeamId) }}</p>
                <p><strong>Away Team Conference:</strong> {{ schedule.awayTeamConference }}</p>
                <p><strong>Away Team Division:</strong> {{ schedule.awayTeamDivision }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="game-result mt-4">
          <h3>Game Result</h3>
          <div class="p-2">
            <div class="flex justify-content-center align-items-center">
              <div class="text-center">
                <p class="team-label">{{ getTeamName(schedule.homeTeamId) }}</p>
                <p class="game-score">{{ schedule.homeScore }}</p>
              </div>
              <div class="mx-4 text-center">
                <p class="result-label">Result</p>
                <Tag
                  :severity="schedule.wonLostFlag === 'W' ? 'success' : 'danger'"
                  :value="schedule.wonLostFlag === 'W' ? 'Win' : 'Loss'"
                  class="result-tag"
                />
              </div>
              <div class="text-center">
                <p class="team-label">{{ getTeamName(schedule.awayTeamId) }}</p>
                <p class="game-score">{{ schedule.awayTeamScore }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <Button
          label="Back to Schedules"
          icon="pi pi-arrow-left"
          class="p-button-secondary"
          @click="navigateBack"
        />
      </template>
    </Card>

    <div v-else-if="loading" class="loading-container">
      <ProgressSpinner />
      <p>Loading schedule details...</p>
    </div>

    <div v-else class="error-container">
      <p>Schedule not found or error loading data.</p>
      <Button
        label="Back to Schedules"
        icon="pi pi-arrow-left"
        class="p-button-secondary"
        @click="navigateBack"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useScheduleStore } from '@/infrastructure/store/schedule.store';
import { useTeamStore } from '@/infrastructure/store/team.store';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';

// Route and router
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

// Store
const scheduleStore = useScheduleStore();
const teamStore = useTeamStore();

// State
const loading = ref(true);

// Computed
const schedule = computed(() => scheduleStore.currentSchedule);
const teams = computed(() => teamStore.teams);

// Methods
const loadSchedule = async () => {
  loading.value = true;
  const scheduleId = Number(route.params.id);

  try {
    await scheduleStore.fetchScheduleById(scheduleId);
    if (!scheduleStore.currentSchedule) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Schedule not found', life: 3000 });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load schedule details', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const loadTeams = async () => {
  if (teams.value.length === 0) {
    try {
      await teamStore.fetchTeams();
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  }
};

const getTeamName = (teamId: number) => {
  const team = teams.value.find(t => t.id === teamId);
  return team ? team.name : `Team ID: ${teamId}`;
};

const formatDate = (dateString: string | Date) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const navigateBack = () => {
  router.push({ name: 'Schedules' });
};

const editSchedule = () => {
  router.push({ name: 'ScheduleEdit', params: { id: schedule.value?.id } });
};

const confirmDelete = () => {
  confirm.require({
    message: `Are you sure you want to delete this schedule entry?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteSchedule(),
    reject: () => {}
  });
};

const deleteSchedule = async () => {
  if (!schedule.value?.id) return;

  try {
    await scheduleStore.deleteSchedule(schedule.value.id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Schedule deleted successfully', life: 3000 });
    router.push({ name: 'Schedules' });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete schedule', life: 3000 });
  }
};

// Lifecycle hooks
onMounted(async () => {
  await loadTeams();
  await loadSchedule();
});
</script>

<style scoped>
.schedule-details {
  max-width: 1000px;
  margin: 0 auto;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.loading-container p,
.error-container p {
  margin-top: 1rem;
}

.schedule-info,
.teams-info,
.game-result {
  background-color: var(--surface-card);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

h3 {
  padding: 0.75rem 1rem;
  margin: 0;
  background-color: var(--surface-section);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
}

.team-label, .result-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.game-score {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.result-tag {
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
}
</style>
