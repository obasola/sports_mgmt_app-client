<!-- src/components/schedule/ScheduleList.vue -->
<template>
  <div class="schedule-list">
    <DataTable
      :value="schedules"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} schedules"
      responsiveLayout="scroll"
      stripedRows
      class="p-datatable-sm"
      v-model:filters="filters"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['teamID', 'homeTeamId', 'awayTeamId', 'scheduleWeek', 'gameCity', 'gameStateProvince', 'gameCountry']"
    >
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <h2 class="m-0">Schedules</h2>
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
              label="New Schedule"
              icon="pi pi-plus"
              class="p-button-sm"
              @click="navigateToCreate"
            />
          </div>
        </div>
      </template>

      <Column field="id" header="ID" sortable></Column>
      <Column field="teamID" header="Team ID" sortable></Column>
      <Column field="scheduleWeek" header="Week" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputNumber
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by week"
            @input="filterCallback()"
          />
        </template>
      </Column>
      <Column field="gameDate" header="Date" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.gameDate) }}
        </template>
      </Column>
      <Column field="gameLocation" header="Location" sortable></Column>
      <Column field="homeTeamId" header="Home Team" sortable></Column>
      <Column field="awayTeamId" header="Away Team" sortable></Column>
      <Column field="wonLostFlag" header="Result" sortable>
        <template #body="slotProps">
          <Tag
            :severity="slotProps.data.wonLostFlag === 'W' ? 'success' : 'danger'"
            :value="slotProps.data.wonLostFlag === 'W' ? 'Win' : 'Loss'"
          />
        </template>
      </Column>
      <Column header="Score" sortable>
        <template #body="slotProps">
          {{ slotProps.data.homeScore }} - {{ slotProps.data.awayTeamScore }}
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
              @click="editSchedule(slotProps.data)"
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
import { useScheduleStore } from '../../infrastructure/store/schedule.store';
import { FilterMatchMode } from '@primevue/core/api';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Tag from 'primevue/tag';

// Store and router
const scheduleStore = useScheduleStore();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

// State
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  scheduleWeek: { value: null, matchMode: FilterMatchMode.EQUALS },
  teamID: { value: null, matchMode: FilterMatchMode.EQUALS },
  gameCity: { value: null, matchMode: FilterMatchMode.CONTAINS },
  wonLostFlag: { value: null, matchMode: FilterMatchMode.EQUALS }
});

// Computed properties
const schedules = computed(() => scheduleStore.schedules);

// Methods
const loadSchedules = async () => {
  loading.value = true;
  try {
    await scheduleStore.fetchSchedules();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load schedules', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
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
onMounted(() => {
  loadSchedule();
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
