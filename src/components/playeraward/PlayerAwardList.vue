<template>
  <div class="playeraward-list">
    <DataTable
      :value="playerAwards"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      v-model:filters="filters"
      filterDisplay="menu"
      :loading="loading"
      responsiveLayout="scroll"
      :globalFilterFields="['name', 'yearAwarded', 'player.lastName']"
      class="p-datatable-playerawards"
    >
      <template #header>
        <div class="table-header">
          <h2>Player Awards</h2>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </span>
          <Button
            label="Add Award"
            icon="pi pi-plus"
            class="p-button-success ml-2"
            @click="$emit('create')"
          />
        </div>
      </template>

      <template #empty>
        <div class="text-center p-4">No awards found.</div>
      </template>

      <template #loading>
        <div class="text-center p-4">Loading awards...</div>
      </template>

      <Column field="id" header="ID" sortable style="width: 5%"></Column>
      <Column field="name" header="Award Name" sortable style="width: 25%">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            placeholder="Search by award name"
          />
        </template>
      </Column>
      <Column field="yearAwarded" header="Year" sortable style="width: 15%">
        <template #filter="{ filterModel, filterCallback }">
          <InputNumber
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            placeholder="Year"
            :min="1990"
            :max="currentYear"
          />
        </template>
      </Column>
      <Column field="player.lastName" header="Player" sortable style="width: 25%">
        <template #body="{ data }">
          {{
            data.player
              ? `${data.player.firstName} ${data.player.lastName}`
              : getPlayerName(data.playerId)
          }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            placeholder="Search by player"
          />
        </template>
      </Column>
      <Column field="player.team.name" header="Team" sortable style="width: 15%">
        <template #body="{ data }">
          {{ data.player?.team?.name || 'N/A' }}
        </template>
      </Column>
      <Column header="Actions" style="width: 15%">
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
        <span v-if="awardToDelete">
          Are you sure you want to delete the award
          <b>{{ awardToDelete.name }}</b
          >?
        </span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="closeDeleteDialog" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePlayerAward" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePlayerAwardStore } from '@/stores/playerAward'
import { usePlayerStore } from '@/stores/player'

import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dialog from 'primevue/dialog'
import type { PlayerAward } from '@/domain/models/PlayerAward'
import { FilterMatchMode } from 'primevue/api'

const emit = defineEmits(['view', 'edit', 'create', 'deleted'])

const playerAwardStore = usePlayerAwardStore()
const playerStore = usePlayerStore()
const toast = useToast()


const currentYear = new Date().getFullYear()
const loading = computed(() => playerAwardStore.isLoading)
const playerAwards = computed(() => playerAwardStore.awards)

const deleteDialog = ref(false)
const awardToDelete = ref<PlayerAward | null>(null)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  yearAwarded: { value: null, matchMode: FilterMatchMode.EQUALS },
  'player.lastName': { value: null, matchMode: FilterMatchMode.CONTAINS }
})

onMounted(async () => {
  await playerAwardStore.fetchAwards()
  // Load players for displaying names
  if (playerStore.players.length === 0) {
    await playerStore.fetchPlayers()
  }
})

const getPlayerName = (playerId: number): string => {
  const player = playerStore.getPlayerById(playerId)
  return player ? `${player.firstName} ${player.lastName}` : `Player ID: ${playerId}`
}

const confirmDelete = (award: PlayerAward) => {
  awardToDelete.value = award
  deleteDialog.value = true
}

const closeDeleteDialog = () => {
  deleteDialog.value = false
  awardToDelete.value = null
}

const deletePlayerAward = async () => {
  try {
    if (awardToDelete.value && awardToDelete.value.id) {
      await playerAwardStore.deleteAward(awardToDelete.value.id)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `Award was deleted successfully`,
        life: 3000
      })
      emit('deleted', awardToDelete.value.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error deleting the award',
      life: 3000
    })
  } finally {
    closeDeleteDialog()
  }
}
</script>

<style scoped>
.playeraward-list {
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
