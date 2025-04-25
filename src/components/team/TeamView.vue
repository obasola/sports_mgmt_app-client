<template>
  <div class="team-detail">
    <Card v-if="loading">
      <template #content>
        <ProgressSpinner />
        <div class="loading-text">Loading team data...</div>
      </template>
    </Card>

    <Card v-else-if="error">
      <template #title>Error</template>
      <template #content>
        <div class="error-message">{{ error }}</div>
        <Button label="Go Back" icon="pi pi-arrow-left" @click="$router.back()" class="mt-3" />
      </template>
    </Card>

    <div v-else-if="team">
      <Card>
        <template #title>
          <div class="card-header">
            <h2>{{ team.name }}</h2>
            <div class="card-actions">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="startEditing"
                v-tooltip.top="'Edit Team'" :disabled="isEditing" />
              <Button icon="pi pi-arrow-left" class="p-button-rounded p-button-secondary" @click="$router.back()"
                v-tooltip.top="'Go Back'" />
            </div>
          </div>
        </template>

      </Card>
    </div>

    <div v-else class="empty-state">
      <Card>
        <template #content>
          <div class="empty-message">
            <i class="pi pi-users" style="font-size: 3rem"></i>
            <p>Team not found</p>
            <Button label="Go Back" icon="pi pi-arrow-left" @click="$router.back()" />
          </div>
        </template>
      </Card>
    </div>

    <div class="container">
      <Accordion :multiple="true">
        <AccordionTab header="Players on this Team">
          <TeamPlayers v-if="teamId" :team-id="teamId" />
        </AccordionTab>
        <AccordionTab header="Team Schedule">
          <ScheduleList v-if="teamId" :team-id="teamId" />
        </AccordionTab>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

import { useTeamStore } from '@/stores/team'
import { usePlayerStore } from '@/stores/player'
import { useScheduleStore } from '@/stores/schedule'
import { useDraftPickStore } from '@/stores/draftPick'

import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import TeamPlayers from '../player/TeamPlayers.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
//const router = useRouter()
//const toast = useToast()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()
const scheduleStore = useScheduleStore()
const draftPickStore = useDraftPickStore()

const team = computed(() => teamStore.currentTeam)
const loading = computed(() => teamStore.isLoading)
const error = computed(() => teamStore.error)
const isEditing = ref(false)

const teamId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

watch(teamId, newId => {
  if (newId) {
    loadTeam(newId)
  }
})

onMounted(() => {
  if (teamId.value) {
    loadTeam(teamId.value)

    // Check if edit mode should be activated
    if (route.query.edit === 'true') {
      isEditing.value = true
    }
  }
})

// Also watch for route changes to handle edit parameter
watch(route, newRoute => {
  if (newRoute.query.edit === 'true') {
    isEditing.value = true
  }
})

const loadTeam = async (id: number) => {
  try {
    await teamStore.fetchTeamById(id)

    // If the team has players, fetch related data
    if (team.value && team.value.id) {
      try {
        await playerStore.fetchPlayersByTeamId(team.value.id)
        await scheduleStore.fetchSchedulesByTeamId(team.value.id)
        await draftPickStore.fetchPicksByTeamId(team.value.id)
      } catch (error) {
        console.error('Error loading related data:', error)
      }
    }
  } catch (error) {
    console.error('Error loading team:', error)
  }
}

const startEditing = () => {
  isEditing.value = true
}
/*
const cancelEditing = () => {
  isEditing.value = false
}

const saveTeam = async (updatedTeam: Team) => {
  try {
    if (team.value?.id) {
      await teamStore.updateTeam(team.value.id, updatedTeam)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Team updated successfully',
        life: 3000
      })
      isEditing.value = false
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update team',
      life: 3000
    })
  }
}

const viewPlayer = (id: number) => {
  router.push(`/players/${id}`)
}

const viewSchedule = (id: number) => {
  router.push(`/schedules/${id}`)
}

const viewDraftPick = (id: number) => {
  router.push(`/draft-picks/${id}`)
}
  */
</script>

<style scoped>
.team-detail {
  max-width: 1200px;
  margin: 0 auto;
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

.team-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--primary-text);
  border-bottom: 1px solid var(--primary-text);
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: var(--secondary-text);
}

.related-sections {
  margin-top: 2rem;
}

.empty-message,
.loading-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.empty-message i,
.error-message i {
  margin-bottom: 1rem;
  color: var(--accent);
}

.error-message {
  color: var(--secondary-text);
  text-align: center;
  padding: 1rem;
}

@media (max-width: 768px) {
  .team-info-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
