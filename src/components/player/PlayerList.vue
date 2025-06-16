<!-- src/components/player/PlayerList.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const playerStore = usePlayerStore()
const router = useRouter()

onMounted(() => {
  playerStore.fetchAll()
})

const viewPlayer = (id: number) => {
  router.push(`/players/${id}?mode=read`)
}

const editPlayer = (id: number) => {
  router.push(`/players/${id}?mode=edit`)
}

const createPlayer = () => {
  router.push('/players?mode=create')
}

const deletePlayer = async (id: number) => {
  if (confirm('Are you sure you want to delete this player?')) {
    await playerStore.remove(id)
  }
}
</script>

<template>
  <div class="player-list">
    <div class="list-header">
      <h2>Players</h2>
      <Button
        @click="createPlayer"
        label="Create Player"
        icon="pi pi-plus"
        class="p-button-success"
      />
    </div>

    <DataTable
      :value="playerStore.players"
      :loading="playerStore.loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll"
    >
      <Column field="firstName" header="First Name" sortable />
      <Column field="lastName" header="Last Name" sortable />
      <Column field="position" header="Position" sortable />
      <Column field="team.name" header="Team" sortable />
      <Column field="university" header="University" sortable />
      <Column header="Actions">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button
              @click="viewPlayer(data.id)"
              icon="pi pi-eye"
              class="p-button-info p-button-sm"
              v-tooltip="'View'"
            />
            <Button
              @click="editPlayer(data.id)"
              icon="pi pi-pencil"
              class="p-button-warning p-button-sm"
              v-tooltip="'Edit'"
            />
            <Button
              @click="deletePlayer(data.id)"
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
.player-list {
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