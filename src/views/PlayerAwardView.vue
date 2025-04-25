<template>
  <div class="page-container">
    <Card>
      <template #title>
        <div class="page-title">
          <h1>Player Awards Management</h1>
        </div>
      </template>
      <template #content>
        <div v-if="isDetail && awardId">
          <Button
            label="Back to List"
            icon="pi pi-arrow-left"
            class="p-button-secondary mb-3"
            @click="goToList"
          />
          <PlayerAwardView />
        </div>
        <div v-else-if="isCreating">
          <div class="card-header mb-3">
            <h2>Create New Award</h2>
            <Button
              label="Back to List"
              icon="pi pi-arrow-left"
              class="p-button-secondary"
              @click="goToList"
            />
          </div>
          <PlayerAwardForm @save="createPlayerAward" @cancel="goToList" />
        </div>
        <div v-else>
          <PlayerAwardList
            @view="viewPlayerAward"
            @edit="editPlayerAward"
            @create="isCreating = true"
            @deleted="playerAwardDeleted"
          />
        </div>
      </template>
    </Card>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePlayerAwardStore } from '@/stores/playerAward'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import PlayerAwardList from '@/components/playeraward/PlayerAwardList.vue'
import PlayerAwardView from '@/components/playeraward/PlayerAwardView.vue'
import PlayerAwardForm from '@/components/playeraward/PlayerAwardForm.vue'
import type { PlayerAward } from '@/domain/models/PlayerAward'

const router = useRouter()
const route = useRoute()
const playerAwardStore = usePlayerAwardStore()
const toast = useToast()

const isCreating = ref(false)

const awardId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

const isDetail = computed(() => !!awardId.value)

const viewPlayerAward = (id: number) => {
  router.push(`/player-awards/${id}`)
}

const editPlayerAward = (id: number) => {
  router.push(`/player-awards/${id}`)
}

const goToList = () => {
  isCreating.value = false
  router.push('/player-awards')
}

const createPlayerAward = async (playerAward: PlayerAward) => {
  try {
    const newAward = await playerAwardStore.createAward(playerAward)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Award created successfully`,
      life: 3000
    })
    goToList()
    // View the new award
    if (newAward && newAward.id) {
      viewPlayerAward(newAward.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create award',
      life: 3000
    })
  }
}

const playerAwardDeleted = () => {
  // Refresh the player award list
  playerAwardStore.fetchAwards()
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
