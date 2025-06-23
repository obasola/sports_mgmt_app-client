<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScheduleStore } from '@/stores/scheduleStore'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const scheduleStore = useScheduleStore()
const router = useRouter()

// Pagination refs
const rows = ref(10)
const first = ref(0)

onMounted(() => {
  scheduleStore.fetchAll(1, rows.value)
})

// Handle pagination events
const onPage = async (event: any) => {
  const page = event.page + 1 // PrimeVue uses 0-based, backend uses 1-based
  const limit = event.rows
  
  first.value = event.first
  rows.value = limit
  
  await scheduleStore.fetchAll(page, limit)
}

const viewSchedule = (id: number) => {
  router.push(`/schedules/${id}?mode=read`)
}

const editSchedule = (id: number) => {
  router.push(`/schedules/${id}?mode=edit`)
}

const createSchedule = () => {
  router.push('/schedules?mode=create')
}

const deleteSchedule = async (id: number) => {
  if (confirm('Are you sure you want to delete this schedule?')) {
    await scheduleStore.remove(id)
    // Refresh current page after delete
    await scheduleStore.fetchAll(scheduleStore.currentPage, scheduleStore.itemsPerPage, true)
  }
}

const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'TBD'
  const d = new Date(date)
  return d.toLocaleDateString()
}

const getWonLostTagSeverity = (flag: string | undefined) => {
  switch (flag?.toUpperCase()) {
    case 'W': return 'success'
    case 'L': return 'danger'
    default: return 'info'
  }
}

const getHomeAwayTagSeverity = (homeAway: string | undefined) => {
  return homeAway?.toUpperCase() === 'HOME' ? 'success' : 'warning'
}
</script>

<template>
  <div class="schedule-list">
    <div class="list-header">
      <h2>Schedules</h2>
      <Button
        @click="createSchedule"
        label="Create Schedule"
        icon="pi pi-plus"
        class="p-button-success"
      />
    </div>

    <DataTable
      :value="scheduleStore.schedules"
      :loading="scheduleStore.loading"
      :lazy="true"
      paginator
      :rows="rows"
      :first="first"
      :totalRecords="scheduleStore.pagination?.total || 0"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      responsiveLayout="scroll"
      sortMode="multiple"
      :globalFilterFields="['gameLocation', 'gameCity', 'oppTeamConference']"
    >
      <Column field="seasonYear" header="Season" sortable />
      <Column field="scheduleWeek" header="Week" sortable />
      <Column field="gameDate" header="Game Date" sortable>
        <template #body="{ data }">
          {{ formatDate(data.gameDate) }}
        </template>
      </Column>
      <Column field="oppTeamId" header="Opponent" sortable />
      <Column field="homeOrAway" header="Home/Away">
        <template #body="{ data }">
          <Tag 
            :value="data.homeOrAway || 'TBD'" 
            :severity="getHomeAwayTagSeverity(data.homeOrAway)"
          />
        </template>
      </Column>
      <Column field="gameLocation" header="Location" />
      <Column field="teamScore" header="Team Score" sortable />
      <Column field="oppTeamScore" header="Opp Score" sortable />
      <Column field="wonLostFlag" header="Result">
        <template #body="{ data }">
          <Tag 
            v-if="data.wonLostFlag"
            :value="data.wonLostFlag" 
            :severity="getWonLostTagSeverity(data.wonLostFlag)"
          />
          <span v-else>TBD</span>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button
              @click="viewSchedule(data.id)"
              icon="pi pi-eye"
              class="p-button-info p-button-sm"
              v-tooltip="'View'"
            />
            <Button
              @click="editSchedule(data.id)"
              icon="pi pi-pencil"
              class="p-button-warning p-button-sm"
              v-tooltip="'Edit'"
            />
            <Button
              @click="deleteSchedule(data.id)"
              icon="pi pi-trash"
              class="p-button-danger p-button-sm"
              v-tooltip="'Delete'"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.schedule-list {
  width: 100%;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>