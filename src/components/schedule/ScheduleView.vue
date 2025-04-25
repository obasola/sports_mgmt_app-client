<template>
  <div class="schedule-detail">
    <Card v-if="loading">
      <template #content>
        <ProgressSpinner />
        <div class="loading-text">Loading game data...</div>
      </template>
    </Card>

    <Card v-else-if="error">
      <template #title>Error</template>
      <template #content>
        <div class="error-message">{{ error }}</div>
        <Button label="Go Back" icon="pi pi-arrow-left" @click="$router.back()" class="mt-3" />
      </template>
    </Card>

    <div v-else-if="schedule">
      <Card>
        <template #title>
          <div class="card-header">
            <h2>Game Details - Week {{ schedule.scheduleWeek }}</h2>
            <div class="card-actions">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="startEditing"
                v-tooltip.top="'Edit Game'"
              />
              <Button
                icon="pi pi-arrow-left"
                class="p-button-rounded p-button-secondary"
                @click="$router.back()"
                v-tooltip.top="'Go Back'"
              />
            </div>
          </div>
        </template>
        <template #content>
          <ScheduleForm
            v-if="isEditing"
            :schedule="schedule"
            @save="saveSchedule"
            @cancel="cancelEditing"
          />
          <div v-else class="schedule-info-grid">
            <div class="info-section">
              <h3>Game Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Date:</label>
                  <span>{{ formatDate(schedule.gameDate) }}</span>
                </div>
                <div class="info-item">
                  <label>Week:</label>
                  <span>{{ schedule.scheduleWeek }}</span>
                </div>
                <div class="info-item">
                  <label>Location:</label>
                  <span>{{ schedule.gameLocation }}</span>
                </div>
                <div class="info-item">
                  <label>City:</label>
                  <span>{{ schedule.gameCity }}</span>
                </div>
                <div class="info-item">
                  <label>State/Province:</label>
                  <span>{{ schedule.gameStateProvince }}</span>
                </div>
                <div class="info-item">
                  <label>Country:</label>
                  <span>{{ schedule.gameCountry }}</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>Team & Result Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Home Team:</label>
                  <span>{{ homeTeam ? homeTeam.name : 'Loading...' }}</span>
                </div>
                <div class="info-item">
                  <label>Away Team:</label>
                  <span>{{ awayTeam ? awayTeam.name : 'Loading...' }}</span>
                </div>
                <div class="info-item">
                  <label>Home/Away Status:</label>
                  <span>{{ schedule.homeOrAway }}</span>
                </div>
                <div class="info-item">
                  <label>Away Team Conference:</label>
                  <span>{{ schedule.oppTeamConference }}</span>
                </div>
                <div class="info-item">
                  <label>Away Team Division:</label>
                  <span>{{ schedule.oppTeamDivision }}</span>
                </div>
                <div class="info-item">
                  <label>Result:</label>
                  <span>{{ schedule.wonLostFlag }}</span>
                </div>
                <div class="info-item">
                  <label>Score:</label>
                  <span>{{
                    schedule.teamScore !== undefined && schedule.oppTeamScore !== undefined
                      ? `${schedule.teamScore} - ${schedule.oppTeamScore}`
                      : 'TBD'
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="empty-state">
      <Card>
        <template #content>
          <div class="empty-message">
            <i class="pi pi-calendar" style="font-size: 3rem"></i>
            <p>Game not found</p>
            <Button label="Go Back" icon="pi pi-arrow-left" @click="$router.back()" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useScheduleStore } from '@/stores/schedule'
import { useTeamStore } from '@/stores/team'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import ScheduleForm from '@/components/schedule/ScheduleForm.vue'
import { formatDate } from '@/utils/formatters'
import type { Schedule } from '@/domain/models/Schedule'

const route = useRoute()

const toast = useToast()
const scheduleStore = useScheduleStore()
const teamStore = useTeamStore()

const schedule = computed(() => scheduleStore.currentSchedule)
const loading = computed(() => scheduleStore.isLoading || teamStore.isLoading)
const error = computed(() => scheduleStore.error)
const isEditing = ref(false)

const homeTeam = computed(() => {
  if (schedule.value?.teamId) {
    let nbr = schedule.value.teamId;
    return teamStore.getTeamById(nbr)
  }
  return null
})

const awayTeam = computed(() => {
  if (schedule.value?.teamId) {
    return teamStore.getTeamById(schedule.value.teamId)
  }
  return null
})

const scheduleId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

watch(scheduleId, newId => {
  if (newId) {
    loadSchedule(newId)
  }
})

onMounted(() => {
  if (scheduleId.value) {
    loadSchedule(scheduleId.value)
  }

  // Fetch all teams
  teamStore.fetchTeams()
})

const loadSchedule = async (id: number) => {
  try {
    await scheduleStore.fetchScheduleById(id)
  } catch (error) {
    console.error('Error loading schedule:', error)
  }
}

const startEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const saveSchedule = async (updatedSchedule: Schedule) => {
  try {
    if (schedule.value?.id) {
      await scheduleStore.updateSchedule(schedule.value.id, updatedSchedule)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Game updated successfully',
        life: 3000
      })
      isEditing.value = false
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update game',
      life: 3000
    })
  }
}
</script>

<style scoped>
.schedule-detail {
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

.schedule-info-grid {
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
  .schedule-info-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
