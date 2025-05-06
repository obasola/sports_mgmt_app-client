<template>
  <div class="draftpick-detail">
    <Card v-if="loading">
      <template #content>
        <ProgressSpinner />
        <div class="loading-text">Loading draft pick data...</div>
      </template>
    </Card>

    <Card v-else-if="error">
      <template #title>Error</template>
      <template #content>
        <div class="error-message">{{ error }}</div>
        <Button label="Go Back" icon="pi pi-arrow-left" @click="$router.back()" class="mt-3" />
      </template>
    </Card>

    <div v-else-if="draftPick">
      <Card>
        <template #title>
          <div class="card-header">
            <h2>
              Draft Pick: Round {{ draftPick.round }}, Pick {{ draftPick.pickNumber }} ({{
                draftPick.draftYear
              }})
            </h2>
            <div class="card-actions">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="startEditing"
                v-tooltip.top="'Edit Draft Pick'"
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
          <DraftPickForm
            v-if="isEditing"
            :draftPick="draftPick"
            @save="saveDraftPick"
            @cancel="cancelEditing"
          />
          <div v-else class="draftpick-info-grid">
            <div class="info-section">
              <h3>Draft Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Year:</label>
                  <span>{{ draftPick.draftYear }}</span>
                </div>
                <div class="info-item">
                  <label>Round:</label>
                  <span>{{ draftPick.round }}</span>
                </div>
                <div class="info-item">
                  <label>Pick Number:</label>
                  <span>{{ draftPick.pickNumber }}</span>
                </div>
                <div class="info-item">
                  <label>Pick From:</label>
                  <span>{{ getTeamName(draftPick.pickFrom) }}</span>
                </div>
                <div class="info-item">
                  <label>Pick To:</label>
                  <span>{{ getTeamName(draftPick.pickTo) }}</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>Selection Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Team:</label>
                  <span>{{ draftPick.team?.name || getTeamName(draftPick.teamId) }}</span>
                </div>
                <div class="info-item">
                  <label>Player:</label>
                  <span>{{
                    draftPick.player
                      ? `${draftPick.playerFirstName} ${draftPick.playerFirstName}`
                      : getPlayerName(draftPick.playerId ? draftPick.playerId : 0)
                  }}</span>
                </div>
                <div class="info-item">
                  <label>Combine Score:</label>
                  <span>{{ formatCombineScore(draftPick.combineScore) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="related-sections mt-4">
            <TabView>
              <TabPanel header="Player Details" v-if="draftPick.player">
                <div class="player-detail-panel">
                  <div class="info-grid">
                    <div class="info-item">
                      <label>Name:</label>
                      <span>{{ draftPick.player.firstName }} {{ draftPick.player.lastName }}</span>
                    </div>
                    <div class="info-item">
                      <label>Position:</label>
                      <span>{{ draftPick.player.position }}</span>
                    </div>
                    <div class="info-item">
                      <label>University:</label>
                      <span>{{ draftPick.player.university }}</span>
                    </div>
                    <div class="info-item">
                      <label>Age:</label>
                      <span>{{ draftPick.player.age }}</span>
                    </div>
                    <div class="info-item">
                      <label>Height:</label>
                      <span>{{ formatHeight(draftPick.player.height) }}</span>
                    </div>
                    <div class="info-item">
                      <label>Weight:</label>
                      <span>{{ formatWeight(draftPick.player.weight) }}</span>
                    </div>
                  </div>
                  <div class="view-more-actions">
                    <Button
                      label="View Full Player Profile"
                      icon="pi pi-user"
                      @click="viewPlayer(draftPick.playerId ? draftPick.playerId : 0)"
                    />
                  </div>
                </div>
              </TabPanel>

              <TabPanel header="Team Details" v-if="draftPick.team">
                <div class="team-detail-panel">
                  <div class="info-grid">
                    <div class="info-item">
                      <label>Name:</label>
                      <span>{{ draftPick.team.name }}</span>
                    </div>
                    <div class="info-item">
                      <label>City:</label>
                      <span>{{ draftPick.team.city }}</span>
                    </div>
                    <div class="info-item">
                      <label>Conference:</label>
                      <span>{{ draftPick.team.conference }}</span>
                    </div>
                    <div class="info-item">
                      <label>Division:</label>
                      <span>{{ draftPick.team.division }}</span>
                    </div>
                    <div class="info-item">
                      <label>Stadium:</label>
                      <span>{{ draftPick.team.stadium }}</span>
                    </div>
                  </div>
                  <div class="view-more-actions">
                    <Button
                      label="View Full Team Profile"
                      icon="pi pi-users"
                      @click="viewTeam(draftPick.teamId)"
                    />
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="empty-state">
      <Card>
        <template #content>
          <div class="empty-message">
            <i class="pi pi-list" style="font-size: 3rem"></i>
            <p>Draft pick not found</p>
            <Button label="Go Back" icon="pi pi-arrow-left" @click="$router.back()" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDraftPickStore } from '@/stores/draftPick'
import { useTeamStore } from '@/stores/team'
import { usePlayerStore } from '@/stores/player'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ProgressSpinner from 'primevue/progressspinner'
import DraftPickForm from '@/components/draftpick/DraftPickForm.vue'
import { formatCombineScore, formatHeight, formatWeight } from '@/utils/formatters'
import type { DraftPick } from '@/domain/models/DraftPick'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const draftPickStore = useDraftPickStore()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()

const draftPick = computed(() => draftPickStore.currentPick)
const loading = computed(() => draftPickStore.isLoading)
const error = computed(() => draftPickStore.error)
const isEditing = ref(false)

const pickId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

watch(pickId, newId => {
  if (newId) {
    loadDraftPick(newId)
  }
})

onMounted(() => {
  if (pickId.value) {
    loadDraftPick(pickId.value)
  }

  // Fetch teams and players for reference
  teamStore.fetchTeams()
  playerStore.fetchPlayers()
})

const loadDraftPick = async (id: number) => {
  try {
    await draftPickStore.fetchPickById(id)

    // If the draft pick has a team and/or player, fetch the details
    if (draftPick.value?.teamId) {
      try {
        await teamStore.fetchTeamById(draftPick.value.teamId)
      } catch (error) {
        console.error('Error loading team:', error)
      }
    }

    if (draftPick.value?.playerId) {
      try {
        await playerStore.fetchPlayerById(draftPick.value.playerId)
      } catch (error) {
        console.error('Error loading player:', error)
      }
    }
  } catch (error) {
    console.error('Error loading draft pick:', error)
  }
}

const getTeamName = (teamId: number): string => {
  const team = teamStore.getTeamById(teamId)
  return team ? team.name : `Team ID: ${teamId}`
}

const getPlayerName = (playerId: number): string => {
  const player = playerStore.getPlayerById(playerId)
  return player ? `${player.firstName} ${player.lastName}` : `Player ID: ${playerId}`
}

const startEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const saveDraftPick = async (updatedDraftPick: DraftPick) => {
  try {
    if (draftPick.value?.id) {
      await draftPickStore.updateDraftPick(draftPick.value.id, updatedDraftPick)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Draft pick updated successfully',
        life: 3000
      })
      isEditing.value = false
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update draft pick',
      life: 3000
    })
  }
}

const viewPlayer = (id: number) => {
  router.push(`/players/${id}`)
}

const viewTeam = (id: number) => {
  router.push(`/teams/${id}`)
}
</script>

<style scoped>
.draftpick-detail {
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

.draftpick-info-grid {
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

.view-more-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.player-detail-panel,
.team-detail-panel {
  padding: 1rem;
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
  .draftpick-info-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
