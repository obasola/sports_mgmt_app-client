<!-- src/components/team/TeamDetails.vue -->
<template>
  <div class="team-details">
    <Card v-if="team">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <h2>{{ team.name }}</h2>
          <div>
            <Button
              icon="pi pi-pencil"
              label="Edit"
              class="p-button-primary mr-2"
              @click="editTeam"
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
            <div class="team-info">
              <h3>Team Information</h3>
              <div class="p-2">
                <p><strong>Location:</strong> {{ team.city }}, {{ team.state }}</p>
                <p><strong>Conference:</strong> {{ team.conference }}</p>
                <p><strong>Division:</strong> {{ team.division }}</p>
                <p><strong>Stadium:</strong> {{ team.stadium }}</p>
              </div>
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="team-stats">
              <h3>Team Stats</h3>
              <div class="p-2">
                <p><strong>Total Players:</strong> {{ team.players?.length || 0 }}</p>
                <p><strong>Schedule ID:</strong> {{ team.scheduleId }}</p>
                <p><strong>Upcoming Games:</strong> {{ upcomingGames.length }}</p>
                <p><strong>Draft Picks:</strong> {{ team.picks?.length || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div class="players-container">
          <div class="flex align-items-center justify-content-between mb-3">
            <h3>Players</h3>
            <Button
              icon="pi pi-plus"
              label="Add Player"
              class="p-button-success"
              @click="navigateToCreatePlayer"
            />
          </div>

          <DataTable
            :value="team.players || []"
            :rows="5"
            :paginator="(team.players?.length || 0) > 5"
            responsiveLayout="scroll"
            stripedRows
            class="p-datatable-sm"
            emptyMessage="No players on this team yet"
          >
            <Column field="id" header="ID"></Column>
            <Column field="firstName" header="First Name"></Column>
            <Column field="lastName" header="Last Name"></Column>
            <Column field="position" header="Position"></Column>
            <Column field="university" header="University"></Column>
            <Column header="Actions">
              <template #body="slotProps">
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-info p-button-sm"
                  @click="viewPlayerDetails(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <Divider />

        <div class="schedules-container">
          <div class="flex align-items-center justify-content-between mb-3">
            <h3>Upcoming Games</h3>
            <Button
              icon="pi pi-plus"
              label="Add Schedule"
              class="p-button-success"
              @click="navigateToCreateSchedule"
            />
          </div>

          <DataTable
            :value="upcomingGames"
            :rows="5"
            :paginator="upcomingGames.length > 5"
            responsiveLayout="scroll"
            stripedRows
            class="p-datatable-sm"
            :loading="loadingSchedules"
            emptyMessage="No upcoming games for this team"
          >
            <Column field="scheduleWeek" header="Week"></Column>
            <Column field="gameDate" header="Date">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.gameDate) }}
              </template>
            </Column>
            <Column field="gameLocation" header="Location"></Column>
            <Column field="homeOrAway" header="Home/Away">
              <template #body="slotProps">
                <Tag
                  :severity="slotProps.data.homeOrAway === 'home' ? 'success' : 'info'"
                  :value="slotProps.data.homeOrAway === 'home' ? 'Home' : 'Away'"
                />
              </template>
            </Column>
            <Column field="awayTeamId" header="Opponent">
              <template #body="slotProps">
                {{ slotProps.data.homeOrAway === 'home' ? slotProps.data.awayTeamId : slotProps.data.homeTeamId }}
              </template>
            </Column>
            <Column header="Actions">
              <template #body="slotProps">
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-info p-button-sm"
                  @click="viewScheduleDetails(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <Divider />

        <div class="past-games-container">
          <h3>Game Results</h3>
          <DataTable
            :value="pastGames"
            :rows="5"
            :paginator="pastGames.length > 5"
            responsiveLayout="scroll"
            stripedRows
            class="p-datatable-sm"
            :loading="loadingSchedules"
            emptyMessage="No past games for this team"
          >
            <Column field="scheduleWeek" header="Week"></Column>
            <Column field="gameDate" header="Date">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.gameDate) }}
              </template>
            </Column>
            <Column field="gameLocation" header="Location"></Column>
            <Column field="wonLostFlag" header="Result">
              <template #body="slotProps">
                <Tag
                  :severity="slotProps.data.wonLostFlag === 'W' ? 'success' : 'danger'"
                  :value="slotProps.data.wonLostFlag === 'W' ? 'Win' : 'Loss'"
                />
              </template>
            </Column>
            <Column header="Score">
              <template #body="slotProps">
                {{ formatScore(slotProps.data) }}
              </template>
            </Column>
            <Column header="Actions">
              <template #body="slotProps">
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-info p-button-sm"
                  @click="viewScheduleDetails(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>

      <template #footer>
        <Button
          label="Back to Teams"
          icon="pi pi-arrow-left"
          class="p-button-secondary"
          @click="navigateBack"
        />
      </template>
    </Card>

    <div v-else-if="loading" class="loading-container">
      <ProgressSpinner />
      <p>Loading team details...</p>
    </div>

    <div v-else class="error-container">
      <p>Team not found or error loading data.</p>
      <Button
        label="Back to Teams"
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
import { useTeamStore } from '../../infrastructure/store/team.store';
import { useScheduleStore } from '../../infrastructure/store/schedule.store';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';

