<template>
  <div class="playeraward-form">
    <form @submit.prevent="savePlayerAward">
      <div class="p-fluid form-grid">
        <div class="form-section">
          <h3>Award Information</h3>
          <div class="p-field">
            <label for="name">Award Name</label>
            <InputText
              id="name"
              v-model.trim="formData.name"
              :class="{ 'p-invalid': submitted && !formData.name }"
              required
            />
            <small v-if="submitted && !formData.name" class="p-error">Award name is required</small>
          </div>

          <div class="p-field">
            <label for="yearAwarded">Year Awarded</label>
            <InputNumber
              id="yearAwarded"
              v-model="formData.yearAwarded"
              :min="1990"
              :max="currentYear"
              :class="{ 'p-invalid': submitted && !formData.yearAwarded }"
              required
            />
            <small v-if="submitted && !formData.yearAwarded" class="p-error"
              >Year awarded is required</small
            >
          </div>
        </div>

        <div class="form-section">
          <h3>Player Information</h3>
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
import { usePlayerStore } from '@/stores/player'
import type { PlayerAward } from '@/domain/models/PlayerAward'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const props = defineProps<{
  playerAward?: PlayerAward
}>()

const emit = defineEmits(['save', 'cancel'])

const playerStore = usePlayerStore()
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
const formData = reactive<PlayerAward>({
  id: props.playerAward?.id,
  name: props.playerAward?.name || '',
  yearAwarded: props.playerAward?.yearAwarded || currentYear,
  playerId: props.playerAward?.playerId || 0
})

onMounted(async () => {
  // Fetch players for the dropdown
  if (playerStore.players.length === 0) {
    await playerStore.fetchPlayers()
  }
})

const savePlayerAward = () => {
  submitted.value = true

  // Validate required fields
  if (!formData.name || !formData.yearAwarded || !formData.playerId) {
    return
  }

  // Emit save event with form data
  emit('save', { ...formData })
}
</script>

<style scoped>
.playeraward-form {
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
