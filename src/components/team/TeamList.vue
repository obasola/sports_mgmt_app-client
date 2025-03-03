<!-- src/components/team/TeamList.vue -->
<template>
  <div class="team-list">
    <DataTable
      :value="teams"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} teams"
      responsiveLayout="scroll"
      stripedRows
      class="p-datatable-sm"
      v-model:filters="filters"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['name', 'city', 'state', 'conference', 'division']"
    >
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <h2 class="m-0">Teams</h2>
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
              label="New Team"
              icon="pi pi-plus"
              class="p-button-sm"
              @click="navigateToCreate"
            />
          </div>
        </div>
      </template>

      <Column field="id" header="ID" sortable></Column>
      <Column field="name" header="Name" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by name"
            @input="filterCallback()"
          />
        </template>
      </Column>
      <Column field="city" header="City" sortable></Column>
      <Column field="state" header="State" sortable></Column>
      <Column field="conference" header="Conference" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            :options="conferenceOptions"
            placeholder="Any Conference"
            class="p-column-filter"
            @change="filterCallback()"
          />
        </template>
      </Column>
      <Column field="division" header="Division" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            :options="divisionOptions"
            placeholder="Any Division"
            class="p-column-filter"
            @change="filterCallback()"
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
              @click="editTeam(slotProps.data)"
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
import { useTeamStore } from '../../infrastructure/store/team.store';
import { FilterMatchMode } from '@primevue/core/api';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';

// Store and router
const teamStore = useTeamStore();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

// State
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  conference: { value: null, matchMode: FilterMatchMode.EQUALS },
  division: { value: null, matchMode: FilterMatchMode.EQUALS }
});

// Options for filters
const conferenceOptions = ['AFC', 'NFC'];
const divisionOptions = ['North', 'South', 'East', 'West'];

// Computed properties
const teams = computed(() => teamStore.teams);

// Methods
const loadTeams = async () => {
  loading.value = true;
  try {
    await teamStore.fetchTeams();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load teams', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const navigateToCreate = () => {
  router.push({ name: 'TeamCreate' });
};

const viewDetails = (team) => {
  router.push({ name: 'TeamDetail', params: { id: team.id } });
};

const editTeam = (team) => {
  router.push({ name: 'TeamEdit', params: { id: team.id } });
};

const confirmDelete = (team) => {
  confirm.require({
    message: `Are you sure you want to delete ${team.name}?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteTeam(team.id),
    reject: () => {}
  });
};

const deleteTeam = async (id) => {
  try {
    await teamStore.deleteTeam(id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Team deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete team', life: 3000 });
  }
};

// Lifecycle hooks
onMounted(() => {
  loadTeams();
});
</script>

<style scoped>
.team-list {
  width: 100%;
}
</style>

