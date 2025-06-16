<!-- src/components/playerTeam/PlayerTeamEditForm.vue -->
<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerTeamStore } from '@/stores/playerTeamStore'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const playerTeamStore = usePlayerTeamStore()
const router = useRouter()
const toast = useToast()

// Form state
const form = reactive({
  playerId: null as number | null,
  teamId: null as number | null,
  startDate: null as Date | null,
  endDate: null as Date | null,
  currentTeam: true,
})

// Mock data - in real app, these would come from stores
const players = ref([
  { label: 'Player 1', value: 1 },
  { label: 'Player 2', value: 2 },
  { label: 'Player 3', value: 3 },
])

const teams = ref([
  { label: 'Team 1', value: 1 },
  { label: 'Team 2', value: 2 },
  { label: 'Team 3', value: 3 },
])

const formErrors = reactive({
  playerId: '',
  teamId: '',
  startDate: '',
})

const loadFormData = () => {
  const currentPlayerTeam = playerTeamStore.currentPlayerTeam
  if (currentPlayerTeam) {
    form.playerId = currentPlayerTeam.playerId
    form.teamId = currentPlayerTeam.teamId
    form.startDate = currentPlayerTeam.startDate ? new Date(currentPlayerTeam.startDate) : null
    form.endDate = currentPlayerTeam.endDate ? new Date(currentPlayerTeam.endDate) : null
    form.currentTeam = currentPlayerTeam.currentTeam
  }
}

onMounted(() => {
  loadFormData()
})

// Watch for changes to current player team
watch(
  () => playerTeamStore.currentPlayerTeam,
  () => {
    loadFormData()
  }
)

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = ''
  })

  // Validate required fields
  if (!form.playerId) {
    formErrors.playerId = 'Player is required'
    isValid = false
  }

  if (!form.teamId) {
    formErrors.teamId = 'Team is required'
    isValid = false
  }

  if (!form.startDate) {
    formErrors.startDate = 'Start date is required'
    isValid = false
  }

  // Validate end date is after start date
  if (form.endDate && form.startDate && form.endDate <= form.startDate) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'End date must be after start date',
    })
    isValid = false
  }

  return isValid
}

const onSubmit = async () => {
  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fix the form errors and try again',
    })
    return
  }

  const currentPlayerTeam = playerTeamStore.currentPlayerTeam
  if (!currentPlayerTeam?.id) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No player team selected for editing',
    })
    return
  }

  try {
    // Build the payload object, excluding undefined/null optional fields
    const updatePayload: Record<string, any> = {
      playerId: form.playerId!,
      teamId: form.teamId!,
      startDate: form.startDate!,
      currentTeam: form.currentTeam,
    }

    // Only include endDate if it has a value
    if (form.endDate !== null) {
      updatePayload.endDate = form.endDate
    }

    await playerTeamStore.update(currentPlayerTeam.id, updatePayload)
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Player team relationship updated successfully',
    })
    router.push(`/player-teams/${currentPlayerTeam.id}?mode=read`)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update player team relationship',
    })
  }
}

const onCancel = () => {
  const currentPlayerTeam = playerTeamStore.currentPlayerTeam
  if (currentPlayerTeam?.id) {
    router.push(`/player-teams/${currentPlayerTeam.id}?mode=read`)
  } else {
    router.push('/player-teams')
  }
}
</script>

<template>
  <Card class="edit-form">
    <template #title>Edit Player Team Relationship</template>

    <template #content>
      <form @submit.prevent="onSubmit" class="playerteam-form">
        <div class="form-grid">
          <!-- Basic Information Section -->
          <div class="form-section">
            <h3>Relationship Information</h3>
            
            <div class="form-row">
              <label for="playerId">Player *</label>
              <Dropdown
                id="playerId"
                v-model="form.playerId"
                :options="players"
                optionLabel="label"
                optionValue="value"
                placeholder="Select a player"
                class="form-input"
                :class="{ 'p-invalid': formErrors.playerId }"
              />
              <small v-if="formErrors.playerId" class="p-error">{{ formErrors.playerId }}</small>
            </div>

            <div class="form-row">
              <label for="teamId">Team *</label>
              <Dropdown
                id="teamId"
                v-model="form.teamId"
                :options="teams"
                optionLabel="label"
                optionValue="value"
                placeholder="Select a team"
                class="form-input"
                :class="{ 'p-invalid': formErrors.teamId }"
              />
              <small v-if="formErrors.teamId" class="p-error">{{ formErrors.teamId }}</small>
            </div>

            <div class="form-row">
              <div class="checkbox-container">
                <Checkbox
                  id="currentTeam"
                  v-model="form.currentTeam"
                  binary
                />
                <label for="currentTeam">Current Team</label>
              </div>
            </div>
          </div>

          <!-- Timeline Information Section -->
          <div class="form-section">
            <h3>Timeline Information</h3>
            
            <div class="form-row">
              <label for="startDate">Start Date *</label>
              <Calendar
                id="startDate"
                v-model="form.startDate"
                dateFormat="mm/dd/yy"
                placeholder="Select start date"
                class="form-input"
                :class="{ 'p-invalid': formErrors.startDate }"
              />
              <small v-if="formErrors.startDate" class="p-error">{{ formErrors.startDate }}</small>
            </div>

            <div class="form-row">
              <label for="endDate">End Date</label>
              <Calendar
                id="endDate"
                v-model="form.endDate"
                dateFormat="mm/dd/yy"
                placeholder="Select end date (optional)"
                class="form-input"
              />
              <small class="field-help">Leave empty if this is an ongoing relationship</small>
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
            label="Update Player Team"
            :loading="playerTeamStore.loading"
            class="p-button-primary"
          />
        </div>
      </form>
    </template>
  </Card>
</template>

<style scoped>
.edit-form {
  max-width: 800px;
  margin: 0 auto;
}

.playerteam-form {
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

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-container label {
  margin-bottom: 0;
  cursor: pointer;
}

.field-help {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
}
</style>