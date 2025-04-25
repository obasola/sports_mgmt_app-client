<template>
  <div class="page-container">
    <Card>
      <template #title>
        <div class="page-title">
          <h1>Teams Management</h1>
        </div>
      </template>
      <template #content>
        <div v-if="isDetail && teamId">
          <Button
            label="Back to List"
            icon="pi pi-arrow-left"
            class="p-button-secondary mb-3"
            @click="goToList"
          />
          <TeamView />
        </div>
        <div v-else-if="isCreating">
          <div class="card-header mb-3">
            <h2>Create New Team</h2>
            <Button
              label="Back to List"
              icon="pi pi-arrow-left"
              class="p-button-secondary"
              @click="goToList"
            />
          </div>
          <TeamForm @save="createTeam" @cancel="goToList" />
        </div>
        <div v-else>
          <TeamList @view="viewTeam" @create="isCreating = true" @deleted="teamDeleted" />
        </div>
      </template>
    </Card>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTeamStore } from '@/stores/team'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import TeamList from '@/components/team/TeamList.vue'
import TeamView from '@/components/team/TeamView.vue'
import TeamForm from '@/components/team/TeamForm.vue'
import type { Team } from '@/domain/models/Team'

const router = useRouter()
const route = useRoute()
const teamStore = useTeamStore()
const toast = useToast()

const isCreating = ref(false)

const teamId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

const isDetail = computed(() => !!teamId.value)

const viewTeam = (id: number) => {
  router.push(`/teams/${id}`)
}

const goToList = () => {
  isCreating.value = false
  router.push('/teams')
}

const createTeam = async (team: Team) => {
  try {
    const newTeam = await teamStore.createTeam(team)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Team ${team.name} created successfully`,
      life: 3000
    })
    goToList()
    // View the new team
    if (newTeam && newTeam.id) {
      viewTeam(newTeam.id)
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create team',
      life: 3000
    })
  }
}

const teamDeleted = () => {
  // Refresh the team list
  teamStore.fetchTeams()
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
