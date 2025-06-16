// src/components/team/TeamList.vue

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeamStore } from '@/stores/teamStore'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const teamStore = useTeamStore()
const router = useRouter()

onMounted(() => {
  teamStore.fetchAll()
})

const viewTeam = (id: number) => {
  router.push(`/teams/${id}?mode=read`)
}

const editTeam = (id: number) => {
  router.push(`/teams/${id}?mode=edit`)
}

const createTeam = () => {
  router.push('/teams?mode=create')
}

const deleteTeam = async (id: number) => {
  if (confirm('Are you sure you want to delete this team?')) {
    await teamStore.remove(id)
  }
}
</script>

<template>
  <div class="team-list">
    <div class="list-header">
      <h2>Teams</h2>
      <Button
        @click="createTeam"
        label="Create Team"
        icon="pi pi-plus"
        class="p-button-success"
      />
    </div>

    <DataTable
      :value="teamStore.teams"
      :loading="teamStore.loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll"
      sortField="name"
      :sortOrder="1"
    >
      <Column field="name" header="Team Name" sortable />
      <Column field="city" header="City" sortable />
      <Column field="state" header="State" sortable />
      <Column field="conference" header="Conference" sortable />
      <Column field="division" header="Division" sortable />
      <Column field="stadium" header="Stadium" sortable />
      <Column field="country" header="Country" sortable />
      
      <Column header="Actions">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button
              @click="viewTeam(data.id)"
              icon="pi pi-eye"
              class="p-button-info p-button-sm"
              v-tooltip="'View'"
            />
            <Button
              @click="editTeam(data.id)"
              icon="pi pi-pencil"
              class="p-button-warning p-button-sm"
              v-tooltip="'Edit'"
            />
            <Button
              @click="deleteTeam(data.id)"
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
.team-list {
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