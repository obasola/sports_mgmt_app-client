<!-- src/components/draftpick/DraftPickCreateForm.vue -->
<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDraftPickStore } from '@/stores/draftPickStore'
import { useTeamStore } from '@/stores/teamStore'
import { useProspectStore } from '@/stores/prospectStore'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import type{ Prospect, Team } from '@/types'

const draftPickStore = useDraftPickStore()
const teamStore = useTeamStore()
const prospectStore = useProspectStore()
const router = useRouter()
const toast = useToast()

const form = reactive({
  draftYear: new Date().getFullYear(),
  round: 1,
  pickNumber: 1,
  playerId: undefined as number | undefined,
  teamId: undefined as number | undefined,
  playerFirstName: '',
  playerLastName: '',
  pickFrom: 1,
  pickTo: 1,
  combineScore: 0
})

const teams = computed(() => 
  teamStore.teams.map((team: Team) => ({
    label: `${team.city} ${team.name}`,
    value: team.id
  }))
)

const prospects = computed(() => 
  prospectStore.prospects.map((prospect: Prospect) => ({
    label: `${prospect.firstName} ${prospect.lastName} - ${prospect.position}`,
    value: prospect.id
  }))
)

const draftYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear - 10; year <= currentYear + 2; year++) {
    years.push({ label: year.toString(), value: year })
  }
  return years
})

const rounds = computed(() => {
  return Array.from({ length: 7 }, (_, i) => ({
    label: `Round ${i + 1}`,
    value: i + 1
  }))
})

onMounted(async () => {
  await Promise.all([
    teamStore.fetchAll(),
    prospectStore.fetchAll()
  ])
})

const onSubmit = async () => {
  try {
    await draftPickStore.create(form)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Draft pick created successfully',
    })
    router.push('/draft-picks')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create draft pick',
    })
  }
}

const onCancel = () => {
  router.push('/draft-picks')
}

// Auto-update pick range when round changes
const updatePickRange = () => {
  const round = form.round
  const pickStart = (round - 1) * 32 + 1
  const pickEnd = round * 32
  form.pickFrom = Math.max(1, pickStart)
  form.pickTo = Math.min(224, pickEnd) // 7 rounds * 32 picks
  
  // Set pick number to start of range
  form.pickNumber = form.pickFrom
}

// Watch for round changes
const onRoundChange = () => {
  updatePickRange()
}
</script>

<template>
  <Card class="create-form">
    <template #title>Create New Draft Pick</template>

    <template #content>
      <form @submit.prevent="onSubmit" class="draftpick-form">
        <div class="form-grid">
          <div class="form-section">
            <h3>Draft Information</h3>
            
            <div class="form-row">
              <label for="draftYear">Draft Year *</label>
              <Dropdown
                id="draftYear"
                v-model="form.draftYear"
                :options="draftYears"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Draft Year"
                class="form-input"
                :required="true"
              />
            </div>

            <div class="form-row">
              <label for="round">Round *</label>
              <Dropdown
                id="round"
                v-model="form.round"
                :options="rounds"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Round"
                class="form-input"
                :required="true"
                @change="onRoundChange"
              />
            </div>

            <div class="form-row">
              <label for="pickNumber">Pick Number *</label>
              <InputNumber
                id="pickNumber"
                v-model="form.pickNumber"
                :min="1"
                :max="224"
                placeholder="Enter pick number"
                class="form-input"
                :required="true"
              />
            </div>

            <div class="form-row">
              <label for="combineScore">Combine Score</label>
              <InputNumber
                id="combineScore"
                v-model="form.combineScore"
                :min="0"
                :max="100"
                :maxFractionDigits="2"
                placeholder="Enter combine score"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-section">
            <h3>Team Information</h3>
            
            <div class="form-row">
              <label for="teamId">Team *</label>
              <Dropdown
                id="teamId"
                v-model="form.teamId"
                :options="teams"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Team"
                class="form-input"
                :required="true"
                filter
              />
            </div>
          </div>

          <div class="form-section">
            <h3>Player Information</h3>
            
            <div class="form-row">
              <label for="playerId">Select Prospect</label>
              <Dropdown
                id="playerId"
                v-model="form.playerId"
                :options="prospects"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Prospect (Optional)"
                class="form-input"
                filter
                showClear
              />
            </div>

            <div class="form-row">
              <label for="playerFirstName">Player First Name</label>
              <InputText
                id="playerFirstName"
                v-model="form.playerFirstName"
                placeholder="Enter player first name"
                class="form-input"
              />
            </div>

            <div class="form-row">
              <label for="playerLastName">Player Last Name</label>
              <InputText
                id="playerLastName"
                v-model="form.playerLastName"
                placeholder="Enter player last name"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-section">
            <h3>Draft Projection</h3>
            
            <div class="form-row">
              <label for="pickFrom">Projected From Pick</label>
              <InputNumber
                id="pickFrom"
                v-model="form.pickFrom"
                :min="1"
                :max="224"
                placeholder="Enter projected start pick"
                class="form-input"
              />
            </div>

            <div class="form-row">
              <label for="pickTo">Projected To Pick</label>
              <InputNumber
                id="pickTo"
                v-model="form.pickTo"
                :min="1"
                :max="224"
                placeholder="Enter projected end pick"
                class="form-input"
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
            label="Create Draft Pick"
            :loading="draftPickStore.loading"
            class="p-button-primary"
          />
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

.draftpick-form {
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