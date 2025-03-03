<!-- src/components/playerAward/PlayerAwardList.vue -->
<template>
  <div class="player-award-list">
    <DataTable
      :value="playerAwards"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} awards"
      responsiveLayout="scroll"
      stripedRows
      class="p-datatable-sm"
      v-model:filters="filters"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['playerId', 'awardName', 'awardYear']"
    >
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <h2 class="m-0">Player Awards</h2>
          <div class="flex align-items-center">
            <span class="p-input-icon-left mr-2">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
                class="p-inputtext-sm"
              />
            </span>
            <Button
              label="New Award"
              icon="pi pi-plus"
              class="p-button-sm"
              @click="navigateToCreate"
            />
          </div>
        </div>
      </template>

      <Column field="id" header="ID" sortable></Column>
      <Column field="playerId" header="Player ID" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputNumber
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by Player ID"
            @input="filterCallback()"
          />
        </template>
      </Column>
      <Column field="awardName" header="Award Name" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by award name"
            @input="filterCallback()"
          />
        </template>
      </Column>
      <Column field="awardYear" header="Year" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputNumber
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by year"
            @input="filterCallback()"
          />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-info p-button-sm"
              @click="viewDetails(slotProps.data)"
            />
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success p-button-sm"
              @click="editPlayerAward(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-sm"
              @click="confirmDelete(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePlayerAwardStore } from '../../infrastructure/store/playerAward.store';
import { FilterMatchMode } from '@primevue/core/api';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import type { PlayerAward } from '@/domain/models/PlayerAward';

// Store and router
const playerAwardStore = usePlayerAwardStore();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

// State
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  playerId: { value: null, matchMode: FilterMatchMode.EQUALS },
  awardName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  awardYear: { value: null, matchMode: FilterMatchMode.EQUALS }
});

// Computed properties
const playerAwards = computed(() => playerAwardStore.playerAwards);

// Methods
const loadPlayerAwards = async () => {
  loading.value = true;
  try {
    await playerAwardStore.fetchPlayerAwards();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load player awards', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const navigateToCreate = () => {
  router.push({ name: 'PlayerAwardCreate' });
};

const viewDetails = (playerAward: PlayerAward) => {
  router.push({ name: 'PlayerAwardDetail', params: { id: playerAward.id } });
};

const editPlayerAward = (playerAward: PlayerAward) => {
  router.push({ name: 'PlayerAwardEdit', params: { id: playerAward.id } });
};

const confirmDelete = (playerAward: PlayerAward) => {
  confirm.require({
    message: `Are you sure you want to delete this award?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deletePlayerAward(playerAward.id),
    reject: () => {}
  });
};

const deletePlayerAward = async (id: number | undefined) => {
  try {
    await playerAwardStore.deletePlayerAward(id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Player award deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete player award', life: 3000 });
  }
};

// Lifecycle hooks
onMounted(() => {
  loadPlayerAwards();
});
</script>

<style scoped>
.player-award-list {
  width: 100%;
}
</style>
