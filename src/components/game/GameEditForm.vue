<!-- src/components/game/GameEditForm.vue -->
<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const gameStore = useGameStore()
const router = useRouter()
const toast = useToast()

const currentGame = computed(() => gameStore.currentGame)

const form = reactive({
  seasonYear: '',
  gameWeek: null as number | null,
  preseason: null as number | null,
  gameDate: null as Date | null,
  homeTeamId: 0,
  awayTeamId: 0,
  gameLocation: '',
  gameCity: '',
  gameStateProvince: '',
  gameCountry: '',
  homeScore: null as number | null,
  awayScore: null as number | null,
  gameStatus: ''
})

// Watch for changes to current game and populate form
watch(currentGame, (game) => {
  if (game) {
    form.seasonYear = game.seasonYear
    form.gameWeek = game.gameWeek ?? null
    form.preseason = game.preseason ?? null
    form.gameDate = game.gameDate ? new Date(game.gameDate) : null
    form.homeTeamId = game.homeTeamId
    form.awayTeamId = game.awayTeamId
    form.gameLocation = game.gameLocation || ''
    form.gameCity = game.gameCity || ''
    form.gameStateProvince = game.gameStateProvince || ''
    form.gameCountry = game.gameCountry || ''
    form.homeScore = game.homeScore ?? null
    form.awayScore = game.awayScore ?? null
    form.gameStatus = game.gameStatus || ''
  }
}, { immediate: true })

const onSubmit = async () => {
  if (!currentGame.value) return

  try {
    // Validation
    if (!form.homeTeamId || !form.awayTeamId) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please provide both home and away team IDs',
      })
      return
    }
    
    if (form.homeTeamId === form.awayTeamId) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Home and away teams must be different',
      })
      return
    }

    await gameStore.update(currentGame.value.id, form)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Game updated successfully',
    })
    router.push(`/games/${currentGame.value.id}?mode=read`)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update game',
    })
  }
}

const onCancel = () => {
  if (currentGame.value) {
    router.push(`/games/${currentGame.value.id}?mode=read`)
  } else {
    router.push('/games')
  }
}
</script>

<template>
  <Card class="edit-form">
    <template #title>Edit Game</template>

    <template #content>
      <form @submit.prevent="onSubmit" class="game-form">
        <div class="form-grid">
          <!-- Game Details Section -->
          <div class="form-section">
            <h3>Game Details</h3>
            
            <div class="form-row">
              <label for="seasonYear">Season Year</label>
              <InputText
                id="seasonYear"
                v-model="form.seasonYear"
                class="form-input"
                required
              />
            </div>

            <div class="form-row">
              <label for="gameWeek">Game Week</label>
              <InputNumber
                id="gameWeek"
                v-model="form.gameWeek"
                class="form-input"
                :min="1"
                :max="20"
              />
            </div>

            <div class="form-row">
              <label for="preseason">Preseason</label>
              <InputNumber
                id="preseason"
                v-model="form.preseason"
                class="form-input"
                :min="1"
                :max="4"
              />
            </div>

            <div class="form-row">
              <label for="gameDate">Game Date</label>
              <Calendar
                id="gameDate"
                v-model="form.gameDate"
                class="form-input"
                showTime
                hourFormat="12"
              />
            </div>

            <div class="form-row">
              <label for="gameStatus">Status</label>
              <InputText
                id="gameStatus"
                v-model="form.gameStatus"
                class="form-input"
              />
            </div>
          </div>

          <!-- Teams Section -->
          <div class="form-section">
            <h3>Teams</h3>
            
            <div class="form-row">
              <label for="homeTeamId">Home Team ID</label>
              <InputNumber
                id="homeTeamId"
                v-model="form.homeTeamId"
                class="form-input"
                required
              />
            </div>

            <div class="form-row">
              <label for="awayTeamId">Away Team ID</label>
              <InputNumber
                id="awayTeamId"
                v-model="form.awayTeamId"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Location Section -->
          <div class="form-section">
            <h3>Location</h3>
            
            <div class="form-row">
              <label for="gameLocation">Game Location</label>
              <InputText
                id="gameLocation"
                v-model="form.gameLocation"
                class="form-input"
              />
            </div>

            <div class="form-row">
              <label for="gameCity">City</label>
              <InputText
                id="gameCity"
                v-model="form.gameCity"
                class="form-input"
              />
            </div>

            <div class="form-row">
              <label for="gameStateProvince">State/Province</label>
              <InputText
                id="gameStateProvince"
                v-model="form.gameStateProvince"
                class="form-input"
              />
            </div>

            <div class="form-row">
              <label for="gameCountry">Country</label>
              <InputText
                id="gameCountry"
                v-model="form.gameCountry"
                class="form-input"
              />
            </div>
          </div>

          <!-- Score Section -->
          <div class="form-section">
            <h3>Score</h3>
            
            <div class="form-row">
              <label for="homeScore">Home Score</label>
              <InputNumber
                id="homeScore"
                v-model="form.homeScore"
                class="form-input"
                :min="0"
              />
            </div>

            <div class="form-row">
              <label for="awayScore">Away Score</label>
              <InputNumber
                id="awayScore"
                v-model="form.awayScore"
                class="form-input"
                :min="0"
              />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <Button
            type="button"
            @click="onCancel"
            label="Cancel"
            class="p-button-secondary"
          />
          <Button
            type="submit"
            label="Update Game"
            :loading="gameStore.loading"
            class="p-button-primary"
          />
        </div>
      </form>
    </template>
  </Card>
</template>

<style scoped>
.edit-form {
  max-width: 1000px;
  margin: 0 auto;
}

.game-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.form-row {
  margin-bottom: 1rem;
}

.form-row label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}
</style>