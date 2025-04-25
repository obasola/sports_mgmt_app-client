<template>
  <div class="player-list">
    <DataTable
      :value="players"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      v-model:filters="filters"
      filterDisplay="menu"
      :loading="loading"
      responsiveLayout="scroll"
      :globalFilterFields="['firstName', 'lastName', 'position', 'university']"
      class="p-datatable-players"
    >
      <template #header>
        <div class="table-header">
          <h2>Players</h2>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </span>
          <Button
            label="Add Player"
            icon="pi pi-plus"
            class="p-button-success ml-2"
            @click="$emit('create')"
          />
        </div>
      </template>

      <template #empty>
        <div class="text-center p-4">No players found.</div>
      </template>

      <template #loading>
        <div class="text-center p-4">Loading players...</div>
      </template>

      <Column field="id" header="ID" sortable style="width: 5%"></Column>
      <Column field="lastName" header="Last Name" sortable style="width: 15%">
        <template #body="{ data }">
          {{ data.lastName }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            placeholder="Search by last name"
          />
        </template>
      </Column>
      <Column field="firstName" header="First Name" sortable style="width: 15%">
        <template #body="{ data }">
          {{ data.firstName }}
        </template>
      </Column>
      <Column field="position" header="Position" sortable style="width: 10%">
        <template #body="{ data }">
          {{ data.position }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="positionOptions"
            placeholder="Select a position"
            class="p-column-filter"
            showClear
          />
        </template>
      </Column>
      <Column field="team.name" header="Team" sortable style="width: 15%">
        <template #body="{ data }">
          {{ data.team?.name || 'N/A' }}
        </template>
      </Column>
      <Column field="age" header="Age" sortable style="width: 5%"></Column>
      <Column field="university" header="University" sortable style="width: 15%">
        <template #body="{ data }">
          {{ data.university }}
        </template>
      </Column>
      <Column field="yearEnteredLeague" header="Year" sortable style="width: 10%">
        <template #body="{ data }">
          {{ formatYearOnly(data.yearEnteredLeague) }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Calendar
            v-model="filterModel.value"
            view="year"
            dateFormat="yy"
            @date-select="filterCallback()"
            placeholder="Select Year"
            class="p-column-filter"
          />
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
              @click="editPlayer(data.id)"
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
        <span v-if="playerToDelete">
          Are you sure you want to delete
          <b>{{ playerToDelete.firstName }} {{ playerToDelete.lastName }}</b
          >?
        </span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="closeDeleteDialog" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePlayer" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'

import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import type { Player } from '@/domain/models/Player'
import { FilterMatchMode } from 'primevue/api'
import { useRouter } from 'vue-router'

const emit = defineEmits(['view', 'create', 'deleted'])

const playerStore = usePlayerStore()
const toast = useToast()

const positionOptions = ref([
  'QB',
  'RB',
  'FB',
  'WR',
  'TE',
  'OT',
  'OG',
  'C',
  'DE',
  'DT',
  'LB',
  'CB',
  'S',
  'K',
  'P'
])

const loading = computed(() => playerStore.isLoading)
const players = computed(() => playerStore.players)

const deleteDialog = ref(false)
const playerToDelete = ref<Player | null>(null)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  position: { value: null, matchMode: FilterMatchMode.EQUALS },
  yearEnteredLeague: { value: null, matchMode: FilterMatchMode.DATE_IS }
})

onMounted(async () => {
  await playerStore.fetchPlayers()
})

const router = useRouter()

// Instead of emitting an event, navigate directly with a query parameter
const editPlayer = (id: number) => {
  router.push({
    path: `/players/${id}`,
    query: { edit: 'true' }
  })
}

const formatYearOnly = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'

  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.getFullYear().toString()
}
const confirmDelete = (player: Player) => {
  playerToDelete.value = player
  deleteDialog.value = true
}

const closeDeleteDialog = () => {
  deleteDialog.value = false
  playerToDelete.value = null
}

const deletePlayer = async () => {
  try {
    if (playerToDelete.value && playerToDelete.value.id) {
      await playerStore.deletePlayer(playerToDelete.value.id)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `${playerToDelete.value.firstName} ${playerToDelete.value.lastName} was deleted successfully`,
        life: 3000
      })
      emit('deleted', playerToDelete.value.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error deleting the player',
      life: 3000
    })
  } finally {
    closeDeleteDialog()
  }
}
</script>

<style scoped>
.player-list {
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
