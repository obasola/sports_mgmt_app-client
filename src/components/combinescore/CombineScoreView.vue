<template>
  <div class="combinescore-detail">
    <Card v-if="loading">
      <template #content>
        <ProgressSpinner />
        <div class="loading-text">Loading combine score data...</div>
      </template>
    </Card>

    <Card v-else-if="error">
      <template #title>Error</template>
      <template #content>
        <div class="error-message">{{ error }}</div>
        <Button label="Go Back" icon="pi pi-arrow-left" @click="$router.back()" class="mt-3" />
      </template>
    </Card>

    <div v-else-if="combineScore">
      <Card>
        <template #title>
          <div class="card-header">
            <h2>
              Combine Score:
              {{
                combineScore.player
                  ? `${combineScore.player.firstName} ${combineScore.player.lastName}`
                  : getPlayerName(combineScore.playerId)
              }}
            </h2>
            <div class="card-actions">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="startEditing"
                v-tooltip.top="'Edit Combine Score'"
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
          <CombineScoreForm
            v-if="isEditing"
            :combineScore="combineScore"
            @save="saveCombineScore"
            @cancel="cancelEditing"
          />
          <div v-else>
            <div class="player-info">
              <h3>Player Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Name:</label>
                  <span>{{
                    combineScore.player
                      ? `${combineScore.player.firstName} ${combineScore.player.lastName}`
                      : getPlayerName(combineScore.playerId)
                  }}</span>
                </div>
                <div class="info-item">
                  <label>Position:</label>
                  <span>{{ combineScore.player?.position || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <label>University:</label>
                  <span>{{ combineScore.player?.university || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <label>Team:</label>
                  <span>{{ combineScore.player?.team?.name || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="combinescore-info">
              <h3>Combine Results</h3>
              <div class="performance-metrics">
                <div class="metric-card">
                  <div class="metric-header">40-Yard Dash</div>
                  <div class="metric-value">{{ combineScore.fortyTime }} seconds</div>
                </div>
                <div class="metric-card">
                  <div class="metric-header">10 Yard</div>
                  <div class="metric-value">{{ combineScore.tenYardSplit }} reps</div>
                </div>
                <div class="metric-card">
                  <div class="metric-header">Vertical Jump</div>
                  <div class="metric-value">{{ combineScore.verticalLeap }} inches</div>
                </div>
                <div class="metric-card">
                  <div class="metric-header">Broad Jump</div>
                  <div class="metric-value">{{ combineScore.broadJump }} inches</div>
                </div>
                <div class="metric-card">
                  <div class="metric-header">3-Cone Drill</div>
                  <div class="metric-value">{{ combineScore.threeCone }} seconds</div>
                </div>
                <div class="metric-card">
                  <div class="metric-header">20-Yard Shuttle</div>
                  <div class="metric-value">{{ combineScore.twentyYardShuttle }} seconds</div>
                </div>
              </div>
            </div>

            <div v-if="combineScore.player" class="view-more-actions">
              <Button
                label="View Player Profile"
                icon="pi pi-user"
                @click="viewPlayer(combineScore.playerId)"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="empty-state">
      <Card>
        <template #content>
          <div class="empty-message">
            <i class="pi pi-stopwatch" style="font-size: 3rem"></i>
            <p>Combine score not found</p>
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
import { useCombineScoreStore } from '@/stores/combineScore'
import { usePlayerStore } from '@/stores/player'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import CombineScoreForm from '@/components/combinescore/CombineScoreForm.vue'
import type { CombineScore } from '@/domain/models/CombineScore'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const combineScoreStore = useCombineScoreStore()
const playerStore = usePlayerStore()

const combineScore = computed(() => combineScoreStore.currentScore)
const loading = computed(() => combineScoreStore.isLoading)
const error = computed(() => combineScoreStore.error)
const isEditing = ref(false)

const scoreId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

watch(scoreId, newId => {
  if (newId) {
    loadCombineScore(newId)
  }
})

onMounted(() => {
  if (scoreId.value) {
    loadCombineScore(scoreId.value)
  }

  // Fetch players for reference
  playerStore.fetchPlayers()
})

const loadCombineScore = async (id: number) => {
  try {
    await combineScoreStore.fetchScoreById(id)

    // If the combine score has a player, fetch the player details
    if (combineScore.value?.playerId) {
      try {
        await playerStore.fetchPlayerById(combineScore.value.playerId)
      } catch (error) {
        console.error('Error loading player:', error)
      }
    }
  } catch (error) {
    console.error('Error loading combine score:', error)
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

const saveCombineScore = async (updatedScore: CombineScore) => {
  try {
    if (combineScore.value?.id) {
      await combineScoreStore.updateCombineScore(combineScore.value.id, updatedScore)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Combine score updated successfully',
        life: 3000
      })
      isEditing.value = false
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update combine score',
      life: 3000
    })
  }
}

const viewPlayer = (id: number) => {
  router.push(`/players/${id}`)
}
</script>

<style scoped>
.combinescore-detail {
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

.player-info,
.combinescore-info {
  margin-bottom: 2rem;
}

.player-info h3,
.combinescore-info h3 {
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

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.metric-card {
  background-color: var(--secondary-bg);
  color: var(--light-text);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
}

.metric-header {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.metric-value {
  font-size: 1.5rem;
}

.view-more-actions {
  display: flex;
  justify-content: flex-end;
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
  .info-grid {
    grid-template-columns: 1fr;
  }

  .performance-metrics {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .performance-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
