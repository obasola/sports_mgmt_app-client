<template>
  <div class="player-form">
    <form @submit.prevent="savePlayer">
      <div class="p-fluid form-grid">
        <div class="form-section">
          <h3>Personal Information</h3>
          <div class="p-field">
            <label for="firstName">First Name</label>
            <InputText
              id="firstName"
              v-model.trim="formData.firstName"
              :class="{ 'p-invalid': submitted && !formData.firstName }"
              required
            />
            <small v-if="submitted && !formData.firstName" class="p-error"
              >First name is required</small
            >
          </div>

          <div class="p-field">
            <label for="lastName">Last Name</label>
            <InputText
              id="lastName"
              v-model.trim="formData.lastName"
              :class="{ 'p-invalid': submitted && !formData.lastName }"
              required
            />
            <small v-if="submitted && !formData.lastName" class="p-error"
              >Last name is required</small
            >
          </div>

          <div class="p-field">
            <label for="age">Age</label>
            <InputNumber
              id="age"
              v-model="formData.age"
              :min="18"
              :max="50"
              :class="{ 'p-invalid': submitted && !formData.age }"
              required
            />
            <small v-if="submitted && !formData.age" class="p-error">Age is required</small>
          </div>

          <div class="p-field">
            <label for="height">Height (inches)</label>
            <InputNumber
              id="height"
              v-model="formData.height"
              :min="60"
              :max="96"
              :class="{ 'p-invalid': submitted && !formData.height }"
              required
            />
            <small v-if="submitted && !formData.height" class="p-error">Height is required</small>
          </div>

          <div class="p-field">
            <label for="weight">Weight (lbs)</label>
            <InputNumber
              id="weight"
              v-model="formData.weight"
              :min="150"
              :max="400"
              :class="{ 'p-invalid': submitted && !formData.weight }"
              required
            />
            <small v-if="submitted && !formData.weight" class="p-error">Weight is required</small>
          </div>

          <div class="p-field">
            <label for="handSize">Hand Size (inches)</label>
            <InputNumber
              id="handSize"
              v-model="formData.handSize"
              :min="7"
              :max="12"
              :step="0.125"
              :class="{ 'p-invalid': submitted && !formData.handSize }"
              required
            />
            <small v-if="submitted && !formData.handSize" class="p-error"
              >Hand size is required</small
            >
          </div>

          <div class="p-field">
            <label for="armLength">Arm Length (inches)</label>
            <InputNumber
              id="armLength"
              v-model="formData.armLength"
              :min="25"
              :max="40"
              :step="0.125"
              :class="{ 'p-invalid': submitted && !formData.armLength }"
              required
            />
            <small v-if="submitted && !formData.armLength" class="p-error"
              >Arm length is required</small
            >
          </div>
        </div>

        <div class="form-section">
          <h3>Location & Career</h3>
          <div class="p-field">
            <label for="homeCity">Home City</label>
            <InputText
              id="homeCity"
              v-model.trim="formData.homeCity"
              :class="{ 'p-invalid': submitted && !formData.homeCity }"
              required
            />
            <small v-if="submitted && !formData.homeCity" class="p-error"
              >Home city is required</small
            >
          </div>

          <div class="p-field">
            <label for="homeState">Home State</label>
            <InputText
              id="homeState"
              v-model.trim="formData.homeState"
              :class="{ 'p-invalid': submitted && !formData.homeState }"
              required
            />
            <small v-if="submitted && !formData.homeState" class="p-error"
              >Home state is required</small
            >
          </div>

          <div class="p-field">
            <label for="university">University</label>
            <InputText
              id="university"
              v-model.trim="formData.university"
              :class="{ 'p-invalid': submitted && !formData.university }"
              required
            />
            <small v-if="submitted && !formData.university" class="p-error"
              >University is required</small
            >
          </div>

          <div class="p-field">
            <label for="yearEnteredLeague">Year Entered League</label>
            <Calendar
              id="yearEnteredLeague"
              v-model="formData.yearEnteredLeague"
              view="year"
              dateFormat="yy"
              :showIcon="true"
              :class="{ 'p-invalid': submitted && !formData.yearEnteredLeague }"
              required
            />
            <small v-if="submitted && !formData.yearEnteredLeague" class="p-error"
              >Year is required</small
            >
          </div>

          <div class="p-field">
            <label for="position">Position</label>
            <Dropdown
              id="position"
              v-model="formData.position"
              :options="positionOptions"
              :class="{ 'p-invalid': submitted && !formData.position }"
              required
            />
            <small v-if="submitted && !formData.position" class="p-error"
              >Position is required</small
            >
          </div>

          <div class="p-field">
            <label for="teamId">Team</label>
            <Dropdown
              id="teamId"
              v-model="formData.team"
              :options="teams"
              optionLabel="name"
              optionValue="id"
              :class="{ 'p-invalid': submitted && !formData.team }"
              required
            />
            <small v-if="submitted && !formData.team?.id" class="p-error">Team is required</small>
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
import { ref, computed, reactive, onMounted } from 'vue'
import { useTeamStore } from '@/stores/team'
import type { Player } from '@/domain/models/Player'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'

const props = defineProps<{
  player?: Player
}>()

const emit = defineEmits(['save', 'cancel'])

const teamStore = useTeamStore()
const teams = computed(() => teamStore.teams)
const currentYear = new Date().getFullYear()
const submitted = ref(false)

const positionOptions = [
  'QB',
  'RB',
  'FB',
  'WR',
  'TE',
  'OT',
  'OG',
  'C',
  'DE',
  'DT',
  'LB',
  'CB',
  'S',
  'K',
  'P'
]

// Create reactive form data with default values
const formData = reactive<Player>({
  id: props.player?.id,
  firstName: props.player?.firstName || '',
  lastName: props.player?.lastName || '',
  age: props.player?.age || 22,
  height: props.player?.height || 72, // 6 feet
  weight: props.player?.weight || 200,
  handSize: props.player?.handSize || 9,
  armLength: props.player?.armLength || 32,
  homeCity: props.player?.homeCity || '',
  homeState: props.player?.homeState || '',
  university: props.player?.university || '',
  yearEnteredLeague: props.player?.yearEnteredLeague || new Date(currentYear, 0, 1), // Default to January 1st of current year
  position: props.player?.position || '',
  team: props.player?.team || undefined,
  pick: props.player?.pick || undefined
})

onMounted(async () => {
  // Fetch teams for the dropdown
  if (teams.value.length === 0) {
    await teamStore.fetchTeams()
  }
})

const savePlayer = () => {
  submitted.value = true

  // Validate required fields
  if (
    !formData.firstName ||
    !formData.lastName ||
    !formData.age ||
    !formData.height ||
    !formData.weight ||
    !formData.handSize ||
    !formData.armLength ||
    !formData.homeCity ||
    !formData.homeState ||
    !formData.university ||
    !formData.yearEnteredLeague ||
    !formData.position
  ) {
    return
  }

  // Emit save event with form data
  emit('save', { ...formData })
}
</script>

<style scoped>
.player-form {
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
