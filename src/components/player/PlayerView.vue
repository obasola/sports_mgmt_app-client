<template>
  <div class="player-detail">
    <Card v-if="loading">
      <template #content>
        <ProgressSpinner />
        <div class="loading-text">Loading player data...</div>
      </template>
    </Card>

    <Card v-else-if="error">
      <template #title>Error</template>
      <template #content>
        <div class="error-message">{{ error }}</div>
        <Button label="Go Back" icon="pi pi-arrow-left" @click="$router.back()" class="mt-3" />
      </template>
    </Card>

    <div v-else-if="player">
      <Card>
        <template #title>
          <div class="card-header">
            <h2>{{ player.firstName }} {{ player.lastName }} - {{ player.position }}</h2>
            <div class="card-actions">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="startEditing"
                v-tooltip.top="'Edit Player'"
                :disabled="isEditing"
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
          <PlayerForm
            v-if="isEditing"
            :player="player"
            @save="savePlayer"
            @cancel="cancelEditing"
          />
          <div v-else class="player-info-grid">
            <div class="info-section">
              <h3>Personal Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Age:</label>
                  <span>{{ player.age }} years</span>
                </div>
                <div class="info-item">
                  <label>Height:</label>
                  <span>{{ formatHeight(player.height) }}</span>
                </div>
                <div class="info-item">
                  <label>Weight:</label>
                  <span>{{ formatWeight(player.weight) }}</span>
                </div>
                <div class="info-item">
                  <label>Hand Size:</label>
                  <span>{{ player.handSize }} inches</span>
                </div>
                <div class="info-item">
                  <label>Arm Length:</label>
                  <span>{{ player.armLength }} inches</span>
                </div>
                <div class="info-item">
                  <label>Home City:</label>
                  <span>{{ player.homeCity }}, {{ player.homeState }}</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>Career Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>University:</label>
                  <span>{{ player.university }}</span>
                </div>
                <div class="info-item">
                  <label>Position:</label>
                  <span>{{ player.position }}</span>
                </div>
                <div class="info-item">
                  <label>Year Entered League:</label>
                  <span>{{ formatYearOnly(player.yearEnteredLeague) }}</span>
                </div>
                <div class="info-item">
                  <label>Team:</label>
                  <span>{{ player.team?.name || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="related-sections mt-4">
            <TabView>
              <TabPanel header="Draft Information" v-if="player.pick">
                <div class="related-info">
                  <h3>Draft Information</h3>
                  <div class="info-grid">
                    <div class="info-item">
                      <label>Draft Year:</label>
                      <span>{{ player.pick.draftYear }}</span>
                    </div>
                    <div class="info-item">
                      <label>Round:</label>
                      <span>{{ player.pick.round }}</span>
                    </div>
                    <div class="info-item">
                      <label>Pick Number:</label>
                      <span>{{ player.pick.pickNumber }}</span>
                    </div>
                    <div class="info-item">
                      <label>Team:</label>
                      <span>{{ player.pick.team?.name || 'N/A' }}</span>
                    </div>
                    <div class="info-item">
                      <label>Combine Score:</label>
                      <span>{{ formatCombineScore(player.pick.combineScore) }}</span>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel header="Combine Results" v-if="player.combineScore">
                <div class="related-info">
                  <h3>Combine Results</h3>
                  <div class="info-grid">
                    <div class="info-item">
                      <label>40 Yard Dash:</label>
                      <span>{{ player.combineScore.fortyTime }} sec</span>
                    </div>
                    <div class="info-item">
                      <label>10 Yard:</label>
                      <span>{{ player.combineScore.tenYardSplit }} reps</span>
                    </div>
                    <div class="info-item">
                      <label>Vertical Jump:</label>
                      <span>{{ player.combineScore.verticalLeap }} inches</span>
                    </div>
                    <div class="info-item">
                      <label>Broad Jump:</label>
                      <span>{{ player.combineScore.broadJump }} inches</span>
                    </div>
                    <div class="info-item">
                      <label>3 Cone Drill:</label>
                      <span>{{ player.combineScore.threeCone }} sec</span>
                    </div>
                    <div class="info-item">
                      <label>20 Yard Shuttle:</label>
                      <span>{{ player.combineScore.twentyYardShuttle }} sec</span>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel header="Awards" v-if="player.awards && player.awards.length > 0">
                <DataTable :value="player.awards" responsiveLayout="scroll">
                  <Column field="name" header="Award Name"></Column>
                  <Column field="yearAwarded" header="Year Awarded">
                    <template #body="slotProps">
                      {{ slotProps.data.yearAwarded }}
                    </template>
                  </Column>
                </DataTable>
              </TabPanel>
            </TabView>
          </div>
        </template>
      </Card>

      <div class="container">
        <Accordion :multiple="true">
          <AccordionTab header="Player Awards">
            <PlayerAwardView />
          </AccordionTab>
        </Accordion>
      </div>
    </div>

    <div v-else class="empty-state">
      <Card>
        <template #content>
          <div class="empty-message">
            <i class="pi pi-user" style="font-size: 3rem"></i>
            <p>Player not found</p>
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
import { usePlayerStore } from '@/stores/player'
import { useTeamStore } from '@/stores/team'
///import { useDraftPickStore } from '@/stores/draftPick'
import { useCombineScoreStore } from '@/stores/combineScore'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ProgressSpinner from 'primevue/progressspinner'
import PlayerForm from '@/components/player/PlayerForm.vue'

import { formatHeight, formatWeight, formatCombineScore } from '@/utils/formatters'
import type { Player } from '@/domain/models/Player'
//import { DraftPick } from '@/domain/models/DraftPick'

const route = useRoute()

const toast = useToast()
const playerStore = usePlayerStore()
const teamStore = useTeamStore()
//const draftPickStore = useDraftPickStore()
const combineScoreStore = useCombineScoreStore()

const player = computed(() => playerStore.currentPlayer)
const loading = computed(() => playerStore.isLoading)
const error = computed(() => playerStore.error)
const isEditing = ref(false)

const playerId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})
/*
const currentPick = ref<DraftPick | null>(null);
const currentPlayer = ref<Player | null>(null);
*/
// Add this function to the script section
const formatYearOnly = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'

  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.getFullYear().toString()
}
watch(playerId, newId => {
  if (newId) {
    loadPlayer(newId)
  }
})

