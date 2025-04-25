<template>
  <div class="schedule-list">
    <DataTable
      :value="schedules"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      v-model:filters="filters"
      filterDisplay="menu"
      :loading="loading"
      responsiveLayout="scroll"
      :globalFilterFields="['gameCity', 'gameStateProvince', 'gameCountry', 'gameLocation']"
      class="p-datatable-schedules"
    >
      <template #header>
        <div class="table-header">
          <h2>Schedule</h2>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </span>
          <Button
            label="Add Game"
            icon="pi pi-plus"
            class="p-button-success ml-2"
            @click="$emit('create')"
          />
        </div>
      </template>

      <template #empty>
        <div class="text-center p-4">No games found.</div>
      </template>

      <template #loading>
        <div class="text-center p-4">Loading schedule...</div>
      </template>

      <Column field="id" header="ID" sortable style="width: 5%"></Column>
      <Column field="scheduleWeek" header="Week" sortable style="width: 5%"></Column>
      <Column field="gameDate" header="Date" sortable style="width: 10%">
        <template #body="{ data }">
          {{ formatDate(data.gameDate) }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Calendar
            v-model="filterModel.value"
            dateFormat="mm/dd/yy"
            placeholder="mm/dd/yyyy"
            @date-select="filterCallback()"
          />
        </template>
      </Column>
      <Column field="gameLocation" header="Location" sortable style="width: 15%"></Column>
      <Column field="gameCity" header="City" sortable style="width: 10%"></Column>
      <Column
        field="gameStateProvince"
        header="State/Province"
        sortable
        style="width: 10%"
      ></Column>
      <Column field="gameCountry" header="Country" sortable style="width: 10%"></Column>
      <Column field="homeOrAway" header="Home/Away" sortable style="width: 10%">
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="homeAwayOptions"
            placeholder="Select"
            class="p-column-filter"
            showClear
          />
        </template>
      </Column>
      <Column field="wonLostFlag" header="Result" sortable style="width: 10%">
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="resultOptions"
            placeholder="Select"
            class="p-column-filter"
            showClear
          />
        </template>
      </Column>
      <Column header="Score" style="width: 10%">
        <template #body="{ data }">
          {{
            data.homeScore !== undefined && data.awayTeamScore !== undefined
              ? `${data.homeScore} - ${data.awayTeamScore}`
              : 'TBD'
          }}
        </template>
      </Column>
      <Column header="Actions" style="width: 10%">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button
              icon="pi pi-eye"
              class="p-button-text p-button-rounded p-button-info"
              @click="$emit('view', data.id)"
              v-tooltip.top="'View'"
            />
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-rounded p-button-success"
              @click="$emit('edit', data.id)"
              v-tooltip.top="'Edit'"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-rounded p-button-danger"
              @click="confirmDelete(data)"
              v-tooltip.top="'Delete'"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="deleteDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="scheduleToDelete">
          Are you sure you want to delete the game on
          <b>{{ formatDate(scheduleToDelete.gameDate) }}</b
          >?
        </span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="closeDeleteDialog" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSchedule" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useScheduleStore } from '@/stores/schedule'

import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import type { Schedule } from '@/domain/models/Schedule'
import { FilterMatchMode } from 'primevue/api'
import { formatDate } from '@/utils/formatters'

const emit = defineEmits(['view', 'edit', 'create', 'deleted'])

const scheduleStore = useScheduleStore()
const toast = useToast()

const homeAwayOptions = ref(['Home', 'Away'])
const resultOptions = ref(['W', 'L', 'T', 'TBD'])

const loading = computed(() => scheduleStore.isLoading)
const schedules = computed(() => scheduleStore.schedules)

const deleteDialog = ref(false)
const scheduleToDelete = ref<Schedule | null>(null)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  scheduleWeek: { value: null, matchMode: FilterMatchMode.EQUALS },
  gameDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  homeOrAway: { value: null, matchMode: FilterMatchMode.EQUALS },
  wonLostFlag: { value: null, matchMode: FilterMatchMode.EQUALS }
})

onMounted(async () => {
  await scheduleStore.fetchSchedules()
})

const confirmDelete = (schedule: Schedule) => {
  scheduleToDelete.value = schedule
  deleteDialog.value = true
}

const closeDeleteDialog = () => {
  deleteDialog.value = false
  scheduleToDelete.value = null
}

const deleteSchedule = async () => {
  try {
    if (scheduleToDelete.value && scheduleToDelete.value.id) {
      await scheduleStore.deleteSchedule(scheduleToDelete.value.id)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `Game on ${formatDate(scheduleToDelete.value.gameDate)} was deleted successfully`,
        life: 3000
      })
      emit('deleted', scheduleToDelete.value.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error deleting the game',
      life: 3000
    })
  } finally {
    closeDeleteDialog()
  }
}
</script>

<style scoped>
.schedule-list {
  background-color: var(--light-bg);
  border-radius: 4px;
  padding: 1rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.table-header h2 {
  margin: 0;
  color: var(--primary-text);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>
