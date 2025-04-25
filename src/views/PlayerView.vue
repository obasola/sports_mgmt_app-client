<template>
  <div class="page-container">
    <Card>
      <template #title>
        <div class="page-title">
          <h1>Players Management</h1>
        </div>
      </template>
      <template #content>
        <div v-if="isDetail && playerId">
          <Button
            label="Back to List"
            icon="pi pi-arrow-left"
            class="p-button-secondary mb-3"
            @click="goToList"
          />
          <PlayerView />
        </div>
        <div v-else-if="isCreating">
          <div class="card-header mb-3">
            <h2>Create New Player</h2>
            <Button
              label="Back to List"
              icon="pi pi-arrow-left"
              class="p-button-secondary"
              @click="goToList"
            />
          </div>
          <PlayerForm @save="createPlayer" @cancel="goToList" />
        </div>
        <div v-else>
          <PlayerList @view="viewPlayer" @create="isCreating = true" @deleted="playerDeleted" />
        </div>
      </template>
    </Card>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import PlayerList from '@/components/player/PlayerList.vue'
import PlayerView from '@/components/player/PlayerView.vue'
import PlayerForm from '@/components/player/PlayerForm.vue'
import type { Player } from '@/domain/models/Player'

const router = useRouter()
const route = useRoute()
const playerStore = usePlayerStore()
const toast = useToast()

const isCreating = ref(false)

const playerId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

const isDetail = computed(() => !!playerId.value)

const viewPlayer = (id: number) => {
  router.push(`/players/${id}`)
}

const goToList = () => {
  isCreating.value = false
  router.push('/players')
}

const createPlayer = async (player: Player) => {
  try {
    const newPlayer = await playerStore.createPlayer(player)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Player ${player.firstName} ${player.lastName} created successfully`,
      life: 3000
    })
    goToList()
    // View the new player
    if (newPlayer && newPlayer.id) {
      viewPlayer(newPlayer.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create player',
      life: 3000
    })
  }
}

const playerDeleted = () => {
  // Refresh the player list
  playerStore.fetchPlayers()
}
</script>

<style scoped>
.page-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title h1 {
  margin: 0;
  color: var(--primary-text);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: var(--primary-text);
}
</style>
