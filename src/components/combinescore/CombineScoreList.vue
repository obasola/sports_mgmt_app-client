<template>
  <div class="combinescore-list">
    <DataTable
      :value="combineScores"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      v-model:filters="filters"
      filterDisplay="menu"
      :loading="loading"
      responsiveLayout="scroll"
      :globalFilterFields="['player.lastName', 'player.firstName', 'player.position']"
      class="p-datatable-combinescores"
    >
      <template #header>
        <div class="table-header">
          <h2>Combine Scores</h2>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </span>
          <Button
            label="Add Combine Score"
            icon="pi pi-plus"
            class="p-button-success ml-2"
            @click="$emit('create')"
          />
        </div>
      </template>

      <template #empty>
        <div class="text-center p-4">No combine scores found.</div>
      </template>

      <template #loading>
        <div class="text-center p-4">Loading combine scores...</div>
      </template>

      <Column field="id" header="ID" sortable style="width: 5%"></Column>
      <Column field="player.lastName" header="Player" sortable style="width: 15%">
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
      <Column field="player.position" header="Position" sortable style="width: 10%">
        <template #body="{ data }">
          {{ data.player?.position || 'N/A' }}
        </template>
      </Column>
      <Column field="fortyTime" header="40-Yard (s)" sortable style="width: 10%"></Column>
      <Column field="benchPressReps" header="Bench Reps" sortable style="width: 10%"></Column>
      <Column field="verticalLeap" header="Vertical (in)" sortable style="width: 10%"></Column>
      <Column field="broadJump" header="Broad Jump (in)" sortable style="width: 10%"></Column>
      <Column field="threeCone" header="3-Cone (s)" sortable style="width: 10%"></Column>
      <Column
        field="twentyYardShuttle"
        header="20yd Shuttle (s)"
        sortable
        style="width: 10%"
      ></Column>
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
        <span v-if="scoreToDelete">
          Are you sure you want to delete the combine score for
          <b>{{
            scoreToDelete.player
              ? `${scoreToDelete.player.firstName} ${scoreToDelete.player.lastName}`
              : getPlayerName(scoreToDelete.playerId)
          }}</b
          >?
        </span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="closeDeleteDialog" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteCombineScore" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCombineScoreStore } from '@/stores/combineScore'
import { usePlayerStore } from '@/stores/player'

import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import type { CombineScore } from '@/domain/models/CombineScore'
import { FilterMatchMode } from 'primevue/api'

const emit = defineEmits(['view', 'edit', 'create', 'deleted'])

const combineScoreStore = useCombineScoreStore()
const playerStore = usePlayerStore()
const toast = useToast()

const loading = computed(() => combineScoreStore.isLoading)
const combineScores = computed(() => combineScoreStore.scores)

const deleteDialog = ref(false)
const scoreToDelete = ref<CombineScore | null>(null)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'player.lastName': { value: null, matchMode: FilterMatchMode.CONTAINS },
  'player.position': { value: null, matchMode: FilterMatchMode.EQUALS }
})

onMounted(async () => {
  await combineScoreStore.fetchCombineScores()
  // Load players for displaying names
  if (playerStore.players.length === 0) {
    await playerStore.fetchPlayers()
  }
})

const getPlayerName = (playerId: number): string => {
  const player = playerStore.getPlayerById(playerId)
  return player ? `${player.firstName} ${player.lastName}` : `Player ID: ${playerId}`
}

const confirmDelete = (score: CombineScore) => {
  scoreToDelete.value = score
  deleteDialog.value = true
}

const closeDeleteDialog = () => {
  deleteDialog.value = false
  scoreToDelete.value = null
}

const deleteCombineScore = async () => {
  try {
    if (scoreToDelete.value && scoreToDelete.value.id) {
      await combineScoreStore.deleteCombineScore(scoreToDelete.value.id)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `Combine score was deleted successfully`,
        life: 3000
      })
      emit('deleted', scoreToDelete.value.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error deleting the combine score',
      life: 3000
    })
  } finally {
    closeDeleteDialog()
  }
}
</script>

<style scoped>
.combinescore-list {
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
