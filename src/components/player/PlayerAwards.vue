<template>
  <div class="playeraward-detail">
    <Card v-if="loading">
      <template #content>
        <ProgressSpinner />
        <div class="loading-text">Loading award data...</div>
      </template>
    </Card>

    <Card v-else-if="error">
      <template #title>Error</template>
      <template #content>
        <div class="error-message">{{ error }}</div>
        <Button label="Go Back" icon="pi pi-arrow-left" @click="$router.back()" class="mt-3" />
      </template>
    </Card>

    <div v-else-if="playerAward">
      <Card>
        <template #title>
          <div class="card-header">
            <h2>{{ playerAward.name }} ({{ playerAward.yearAwarded }})</h2>
            <div class="card-actions">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="startEditing"
                v-tooltip.top="'Edit Award'"
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
          <PlayerAwardForm
            v-if="isEditing"
            :playerAward="playerAward"
            @save="savePlayerAward"
            @cancel="cancelEditing"
          />
          <div v-else class="playeraward-info-grid">
            <div class="info-section">
              <h3>Award Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Award Name:</label>
                  <span>{{ playerAward.name }}</span>
                </div>
                <div class="info-item">
                  <label>Year Awarded:</label>
                  <span>{{ playerAward.yearAwarded }}</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>Player Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Player:</label>
                  <span>{{
                    playerAward.player
                      ? `${playerAward.player.firstName} ${playerAward.player.lastName}`
                      : getPlayerName(playerAward.playerId)
                  }}</span>
                </div>
                <div class="info-item">
                  <label>Position:</label>
                  <span>{{ playerAward.player?.position || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <label>Team:</label>
                  <span>{{ playerAward.player?.team?.name || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="related-sections mt-4">
            <TabView v-if="playerAward.player">
              <TabPanel header="Player Details">
                <div class="player-detail-panel">
                  <div class="info-grid">
                    <div class="info-item">
                      <label>Name:</label>
                      <span
                        >{{ playerAward.player.firstName }} {{ playerAward.player.lastName }}</span
                      >
                    </div>
                    <div class="info-item">
                      <label>Position:</label>
                      <span>{{ playerAward.player.position }}</span>
                    </div>
                    <div class="info-item">
                      <label>University:</label>
                      <span>{{ playerAward.player.university }}</span>
                    </div>
                    <div class="info-item">
                      <label>Age:</label>
                      <span>{{ playerAward.player.age }}</span>
                    </div>
                    <div class="info-item">
                      <label>Year Entered League:</label>
                      <span>{{ playerAward.player.yearEnteredLeague }}</span>
                    </div>
                    <div class="info-item">
                      <label>Team:</label>
                      <span>{{ playerAward.player.team?.name || 'N/A' }}</span>
                    </div>
                  </div>
                  <div class="view-more-actions">
                    <Button
                      label="View Full Player Profile"
                      icon="pi pi-user"
                      @click="viewPlayer(playerAward.playerId)"
                    />
                  </div>
                </div>
              </TabPanel>

              <TabPanel header="Player Awards" v-if="playerAwards.length > 0">
                <DataTable :value="playerAwards" responsiveLayout="scroll">
                  <Column field="name" header="Award Name" sortable></Column>
                  <Column field="yearAwarded" header="Year Awarded" sortable></Column>
                  <Column header="Actions">
                    <template #body="slotProps">
                      <Button
                        icon="pi pi-eye"
                        class="p-button-text p-button-rounded p-button-info"
                        @click="viewPlayerAward(slotProps.data.id)"
                        v-if="slotProps.data.id !== playerAward.id"
                      />
                    </template>
                  </Column>
                </DataTable>
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
            <i class="pi pi-trophy" style="font-size: 3rem"></i>
            <p>Award not found</p>
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
import { usePlayerAwardStore } from '@/stores/playerAward'
import { usePlayerStore } from '@/stores/player'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ProgressSpinner from 'primevue/progressspinner'
import PlayerAwardForm from '@/components/playeraward/PlayerAwardForm.vue'
import type { PlayerAward } from '@/domain/models/PlayerAward'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const playerAwardStore = usePlayerAwardStore()
const playerStore = usePlayerStore()

const currentPlayerId = ref<number | null>(null)

const playerAward =
  playerStore.currentPlayer && playerStore.currentPlayer.awards
    ? playerStore.currentPlayer.awards[0]
    : null
const loading = computed(() => playerAwardStore.isLoading)
const error = computed(() => playerAwardStore.error)
const isEditing = ref(false)
currentPlayerId.value = parseInt(route.params.playerId as string, 10)
// Get all awards for the current player to display in the awards tab
const playerAwards = computed(() => {
  if (currentPlayerId.value !== null) {
    return playerAwardStore.getAwardsByPlayerId(currentPlayerId.value)
  }
  return []
})

const awardId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

watch(awardId, newId => {
  if (newId) {
    loadPlayerAward(newId)
  }
})

onMounted(() => {
  if (awardId.value) {
    loadPlayerAward(awardId.value)
  }

  // Fetch all player awards and players for reference
  playerAwardStore.fetchAwards()
  playerStore.fetchPlayers()
})

const loadPlayerAward = async (id: number) => {
  try {
    await playerAwardStore.fetchAwardById(id)

    // If the award has a player, fetch the player details
    if (playerAward && playerAward.playerId) {
      try {
        await playerStore.fetchPlayerById(playerAward.playerId)

        // Also fetch other awards for this player
        await playerAwardStore.fetchAwardsByPlayerId(playerAward.playerId)
      } catch (error) {
        console.error('Error loading player:', error)
      }
    }
  } catch (error) {
    console.error('Error loading player award:', error)
  }
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

const savePlayerAward = async (updatedAward: PlayerAward) => {
  try {
    if (playerAward && playerAward.id) {
      await playerAwardStore.updateAward(playerAward.id, updatedAward)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Award updated successfully',
        life: 3000
      })
      isEditing.value = false
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update award',
      life: 3000
    })
  }
}

const viewPlayer = (id: number) => {
  router.push(`/players/${id}`)
}

const viewPlayerAward = (id: number) => {
  router.push(`/player-awards/${id}`)
}
</script>

<style scoped>
.playeraward-detail {
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

.playeraward-info-grid {
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

.player-detail-panel {
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
  .playeraward-info-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
