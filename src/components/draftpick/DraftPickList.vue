<template>
  <div class="draftpick-list">
    <DataTable
      :value="draftPicks"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      v-model:filters="filters"
      filterDisplay="menu"
      :loading="loading"
      responsiveLayout="scroll"
      :globalFilterFields="['draftYear', 'round', 'pickNumber', 'team.name', 'player.lastName']"
      class="p-datatable-draftpicks"
    >
      <template #header>
        <div class="table-header">
          <h2>Draft Picks</h2>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </span>
          <Button
            label="Add Draft Pick"
            icon="pi pi-plus"
            class="p-button-success ml-2"
            @click="$emit('create')"
          />
        </div>
      </template>

      <template #empty>
        <div class="text-center p-4">No draft picks found.</div>
      </template>

      <template #loading>
        <div class="text-center p-4">Loading draft picks...</div>
      </template>

      <Column field="id" header="ID" sortable style="width: 5%"></Column>
      <Column field="draftYear" header="Year" sortable style="width: 10%">
        <template #filter="{ filterModel, filterCallback }">
          <InputNumber
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            placeholder="Year"
            :min="2000"
            :max="currentYear"
          />
        </template>
      </Column>
      <Column field="round" header="Round" sortable style="width: 10%">
        <template #filter="{ filterModel, filterCallback }">
          <InputNumber
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            placeholder="Round"
            :min="1"
            :max="7"
          />
        </template>
      </Column>
      <Column field="pickNumber" header="Pick #" sortable style="width: 10%">
        <template #filter="{ filterModel, filterCallback }">
          <InputNumber
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            placeholder="Pick #"
            :min="1"
            :max="300"
          />
        </template>
      </Column>
      <Column field="team.name" header="Team" sortable style="width: 15%">
        <template #body="{ data }">
          {{ data.team?.name || 'N/A' }}
        </template>
      </Column>
      <Column field="player.lastName" header="Player" sortable style="width: 20%">
        <template #body="{ data }">
          {{ data.player ? `${data.player.firstName} ${data.player.lastName}` : 'N/A' }}
        </template>
      </Column>
      <Column field="combineScore" header="Combine Score" sortable style="width: 15%">
        <template #body="{ data }">
          {{ formatCombineScore(data.combineScore) }}
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
        <span v-if="pickToDelete">
          Are you sure you want to delete the draft pick
          <b>{{ getPickDescription(pickToDelete) }}</b
          >?
        </span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="closeDeleteDialog" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteDraftPick" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDraftPickStore } from '@/stores/draftPick'
import { useTeamStore } from '@/stores/team'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dialog from 'primevue/dialog'
import type { DraftPick } from '@/domain/models/DraftPick'
import { FilterMatchMode } from 'primevue/api'
import { formatCombineScore } from '@/utils/formatters'

const emit = defineEmits(['view', 'edit', 'create', 'deleted'])

const draftPickStore = useDraftPickStore()
const teamStore = useTeamStore()

const toast = useToast()


const currentYear = new Date().getFullYear()
const loading = computed(() => draftPickStore.isLoading)
const draftPicks = computed(() => draftPickStore.picks)

const deleteDialog = ref(false)
const pickToDelete = ref<DraftPick | null>(null)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  draftYear: { value: null, matchMode: FilterMatchMode.EQUALS },
  round: { value: null, matchMode: FilterMatchMode.EQUALS },
  pickNumber: { value: null, matchMode: FilterMatchMode.EQUALS }
})

onMounted(async () => {
  await draftPickStore.fetchDraftPicks()
  // Load teams and players for displaying names
  if (teamStore.teams.length === 0) {
    await teamStore.fetchTeams()
  }
})

const getPickDescription = (pick: DraftPick): string => {
  let description = `Round ${pick.round}, Pick ${pick.pickNumber} (${pick.draftYear})`
  if (pick.player) {
    description += ` - ${pick.player.firstName} ${pick.player.lastName}`
  }
  return description
}

const confirmDelete = (pick: DraftPick) => {
  pickToDelete.value = pick
  deleteDialog.value = true
}

const closeDeleteDialog = () => {
  deleteDialog.value = false
  pickToDelete.value = null
}

const deleteDraftPick = async () => {
  try {
    if (pickToDelete.value && pickToDelete.value.id) {
      await draftPickStore.deleteDraftPick(pickToDelete.value.id)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `Draft pick was deleted successfully`,
        life: 3000
      })
      emit('deleted', pickToDelete.value.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error deleting the draft pick',
      life: 3000
    })
  } finally {
    closeDeleteDialog()
  }
}
</script>

<style scoped>
.draftpick-list {
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
