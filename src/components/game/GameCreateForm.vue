<!-- src/components/game/GameCreateForm.vue -->
<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { Game } from '@/types'

const gameStore = useGameStore()
const router = useRouter()
const toast = useToast()

const form = reactive({
  // Initialize form fields based on domain
  seasonYear: new Date().getFullYear().toString(),
  gameWeek: null as number | null,
  preseason: null as number | null,
  gameDate: new Date(),
  homeTeamId: 0, // Required field, initialize with default
  awayTeamId: 0, // Required field, initialize with default
  gameLocation: '',
  gameCity: '',
  gameStateProvince: '',
  gameCountry: 'USA',
  homeScore: null as number | null,
  awayScore: null as number | null,
  gameStatus: 'SCHEDULED'
})

const onSubmit = async () => {
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

    await gameStore.create(form)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Game created successfully',
    })
    router.push('/games')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create game',
    })
  }
}

const onCancel = () => {
  router.push('/games')
}

// ✅ Define emits
const emit = defineEmits(['game-created', 'cancel'])

// ✅ Handle form submission
const handleSubmit = async (formData: Game) => {
  try {
    const newGame = await gameStore.create(formData)
    emit('game-created', newGame)  // ✅ Close modal & refresh list
  } catch (error) {
    // Handle error
  }
}

// ✅ Handle cancel
const handleCancel = () => {
  emit('cancel')  // ✅ Close modal
}
</script>

<template>
  <Card class="create-form">
    <template #title>Create New Game</template>

    <template #content>
      <form @submit.prevent="onSubmit" class="game-form">
        <div class="form-grid">
          <!-- Game Details Section -->
          <div class="form-section">
            <h3>Game Details</h3>

            <div class="form-row">
              <label for="seasonYear">Season Year</label>
              <InputText id="seasonYear" v-model="form.seasonYear" class="form-input" required />
            </div>

            <div class="form-row">
              <label for="gameWeek">Game Week</label>
              <InputNumber id="gameWeek" v-model="form.gameWeek" class="form-input" :min="1" :max="20" />
            </div>

            <div class="form-row">
              <label for="preseason">Preseason</label>
              <InputNumber id="preseason" v-model="form.preseason" class="form-input" :min="1" :max="4" />
            </div>

            <div class="form-row">
              <label for="gameDate">Game Date</label>
              <Calendar id="gameDate" v-model="form.gameDate" class="form-input" showTime hourFormat="12" />
            </div>

            <div class="form-row">
              <label for="gameStatus">Status</label>
              <InputText id="gameStatus" v-model="form.gameStatus" class="form-input" />
            </div>
          </div>

          <!-- Teams Section -->
          <div class="form-section">
            <h3>Teams</h3>

            <div class="form-row">
              <label for="homeTeamId">Home Team ID</label>
              <InputNumber id="homeTeamId" v-model="form.homeTeamId" class="form-input" required />
            </div>

            <div class="form-row">
              <label for="awayTeamId">Away Team ID</label>
              <InputNumber id="awayTeamId" v-model="form.awayTeamId" class="form-input" required />
            </div>
          </div>

          <!-- Location Section -->
          <div class="form-section">
            <h3>Location</h3>

            <div class="form-row">
              <label for="gameLocation">Game Location</label>
              <InputText id="gameLocation" v-model="form.gameLocation" class="form-input" />
            </div>

            <div class="form-row">
              <label for="gameCity">City</label>
              <InputText id="gameCity" v-model="form.gameCity" class="form-input" />
            </div>

            <div class="form-row">
              <label for="gameStateProvince">State/Province</label>
              <InputText id="gameStateProvince" v-model="form.gameStateProvince" class="form-input" />
            </div>

            <div class="form-row">
              <label for="gameCountry">Country</label>
              <InputText id="gameCountry" v-model="form.gameCountry" class="form-input" />
            </div>
          </div>

          <!-- Score Section -->
          <div class="form-section">
            <h3>Score</h3>

            <div class="form-row">
              <label for="homeScore">Home Score</label>
              <InputNumber id="homeScore" v-model="form.homeScore" class="form-input" :min="0" />
            </div>

            <div class="form-row">
              <label for="awayScore">Away Score</label>
              <InputNumber id="awayScore" v-model="form.awayScore" class="form-input" :min="0" />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <Button type="button" @click="handleCancel" label="Cancel" class="p-button-secondary" />
          <Button type="submit" label="Create Game" class="p-button-success" />
        </div>
      </form>
    </template>
  </Card>
</template>

<style scoped>
.create-form {
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