<template>
  <div class="team-form">
    <form @submit.prevent="saveTeam">
      <div class="p-fluid form-grid">
        <div class="form-section">
          <h3>Team Information</h3>
          <div class="p-field">
            <label for="name">Team Name</label>
            <InputText
              id="name"
              v-model.trim="formData.name"
              :class="{ 'p-invalid': submitted && !formData.name }"
              required
            />
            <small v-if="submitted && !formData.name" class="p-error">Team name is required</small>
          </div>

          <div class="p-field">
            <label for="city">City</label>
            <InputText
              id="city"
              v-model.trim="formData.city"
              :class="{ 'p-invalid': submitted && !formData.city }"
              required
            />
            <small v-if="submitted && !formData.city" class="p-error">City is required</small>
          </div>

          <div class="p-field">
            <label for="state">State</label>
            <InputText
              id="state"
              v-model.trim="formData.state"
              :class="{ 'p-invalid': submitted && !formData.state }"
              required
            />
            <small v-if="submitted && !formData.state" class="p-error">State is required</small>
          </div>

          <div class="p-field">
            <label for="stadium">Stadium</label>
            <InputText
              id="stadium"
              v-model.trim="formData.stadium"
              :class="{ 'p-invalid': submitted && !formData.stadium }"
              required
            />
            <small v-if="submitted && !formData.stadium" class="p-error">Stadium is required</small>
          </div>
        </div>

        <div class="form-section">
          <h3>League Information</h3>
          <div class="p-field">
            <label for="conference">Conference</label>
            <Dropdown
              id="conference"
              v-model="formData.conference"
              :options="conferenceOptions"
              :class="{ 'p-invalid': submitted && !formData.conference }"
              placeholder="Select a conference"
              required
            />
            <small v-if="submitted && !formData.conference" class="p-error"
              >Conference is required</small
            >
          </div>

          <div class="p-field">
            <label for="division">Division</label>
            <Dropdown
              id="division"
              v-model="formData.division"
              :options="divisionOptions"
              :class="{ 'p-invalid': submitted && !formData.division }"
              placeholder="Select a division"
              required
            />
            <small v-if="submitted && !formData.division" class="p-error"
              >Division is required</small
            >
          </div>

          <div class="p-field">
            <label for="scheduleId">Schedule ID</label>
            <InputNumber
              id="scheduleId"
              v-model="formData.scheduleId"
              :min="0"
              :class="{ 'p-invalid': submitted && formData.scheduleId === undefined }"
              required
            />
            <small v-if="submitted && formData.scheduleId === undefined" class="p-error"
              >Schedule ID is required</small
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
import { ref, reactive } from 'vue'
import type { Team } from '@/domain/models/Team'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const props = defineProps<{
  team?: Team
}>()

const emit = defineEmits(['save', 'cancel'])

const submitted = ref(false)

const conferenceOptions = ['AFC', 'NFC']
const divisionOptions = ['North', 'South', 'East', 'West']

// Create reactive form data with default values
const formData = reactive<Team>({
  id: props.team?.id,
  name: props.team?.name || '',
  city: props.team?.city || '',
  state: props.team?.state || '',
  country: props.team?.country || '',
  conference: props.team?.conference || '',
  division: props.team?.division || '',
  stadium: props.team?.stadium || '',
  scheduleId: props.team?.scheduleId || 0,
  
})

const saveTeam = () => {
  submitted.value = true

  // Validate required fields
  if (
    !formData.name ||
    !formData.city ||
    !formData.state ||
    !formData.conference ||
    !formData.division ||
    !formData.stadium ||
    formData.scheduleId === undefined
  ) {
    return
  }

  // Emit save event with form data
  emit('save', { ...formData })
}
</script>

<style scoped>
.team-form {
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
