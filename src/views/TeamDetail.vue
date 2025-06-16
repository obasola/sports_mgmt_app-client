// src/views/TeamDetail.vue

<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTeamStore } from '@/stores/teamStore'
import AppLayout from '@/components/ui/AppLayout.vue'
import TeamList from '@/components/team/TeamList.vue'
import TeamReadOnly from '@/components/team/TeamReadOnly.vue'
import TeamCreateForm from '@/components/team/TeamCreateForm.vue'
import TeamEditForm from '@/components/team/TeamEditForm.vue'

const route = useRoute()
const router = useRouter()
const teamStore = useTeamStore()

const teamId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

const mode = computed(() => {
  return (route.query.mode as string) || 'read'
})

onMounted(async () => {
  teamStore.setMode(mode.value as any)
  if (teamId.value) {
    await teamStore.fetchById(teamId.value)
  }
})

watch(
  () => route.query.mode,
  (newMode) => {
    if (newMode) {
      teamStore.setMode(newMode as any)
    }
  }
)

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await teamStore.fetchById(parseInt(newId as string))
    } else {
      teamStore.clearCurrent()
    }
  }
)
</script>

<template>
  <AppLayout>
    <div class="team-detail-view">
      <!-- Show list when no ID -->
      <TeamList v-if="!teamId" />

      <!-- Show create form -->
      <TeamCreateForm v-else-if="mode === 'create'" />

      <!-- Show edit form -->
      <TeamEditForm v-else-if="mode === 'edit'" />

      <!-- Show read-only view -->
      <TeamReadOnly v-else />
    </div>
  </AppLayout>
</template>

<style scoped>
.team-detail-view {
  width: 100%;
}
</style>