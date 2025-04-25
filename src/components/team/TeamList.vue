<template>
  <div class="team-list">
    <DataTable
      :value="teams"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      v-model:filters="filters"
      filterDisplay="menu"
      :loading="loading"
      responsiveLayout="scroll"
      :globalFilterFields="['name', 'city', 'state', 'conference', 'division']"
      class="p-datatable-teams"
    >
      <template #header>
        <div class="table-header">
          <h2>Teams</h2>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </span>
          <Button
            label="Add Team"
            icon="pi pi-plus"
            class="p-button-success ml-2"
            @click="$emit('create')"
          />
        </div>
      </template>

      <template #empty>
        <div class="text-center p-4">No teams found.</div>
      </template>

      <template #loading>
        <div class="text-center p-4">Loading teams...</div>
      </template>

      <Column field="id" header="ID" sortable style="width: 5%"></Column>
      <Column field="name" header="Name" sortable style="width: 15%">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            placeholder="Search by name"
          />
        </template>
      </Column>
      <Column field="city" header="City" sortable style="width: 15%"></Column>
      <Column field="state" header="State" sortable style="width: 10%"></Column>
      <Column field="conference" header="Conference" sortable style="width: 15%">
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="conferenceOptions"
            placeholder="Select a conference"
            class="p-column-filter"
            showClear
          />
        </template>
      </Column>
      <Column field="division" header="Division" sortable style="width: 15%">
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="divisionOptions"
            placeholder="Select a division"
            class="p-column-filter"
            showClear
          />
        </template>
      </Column>
      <Column field="stadium" header="Stadium" sortable style="width: 15%"></Column>
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
              @click="editTeam(data.id)"
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
        <span v-if="teamToDelete">
          Are you sure you want to delete <b>{{ teamToDelete.name }}</b
          >?
        </span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="closeDeleteDialog" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteTeam" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTeamStore } from '@/stores/team'

import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import type { Team } from '@/domain/models/Team'
import { FilterMatchMode } from 'primevue/api'
import { useRouter } from 'vue-router'

const emit = defineEmits(['view', 'edit', 'create', 'deleted'])

const teamStore = useTeamStore()
const toast = useToast()
const router = useRouter()

const conferenceOptions = ref(['AFC', 'NFC'])
const divisionOptions = ref(['North', 'South', 'East', 'West'])

const loading = computed(() => teamStore.isLoading)
const teams = computed(() => teamStore.teams)

const deleteDialog = ref(false)
const teamToDelete = ref<Team | null>(null)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  conference: { value: null, matchMode: FilterMatchMode.EQUALS },
  division: { value: null, matchMode: FilterMatchMode.EQUALS }
})

onMounted(async () => {
  await teamStore.fetchTeams()
})

const confirmDelete = (team: Team) => {
  teamToDelete.value = team
  deleteDialog.value = true
}

const closeDeleteDialog = () => {
  deleteDialog.value = false
  teamToDelete.value = null
}

// Instead of emitting an event, navigate directly with a query parameter
const editTeam = (id: number) => {
  router.push({
    path: `/teams/${id}`,
    query: { edit: 'true' }
  })
}
const deleteTeam = async () => {
  try {
    if (teamToDelete.value && teamToDelete.value.id) {
      await teamStore.deleteTeam(teamToDelete.value.id)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `${teamToDelete.value.name} was deleted successfully`,
        life: 3000
      })
      emit('deleted', teamToDelete.value.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error deleting the team',
      life: 3000
    })
  } finally {
    closeDeleteDialog()
  }
}
</script>

<style scoped>
.team-list {
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