onMounted(() => {
  if (playerId.value) {
    loadPlayer(playerId.value)
  }
  // Check if edit mode should be activated
  if (route.query.edit === 'true') {
    isEditing.value = true
  }
})

// Also watch for route changes to handle edit parameter
watch(route, newRoute => {
  if (newRoute.query.edit === 'true') {
    isEditing.value = true
  }
})

const loadPlayer = async (id: number) => {
  try {
    await playerStore.fetchPlayerById(id)

    // If the player has a team, fetch the team details
    if (player.value?.team && player.value.team.id) {
      await teamStore.fetchTeamById(player.value.team.id)
    }

    // Check if the player has a pick, fetch the draft pick details    

    // Fetch the player's combine score
    if (player.value?.id) {
      try {
        await combineScoreStore.fetchScoreByPlayerId(player.value.id)
      } catch (error) {
        console.log('No combine score found for this player')
      }
    }
  } catch (error) {
    console.error('Error loading player:', error)
  }
}

const startEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const savePlayer = async (updatedPlayer: Player) => {
  try {
    if (player.value?.id) {
      await playerStore.updatePlayer(player.value.id, updatedPlayer)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Player updated successfully',
        life: 3000
      })
      isEditing.value = false
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update player',
      life: 3000
    })
  }
}
</script>

<style scoped>
.player-detail {
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

.player-info-grid {
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

.related-info {
  padding: 1rem;
}

.related-info h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--primary-text);
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
  .player-info-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
