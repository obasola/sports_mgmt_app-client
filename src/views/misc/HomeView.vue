<!-- src/views/HomeView.vue -->
<template>
  <div class="home-view">
    <div class="hero">
      <h1>Sports Management Dashboard</h1>
      <p>Comprehensive management system for teams, players, awards, and schedules</p>
    </div>

    <div class="stat-cards">
      <div class="grid">
        <div class="col-12 md:col-3">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #3B82F6;">
              <i class="pi pi-users"></i>
            </div>
            <div class="stat-content">
              <h3>{{ teamCount }}</h3>
              <p>Teams</p>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-3">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #10B981;">
              <i class="pi pi-user"></i>
            </div>
            <div class="stat-content">
              <h3>{{ playerCount }}</h3>
              <p>Players</p>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-3">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #F59E0B;">
              <i class="pi pi-trophy"></i>
            </div>
            <div class="stat-content">
              <h3>{{ awardCount }}</h3>
              <p>Player Awards</p>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-3">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #EC4899;">
              <i class="pi pi-calendar"></i>
            </div>
            <div class="stat-content">
              <h3>{{ scheduleCount }}</h3>
              <p>Scheduled Games</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-cards mt-5">
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
          <Card class="action-card">
            <template #header>
              <div class="card-header" style="background-color: #3B82F6;">
                <i class="pi pi-users"></i>
              </div>
            </template>
            <template #title>Team Management</template>
            <template #content>
              <p>Create and manage team information including location, conference, and division details.</p>
            </template>
            <template #footer>
              <Button label="Manage Teams" class="p-button-outlined" @click="navigateTo('Teams')" />
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <Card class="action-card">
            <template #header>
              <div class="card-header" style="background-color: #10B981;">
                <i class="pi pi-user"></i>
              </div>
            </template>
            <template #title>Player Management</template>
            <template #content>
              <p>Track player information including physical attributes, positions, and college background.</p>
            </template>
            <template #footer>
              <Button label="Manage Players" class="p-button-outlined" @click="navigateTo('Players')" />
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <Card class="action-card">
            <template #header>
              <div class="card-header" style="background-color: #F59E0B;">
                <i class="pi pi-trophy"></i>
              </div>
            </template>
            <template #title>Player Awards</template>
            <template #content>
              <p>Record and browse player achievements, accolades, and awards throughout their careers.</p>
            </template>
            <template #footer>
              <Button label="Manage Awards" class="p-button-outlined" @click="navigateTo('PlayerAwards')" />
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <Card class="action-card">
            <template #header>
              <div class="card-header" style="background-color: #EC4899;">
                <i class="pi pi-calendar"></i>
              </div>
            </template>
            <template #title>Game Schedules</template>
            <template #content>
              <p>Manage team schedules, game results, scores, and venue information for the season.</p>
            </template>
            <template #footer>
              <Button label="Manage Schedules" class="p-button-outlined" @click="navigateTo('Schedules')" />
            </template>
          </Card>
        </div>
      </div>
    </div>

    <div class="recent-data mt-5">
      <TabView>
        <TabPanel header="Recent Players">
          <DataTable :value="recentPlayers" :rows="5" stripedRows>
            <Column field="id" header="ID"></Column>
            <Column field="firstName" header="First Name"></Column>
            <Column field="lastName" header="Last Name"></Column>
            <Column field="position" header="Position"></Column>
            <Column field="teamId" header="Team ID"></Column>
            <Column header="Actions">
              <template #body="slotProps">
                <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="viewPlayerDetails(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <TabPanel header="Recent Teams">
          <DataTable :value="recentTeams" :rows="5" stripedRows>
            <Column field="id" header="ID"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="city" header="City"></Column>
            <Column field="state" header="State"></Column>
            <Column field="conference" header="Conference"></Column>
            <Column header="Actions">
              <template #body="slotProps">
                <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="viewTeamDetails(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <TabPanel header="Upcoming Games">
          <DataTable :value="upcomingGames" :rows="5" stripedRows>
            <Column field="id" header="ID"></Column>
            <Column field="scheduleWeek" header="Week"></Column>
            <Column field="gameDate" header="Date">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.gameDate) }}
              </template>
            </Column>
            <Column field="gameLocation" header="Location"></Column>
            <Column field="homeTeamId" header="Home Team"></Column>
            <Column field="awayTeamId" header="Away Team"></Column>
            <Column header="Actions">
              <template #body="slotProps">
                <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="viewScheduleDetails(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTeamStore } from '@/infrastructure/store/team.store';
import { usePlayerStore } from '@/infrastructure/store/player.store';
import { usePlayerAwardStore } from '@/infrastructure/store/playerAward.store';
import { useScheduleStore } from '@/infrastructure/store/schedule.store';
import Card from 'primevue/card';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import type { Player } from '@/domain/models/Player';
import type { Schedule, Team } from '@/domain/models';

const router = useRouter();
const teamStore = useTeamStore();
const playerStore = usePlayerStore();
const playerAwardStore = usePlayerAwardStore();
const scheduleStore = useScheduleStore();

// Computed properties for counts
const teamCount = computed(() => teamStore.teams.length);
const playerCount = computed(() => playerStore.players.length);
const awardCount = computed(() => playerAwardStore.playerAwards.length);
const scheduleCount = computed(() => scheduleStore.schedules.length);

// Computed properties for tables
const recentPlayers = computed(() => {
  return playerStore.players.slice(0, 5);
});

const recentTeams = computed(() => {
  return teamStore.teams.slice(0, 5);
});

// Filter future games and sort by date
const upcomingGames = computed(() => {
  const today = new Date();
  return scheduleStore.schedules
    .filter(schedule => new Date(schedule.gameDate) >= today)
    .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime())
    .slice(0, 5);
});

// Methods
const navigateTo = (route) => {
  router.push({ name: route });
};

const viewPlayerDetails = (player: Player) => {
  router.push({ name: 'PlayerDetail', params: { id: player.id } });
};

const viewTeamDetails = (team: Team) => {
  router.push({ name: 'TeamDetail', params: { id: team.id } });
};

const viewScheduleDetails = (schedule: Schedule) => {
  router.push({ name: 'ScheduleDetail', params: { id: schedule.id } });
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Lifecycle hooks
onMounted(async () => {
  // Load all entity data for the dashboard
  if (teamStore.teams.length === 0) {
    await teamStore.fetchTeams();
  }

  if (playerStore.players.length === 0) {
    await playerStore.fetchPlayers();
  }

  if (playerAwardStore.playerAwards.length === 0) {
    await playerAwardStore.fetchPlayerAwards();
  }

  if (scheduleStore.schedules.length === 0) {
    await scheduleStore.fetchSchedules();
  }
});
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.hero p {
  font-size: 1.2rem;
  color: var(--text-color-secondary);
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: var(--surface-card);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 1rem;
}

.stat-icon i {
  font-size: 1.8rem;
  color: white;
}

.stat-content h3 {
  font-size: 2rem;
  margin: 0;
  color: var(--text-color);
}

.stat-content p {
  margin: 0.5rem 0 0 0;
  color: var(--text-color-secondary);
  font-size: 1.1rem;
}

.action-card {
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.card-header i {
  font-size: 2.5rem;
  color: white;
}

.section-cards .p-card-content {
  min-height: 80px;
}
</style>
