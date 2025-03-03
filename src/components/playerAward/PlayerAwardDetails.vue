
<!-- src/components/playerAward/PlayerAwardDetails.vue -->
<template>
  <div class="player-award-details">
    <Card v-if="playerAward">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <h2>Player Award Details</h2>
          <div>
            <Button
              icon="pi pi-pencil"
              label="Edit"
              class="p-button-primary mr-2"
              @click="editPlayerAward"
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
          <div class="col-12">
            <div class="award-info">
              <h3>Award Information</h3>
              <div class="p-2">
                <p><strong>Award ID:</strong> {{ playerAward.id }}</p>
                <p><strong>Player ID:</strong> {{ playerAward.playerId }}</p>
                <p><strong>Award Name:</strong> {{ playerAward.awardName }}</p>
                <p><strong>Award Year:</strong> {{ playerAward.awardYear }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <Button
          label="Back to Awards"
          icon="pi pi-arrow-left"
          class="p-button-secondary"
          @click="navigateBack"
        />
      </template>
    </Card>

    <div v-else-if="loading" class="loading-container">
      <ProgressSpinner />
      <p>Loading award details...</p>
    </div>

    <div v-else class="error-container">
      <p>Award not found or error loading data.</p>
      <Button
        label="Back to Awards"
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
import { usePlayerAwardStore } from '../../infrastructure/store/playerAward.store';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

// Route and router
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

// Store
const playerAwardStore = usePlayerAwardStore();

// State
const loading = ref(true);

// Computed
const playerAward = computed(() => playerAwardStore.currentPlayerAward);

// Methods
const loadPlayerAward = async () => {
  loading.value = true;
  const playerAwardId = Number(route.params.id);

  try {
    await playerAwardStore.fetchPlayerAwardById(playerAwardId);
    if (!playerAwardStore.currentPlayerAward) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Player award not found', life: 3000 });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load player award details', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const navigateBack = () => {
  router.push({ name: 'PlayerAwards' });
};

const editPlayerAward = () => {
  router.push({ name: 'PlayerAwardEdit', params: { id: playerAward.value?.id } });
};

const confirmDelete = () => {
  confirm.require({
    message: `Are you sure you want to delete this award?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deletePlayerAward(),
    reject: () => {}
  });
};

const deletePlayerAward = async () => {
  if (!playerAward.value?.id) return;

  try {
    await playerAwardStore.deletePlayerAward(playerAward.value.id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Player award deleted successfully', life: 3000 });
    router.push({ name: 'PlayerAwards' });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete player award', life: 3000 });
  }
};

// Lifecycle hooks
onMounted(() => {
  loadPlayerAward();
});
</script>

<style scoped>
.player-award-details {
  max-width: 800px;
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

.award-info {
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
</style>
