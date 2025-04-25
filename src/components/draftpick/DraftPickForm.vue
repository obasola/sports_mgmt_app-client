<template>
  <div class="draftpick-form">
    <form @submit.prevent="saveDraftPick">
      <div class="p-fluid form-grid">
        <div class="form-section">
          <h3>Draft Information</h3>
          <div class="p-field">
            <label for="draftYear">Draft Year</label>
            <InputNumber
              id="draftYear"
              v-model="formData.draftYear"
              :min="2000"
              :max="currentYear"
              :class="{ 'p-invalid': submitted && !formData.draftYear }"
              required
            />
            <small v-if="submitted && !formData.draftYear" class="p-error"
              >Draft year is required</small
            >
          </div>

          <div class="p-field">
            <label for="round">Round</label>
            <InputNumber
              id="round"
              v-model="formData.round"
              :min="1"
              :max="7"
              :class="{ 'p-invalid': submitted && !formData.round }"
              required
            />
            <small v-if="submitted && !formData.round" class="p-error">Round is required</small>
          </div>

          <div class="p-field">
            <label for="pickNumber">Pick Number</label>
            <InputNumber
              id="pickNumber"
              v-model="formData.pickNumber"
              :min="1"
              :max="300"
              :class="{ 'p-invalid': submitted && !formData.pickNumber }"
              required
            />
            <small v-if="submitted && !formData.pickNumber" class="p-error"
              >Pick number is required</small
            >
          </div>

          <div class="p-field">
            <label for="pickFrom">Pick From Team</label>
            <Dropdown
              id="pickFrom"
              v-model="formData.pickFrom"
              :options="teams"
              optionLabel="name"
              optionValue="id"
              :class="{ 'p-invalid': submitted && !formData.pickFrom }"
              placeholder="Select Original Team"
              required
            />
            <small v-if="submitted && !formData.pickFrom" class="p-error"
              >Original team is required</small
            >
          </div>

          <div class="p-field">
            <label for="pickTo">Pick To Team</label>
            <Dropdown
              id="pickTo"
              v-model="formData.pickTo"
              :options="teams"
              optionLabel="name"
              optionValue="id"
              :class="{ 'p-invalid': submitted && !formData.pickTo }"
              placeholder="Select Trading Team"
              required
            />
            <small v-if="submitted && !formData.pickTo" class="p-error"
              >Trading team is required</small
            >
          </div>
        </div>

        <div class="form-section">
          <h3>Selection Information</h3>
          <div class="p-field">
            <label for="teamId">Team</label>
            <Dropdown
              id="teamId"
              v-model="formData.teamId"
              :options="teams"
              optionLabel="name"
              optionValue="id"
              :class="{ 'p-invalid': submitted && !formData.teamId }"
              placeholder="Select Team"
              required
            />
            <small v-if="submitted && !formData.teamId" class="p-error">Team is required</small>
          </div>

          <div class="p-field">
            <label for="playerId">Player</label>
            <Dropdown
              id="playerId"
              v-model="formData.playerId"
              :options="players"
              optionLabel="fullName"
              optionValue="id"
              :class="{ 'p-invalid': submitted && !formData.playerId }"
              placeholder="Select Player"
              required
            />
            <small v-if="submitted && !formData.playerId" class="p-error">Player is required</small>
          </div>

          <div class="p-field">
            <label for="combineScore">Combine Score</label>
            <InputNumber
              id="combineScore"
              v-model="formData.combineScore"
              :min="0"
              :max="10"
              :step="0.1"
              :class="{ 'p-invalid': submitted && formData.combineScore === undefined }"
              required
            />
            <small v-if="submitted && formData.combineScore === undefined" class="p-error"
              >Combine score is required</small
            >
          </div>
        </div>
      </div>

      <div class="form-actions">
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="$emit('cancel')"
          type="button"
        />
        <Button label="Save" icon="pi pi-check" class="p-button-success" type="submit" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useTeamStore } from '@/stores/team'
import { usePlayerStore } from '@/stores/player'
import type { DraftPick } from '@/domain/models/DraftPick'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const props = defineProps<{
  draftPick?: DraftPick
}>()

const emit = defineEmits(['save', 'cancel'])

const teamStore = useTeamStore()
const playerStore = usePlayerStore()
const teams = computed(() => teamStore.teams)
const submitted = ref(false)
const currentYear = new Date().getFullYear()

// Format players for dropdown with full name
const players = computed(() => {
  return playerStore.players.map(player => ({
    ...player,
    fullName: `${player.firstName} ${player.lastName}`
  }))
})

// Create reactive form data with default values
const formData = reactive<DraftPick>({
  id: props.draftPick?.id,
  round: props.draftPick?.round || 1,
  pickNumber: props.draftPick?.pickNumber || 1,
  draftYear: props.draftPick?.draftYear || currentYear,
  pickFrom: props.draftPick?.pickFrom || 0,
  pickTo: props.draftPick?.pickTo || 0,
  combineScore: props.draftPick?.combineScore || 0,
  teamId: props.draftPick?.teamId || 0,
  playerId: props.draftPick?.playerId || 0
})

onMounted(async () => {
  // Fetch teams and players for the dropdowns
  if (teams.value.length === 0) {
    await teamStore.fetchTeams()
  }

  if (playerStore.players.length === 0) {
    await playerStore.fetchPlayers()
  }
})

const saveDraftPick = () => {
  submitted.value = true

  // Validate required fields
  if (
    !formData.round ||
    !formData.pickNumber ||
    !formData.draftYear ||
    !formData.pickFrom ||
    !formData.pickTo ||
    formData.combineScore === undefined ||
    !formData.teamId ||
    !formData.playerId
  ) {
    return
  }

  // Emit save event with form data
  emit('save', { ...formData })
}
</script>

<style scoped>
.draftpick-form {
  padding: 1rem 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-section h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--primary-text);
  border-bottom: 1px solid var(--primary-text);
  padding-bottom: 0.5rem;
}

.p-field {
  margin-bottom: 1rem;
}

.p-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