// Route and router
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

// Store
const teamStore = useTeamStore();
const scheduleStore = useScheduleStore();

// State
const loading = ref(true);
const loadingSchedules = ref(true);

// Computed
const team = computed(() => teamStore.currentTeam);
const allTeamSchedules = computed(() => {
  if (!team.value?.id) return [];
  return scheduleStore.schedules.filter(
    s => s.teamID === team.value.id || s.homeTeamId === team.value.id || s.awayTeamId === team.value.id
  );
});

const upcomingGames = computed(() => {
  const today = new Date();
  return allTeamSchedules.value
    .filter(schedule => new Date(schedule.gameDate) >= today)
    .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime());
});

const pastGames = computed(() => {
  const today = new Date();
  return allTeamSchedules.value
    .filter(schedule => new Date(schedule.gameDate) < today)
    .sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());
});

// Methods
const loadTeam = async () => {
  loading.value = true;
  const teamId = Number(route.params.id);

  try {
    await teamStore.fetchTeamById(teamId);
    if (!teamStore.currentTeam) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Team not found', life: 3000 });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load team details', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const loadSchedules = async () => {
  if (!team.value?.id) return;

  loadingSchedules.value = true;
  try {
    await scheduleStore.fetchSchedules();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load schedules', life: 3000 });
  } finally {
    loadingSchedules.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatScore = (schedule) => {
  if (schedule.homeOrAway === 'home') {
    return `${schedule.homeScore} - ${schedule.awayTeamScore}`;
  } else {
    return `${schedule.awayTeamScore} - ${schedule.homeScore}`;
  }
};

const navigateBack = () => {
  router.push({ name: 'Teams' });
};

const editTeam = () => {
  router.push({ name: 'TeamEdit', params: { id: team.value?.id } });
};

const viewPlayerDetails = (player) => {
  router.push({ name: 'PlayerDetail', params: { id: player.id } });
};

const viewScheduleDetails = (schedule) => {
  router.push({ name: 'ScheduleDetail', params: { id: schedule.id } });
};

const navigateToCreatePlayer = () => {
  router.push({
    name: 'PlayerCreate',
    query: { teamId: team.value?.id }
  });
};

const navigateToCreateSchedule = () => {
  router.push({
    name: 'ScheduleCreate',
    query: { teamId: team.value?.id }
  });
};

const confirmDelete = () => {
  confirm.require({
    message: `Are you sure you want to delete ${team.value?.name}?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteTeam(),
    reject: () => {}
  });
};

const deleteTeam = async () => {
  if (!team.value?.id) return;

  try {
    await teamStore.deleteTeam(team.value.id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Team deleted successfully', life: 3000 });
    router.push({ name: 'Teams' });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete team', life: 3000 });
  }
};

// Lifecycle hooks
onMounted(async () => {
  await loadTeam();
  if (team.value?.id) {
    await loadSchedules();
  }
});
</script>

<style scoped>
.team-details {
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

.team-info,
.team-stats,
.players-container,
.schedules-container,
.past-games-container {
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

.players-container .flex,
.schedules-container .flex {
  background-color: var(--surface-section);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 0.5rem 1rem;
}

.players-container .flex h3,
.schedules-container .flex h3 {
  background-color: transparent;
  padding: 0.25rem 0;
}
</style>
