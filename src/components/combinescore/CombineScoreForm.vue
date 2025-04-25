<template>
  <div class="combinescore-form">
    <form @submit.prevent="saveCombineScore">
      <div class="p-fluid form-grid">
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

        <div class="form-section">
          <h3>Combine Measurements</h3>
          <div class="p-field">
            <label for="fortyTime">40-Yard Dash (seconds)</label>
            <InputNumber
              id="fortyTime"
              v-model="formData.fortyTime"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :step="0.01"
              :class="{ 'p-invalid': submitted && formData.fortyTime === null }"
            />
            <small v-if="submitted && formData.fortyTime === null" class="p-error"
              >40-yard dash time is required</small
            >
          </div>

          <div class="p-field">
            <label for="verticalLeap">Vertical Jump (inches)</label>
            <InputNumber
              id="verticalLeap"
              v-model="formData.verticalLeap"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :step="0.01"
              :class="{ 'p-invalid': submitted && formData.verticalLeap === null }"
              required
            />
            <small v-if="submitted && formData.verticalLeap === null" class="p-error"
              >Vertical jump is required</small
            >
          </div>

          <div class="p-field">
            <label for="broadJump">Broad Jump (inches)</label>
            <InputNumber
              id="broadJump"
              v-model="formData.broadJump"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :step="0.01"
              :class="{ 'p-invalid': submitted && formData.broadJump === null }"
              required
            />
            <small v-if="submitted && formData.broadJump === null" class="p-error"
              >Broad jump is required</small
            >
          </div>

          <div class="p-field">
            <label for="threeCone">3-Cone Drill (seconds)</label>
            <InputNumber
              id="threeCone"
              v-model="formData.threeCone"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :step="0.01"
              :class="{ 'p-invalid': submitted && formData.threeCone === null }"
              required
            />
            <small v-if="submitted && formData.threeCone === null" class="p-error"
              >3-cone drill time is required</small
            >
          </div>

          <div class="p-field">
            <label for="tenYardSplit">10-Yard Split (seconds)</label>
            <InputNumber
              id="tenYardSplit"
              v-model="formData.tenYardSplit"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :step="0.01"
              :class="{ 'p-invalid': submitted && formData.tenYardSplit === null }"
              required
            />
            <small v-if="submitted && formData.tenYardSplit === null" class="p-error"
              >10-yard split time is required</small
            >
          </div>

          <div class="p-field">
            <label for="twentyYardShuttle">20-Yard Shuttle (seconds)</label>
            <InputNumber
              id="twentyYardShuttle"
              v-model="formData.twentyYardShuttle"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :step="0.01"
              :class="{ 'p-invalid': submitted && formData.twentyYardShuttle === null }"
              required
            />
            <small v-if="submitted && formData.twentyYardShuttle === null" class="p-error"
              >20-yard shuttle time is required</small
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
import { usePlayerStore } from '@/stores/player'
import type { CombineScore } from '@/domain/models/CombineScore'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const props = defineProps<{
  combineScore?: CombineScore
}>()

const emit = defineEmits(['save', 'cancel'])

const playerStore = usePlayerStore()
const submitted = ref(false)

// Format players for dropdown with full name
const players = computed(() => {
  return playerStore.players.map(player => ({
    ...player,
    fullName: `${player.firstName} ${player.lastName}`
  }))
})

// Create reactive form data with default values
const formData = reactive<CombineScore>({
  id: props.combineScore?.id,
  fortyTime: props.combineScore?.fortyTime ?? 0.0,
  tenYardSplit: props.combineScore?.tenYardSplit ?? 0.0,
  verticalLeap: props.combineScore?.verticalLeap ?? 0.0,
  broadJump: props.combineScore?.broadJump ?? 0,
  threeCone: props.combineScore?.threeCone ?? 0.0,
  twentyYardShuttle: props.combineScore?.twentyYardShuttle ?? 0.0,
  playerId: props.combineScore?.playerId || 0
})

onMounted(async () => {
  // Fetch players for the dropdown
  if (playerStore.players.length === 0) {
    await playerStore.fetchPlayers()
  }
})

const saveCombineScore = () => {
  submitted.value = true

  // Validate required fields
  if (
    !formData.playerId ||
    formData.fortyTime === null ||
    formData.tenYardSplit === null ||
    formData.verticalLeap === null ||
    formData.broadJump === null ||
    formData.threeCone === null ||
    formData.twentyYardShuttle === null
  ) {
    return
  }

  // Emit save event with form data
  emit('save', { ...formData })
}
</script>

<style scoped>
.combinescore-form {
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
