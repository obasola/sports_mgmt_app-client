<!-- src/components/player/PlayerDetails.vue -->
<template>
  <div class="player-details">
    <Card v-if="player">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <h2>{{ player.firstName }} {{ player.lastName }}</h2>
          <div>
            <Button
              icon="pi pi-pencil"
              label="Edit"
              class="p-button-primary mr-2"
              @click="editPlayer"
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
            <div class="player-info">
              <h3>Personal Information</h3>
              <div class="p-2">
                <p><strong>Position:</strong> {{ player.position }}</p>
                <p><strong>Age:</strong> {{ player.age }}</p>
                <p><strong>Height:</strong> {{ formatHeight(player.height) }}</p>
                <p><strong>Weight:</strong> {{ player.weight }} lbs</p>
                <p><strong>Hand Size:</strong> {{ player.handSize }} inches</p>
                <p><strong>Arm Length:</strong> {{ player.armLength }} inches</p>
              </div>
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="player-background">
              <h3>Background</h3>
              <div class="p-2">
                <p><strong>Home:</strong> {{ player.homeCity }}, {{ player.homeState }}</p>
                <p><strong>University:</strong> {{ player.university }}</p>
                <p><strong>Year Entered League:</strong> {{ player.yearEnteredLeague }}</p>
                <p><strong>Draft Pick:</strong> {{ player.pick ? `Round ${player.pick.round}, Pick ${player.pick.pickNumber} (${player.pick.draftYear})` : 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div class="team-info" v-if="player.Team">
          <h3>Team Information</h3>
          <div class="p-2">
            <p><strong>Team:</strong> {{ player.Team.name }}</p>
            <p><strong>Location:</strong> {{ player.Team.city }}, {{ player.Team.state }}</p>
            <p><strong>Conference:</strong> {{ player.Team.conference }}</p>
            <p><strong>Division:</strong> {{ player.Team.division }}</p>
            <p><strong>Stadium:</strong> {{ player.Team.stadium }}</p>
            <Button
              icon="pi pi-external-link"
              label="View Team"
              class="p-button-secondary mt-3"
              @click="viewTeam"
            />
          </div>
        </div>

        <Divider />

        <div class="awards-container">
          <div class="flex align-items-center justify-content-between mb-3">
            <h3>Player Awards</h3>
            <Button
              icon="pi pi-plus"
              label="Add Award"
              class="p-button-success"
              @click="navigateToCreateAward"
            />
          </div>

          <DataTable
            :value="playerAwards"
            :rows="5"
            :paginator="playerAwards.length > 5"
            responsiveLayout="scroll"
            stripedRows
            class="p-datatable-sm"
            :loading="loadingAwards"
            emptyMessage="No awards found for this player"
          >
            <Column field="id" header="ID"></Column>
            <Column field="awardName" header="Award Name"></Column>
            <Column field="awardYear" header="Year"></Column>
            <Column header="Actions">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-info p-button-sm"
                    @click="viewAwardDetails(slotProps.data)"
                  />
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-success p-button-sm"
                    @click="editAward(slotProps.data)"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-button-sm"
                    @click="confirmDeleteAward(slotProps.data)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <Divider />

        <div class="combine-info" v-if="player.combineScore">
          <h3>Combine Scores</h3>
          <div class="p-2">
            <p><strong>40-Yard Dash:</strong> {{ player.combineScore.fortyYardDash }} seconds</p>
            <p><strong>Bench Press:</strong> {{ player.combineScore.benchPress }} reps</p>
            <p><strong>Vertical Jump:</strong> {{ player.combineScore.verticalJump }} inches</p>
            <p><strong>Broad Jump:</strong> {{ player.combineScore.broadJump }} inches</p>
            <p><strong>3-Cone Drill:</strong> {{ player.combineScore.threeCone }} seconds</p>
            <p><strong>Shuttle Run:</strong> {{ player.combineScore.shuttleRun }} seconds</p>
            <p><strong>Combine Year:</strong> {{ player.combineScore.year }}</p>
          </div>
        </div>
      </template>

      <template #footer>
        <Button
          label="Back to Players"
          icon="pi pi-arrow-left"
          class="p-button-secondary"
          @click="navigateBack"
        />
      </template>
    </Card>

    <div v-else-if="loading" class="loading-container">
      <ProgressSpinner />
      <p>Loading player details...</p>
    </div>

    <div v-else class="error-container">
      <p>Player not found or error loading data.</p>
      <Button
        label="Back to Players"
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
import { usePlayerStore } from '../../infrastructure/store/player.store';
import { usePlayerAwardStore } from '../../infrastructure/store/playerAward.store';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';

// Route and router
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

// Store
const playerStore = usePlayerStore();
const playerAwardStore = usePlayerAwardStore();

// State
const loading = ref(true);
const loadingAwards = ref(true);

// Computed
const player = computed(() => playerStore.currentPlayer);
const playerAwards = computed(() => playerAwardStore.playerAwards);

// Methods
const loadPlayer = async () => {
  loading.value = true;
  const playerId = Number(route.params.id);

  try {
    await playerStore.fetchPlayerById(playerId);
    if (!playerStore.currentPlayer) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Player not found', life: 3000 });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load player details', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const loadPlayerAwards = async () => {
  if (!player.value?.id) return;

  loadingAwards.value = true;
  try {
    await playerAwardStore.fetchPlayerAwardsByPlayerId(player.value.id);
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load player awards', life: 3000 });
  } finally {
    loadingAwards.value = false;
  }
};

const formatHeight = (heightInInches: number) => {
  const feet = Math.floor(heightInInches / 12);
  const inches = heightInInches % 12;
  return `${feet}' ${inches}"`;
};

const navigateBack = () => {
  router.push({ name: 'Players' });
};

const editPlayer = () => {
  router.push({ name: 'PlayerEdit', params: { id: player.value?.id } });
};

const viewTeam = () => {
  if (player.value?.Team?.id) {
    router.push({ name: 'TeamDetail', params: { id: player.value.Team.id } });
  }
};

const navigateToCreateAward = () => {
  router.push({
    name: 'PlayerAwardCreate',
    query: { playerId: player.value?.id }
  });
};

const viewAwardDetails = (award) => {
  router.push({ name: 'PlayerAwardDetail', params: { id: award.id } });
};

const editAward = (award) => {
  router.push({ name: 'PlayerAwardEdit', params: { id: award.id } });
};

const confirmDeleteAward = (award) => {
  confirm.require({
    message: `Are you sure you want to delete this award: ${award.awardName} (${award.awardYear})?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteAward(award.id),
    reject: () => {}
  });
};

const deleteAward = async (id) => {
  try {
    await playerAwardStore.deletePlayerAward(id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Award deleted successfully', life: 3000 });
    loadPlayerAwards(); // Reload awards after deletion
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete award', life: 3000 });
  }
};

const confirmDelete = () => {
  confirm.require({
    message: `Are you sure you want to delete ${player.value?.firstName} ${player.value?.lastName}?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deletePlayer(),
    reject: () => {}
  });
};

const deletePlayer = async () => {
  if (!player.value?.id) return;

  try {
    await playerStore.deletePlayer(player.value.id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Player deleted successfully', life: 3000 });
    router.push({ name: 'Players' });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete player', life: 3000 });
  }
};

// Lifecycle hooks
onMounted(async () => {
  await loadPlayer();
  if (player.value?.id) {
    await loadPlayerAwards();
  }
});
</script>

<style scoped>
.player-details {
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

.player-info,
.player-background,
.team-info,
.combine-info,
.awards-container {
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

.awards-container .flex {
  background-color: var(--surface-section);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 0.5rem 1rem;
}

.awards-container .flex h3 {
  background-color: transparent;
  padding: 0.25rem 0;
}
</style>
