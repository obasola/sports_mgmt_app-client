<!-- src/views/GameDetail.vue -->
<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import AppLayout from '@/components/ui/AppLayout.vue'
import GameList from '@/components/game/GameList.vue'
import GameReadOnly from '@/components/game/GameReadOnly.vue'
import GameCreateForm from '@/components/game/GameCreateForm.vue'
import GameEditForm from '@/components/game/GameEditForm.vue'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

const gameId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

const mode = computed(() => {
  return (route.query.mode as string) || 'read'
})

onMounted(async () => {
  gameStore.setMode(mode.value as any)
  if (gameId.value) {
    await gameStore.fetchById(gameId.value)
  }
})

watch(
  () => route.query.mode,
  (newMode) => {
    if (newMode) {
      gameStore.setMode(newMode as any)
    }
  }
)

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await gameStore.fetchById(parseInt(newId as string))
    } else {
      gameStore.clearCurrent()
    }
  }
)
</script>

<template>
  <AppLayout>
    <div class="game-detail-view">
      <!-- Show list when no ID -->
      <GameList v-if="!gameId" />

      <!-- Show create form -->
      <GameCreateForm v-else-if="mode === 'create'" />

      <!-- Show edit form -->
      <GameEditForm v-else-if="mode === 'edit'" />

      <!-- Show read-only view -->
      <GameReadOnly v-else />
    </div>
  </AppLayout>
</template>

<style scoped>
.game-detail-view {
  width: 100%;
}
</style>