<!-- src/components/player/PlayerList.vue -->
<template>
  <div class="player-list">
    <DataTable
      :value="players"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} players"
      responsiveLayout="scroll"
      stripedRows
      class="p-datatable-sm"
      v-model:filters="filters"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['firstName', 'lastName', 'position', 'university']"
    >
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <h2 class="m-0">Players</h2>
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
              label="New Player"
              icon="pi pi-plus"
              class="p-button-sm"
              @click="navigateToCreate"
            />
          </div>
        </div>
      </template>

      <Column field="id" header="ID" sortable></Column>
      <Column field="firstName" header="First Name" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by first name"
            @input="filterCallback()"
          />
        </template>
      </Column>
      <Column field="lastName" header="Last Name" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by last name"
            @input="filterCallback()"
          />
        </template>
      </Column>
      <Column field="position" header="Position" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            :options="positionOptions"
            placeholder="Any Position"
            class="p-column-filter"
            @change="filterCallback()"
          />
        </template>
      </Column>
      <Column field="university" header="University" sortable></Column>
      <Column field="yearEnteredLeague" header="Year Entered" sortable></Column>
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
              @click="editPlayer(slotProps.data)"
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
import { usePlayerStore } from '../../infrastructure/store/player.store';
import { FilterMatchMode } from '@primevue/core/api';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import type { Player } from '@/domain/models';

// Store and router
const playerStore = usePlayerStore();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

// State
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  position: { value: null, matchMode: FilterMatchMode.EQUALS }
});

// Options for position dropdown filter
const positionOptions = [
  'QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P'
];

// Computed properties
const players = computed(() => playerStore.players);

// Methods
const loadPlayers = async () => {
  loading.value = true;
  try {
    await playerStore.fetchPlayers();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load players', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const navigateToCreate = () => {
  router.push({ name: 'PlayerCreate' });
};

const viewDetails = (player: { id: any; }) => {
  router.push({ name: 'PlayerDetail', params: { id: player.id } });
};

const editPlayer = (player: Player) => {
  router.push({ name: 'PlayerEdit', params: { id: player.id } });
};

const confirmDelete = (player: Player) => {
  confirm.require({
    message: `Are you sure you want to delete ${player.firstName} ${player.lastName}?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deletePlayer(player.id),
    reject: () => {}
  });
};

const deletePlayer = async (id: number | undefined) => {
  try {
    await playerStore.deletePlayer(id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Player deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete player', life: 3000 });
  }
};

// Lifecycle hooks
onMounted(() => {
  loadPlayers();
});
</script>

<style scoped>
.player-list {
  width: 100%;
}
</style>

