<!-- src/components/player/PlayerForm.vue -->
<template>
  <div class="player-form">
    <form @submit.prevent="submitForm">
      <div class="p-fluid">
        <div class="p-field mb-3">
          <span class="p-float-label">
            <InputText
              id="firstName"
              v-model.trim="player.firstName"
              :class="{ 'p-invalid': v$.firstName.$invalid && v$.firstName.$dirty }"
              required
            />
            <label for="firstName">First Name*</label>
          </span>
          <small class="p-error" v-if="v$.firstName.$invalid && v$.firstName.$dirty">
            {{ v$.firstName.$errors[0].$message }}
          </small>
        </div>

        <div class="p-field mb-3">
          <span class="p-float-label">
            <InputText
              id="lastName"
              v-model.trim="player.lastName"
              :class="{ 'p-invalid': v$.lastName.$invalid && v$.lastName.$dirty }"
              required
            />
            <label for="lastName">Last Name*</label>
          </span>
          <small class="p-error" v-if="v$.lastName.$invalid && v$.lastName.$dirty">
            {{ v$.lastName.$errors[0].$message }}
          </small>
        </div>

        <div class="formgrid grid">
          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <InputNumber
                id="age"
                v-model="player.age"
                :min="18"
                :max="50"
                :class="{ 'p-invalid': v$.age.$invalid && v$.age.$dirty }"
                required
              />
              <label for="age">Age*</label>
            </span>
            <small class="p-error" v-if="v$.age.$invalid && v$.age.$dirty">
              {{ v$.age.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <InputNumber
                id="height"
                v-model="player.height"
                :min="60"
                :max="96"
                :class="{ 'p-invalid': v$.height.$invalid && v$.height.$dirty }"
                required
              />
              <label for="height">Height (inches)*</label>
            </span>
            <small class="p-error" v-if="v$.height.$invalid && v$.height.$dirty">
              {{ v$.height.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-4">
            <span class="p-float-label">
              <InputNumber
                id="weight"
                v-model="player.weight"
                :min="150"
                :max="400"
                :class="{ 'p-invalid': v$.weight.$invalid && v$.weight.$dirty }"
                required
              />
              <label for="weight">Weight (lbs)*</label>
            </span>
            <small class="p-error" v-if="v$.weight.$invalid && v$.weight.$dirty">
              {{ v$.weight.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputNumber
                id="handSize"
                v-model="player.handSize"
                :min="7"
                :max="12"
                :step="0.125"
                :class="{ 'p-invalid': v$.handSize.$invalid && v$.handSize.$dirty }"
                required
              />
              <label for="handSize">Hand Size (inches)*</label>
            </span>
            <small class="p-error" v-if="v$.handSize.$invalid && v$.handSize.$dirty">
              {{ v$.handSize.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputNumber
                id="armLength"
                v-model="player.armLength"
                :min="25"
                :max="40"
                :step="0.125"
                :class="{ 'p-invalid': v$.armLength.$invalid && v$.armLength.$dirty }"
                required
              />
              <label for="armLength">Arm Length (inches)*</label>
            </span>
            <small class="p-error" v-if="v$.armLength.$invalid && v$.armLength.$dirty">
              {{ v$.armLength.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputText
                id="homeCity"
                v-model.trim="player.homeCity"
                :class="{ 'p-invalid': v$.homeCity.$invalid && v$.homeCity.$dirty }"
                required
              />
              <label for="homeCity">Home City*</label>
            </span>
            <small class="p-error" v-if="v$.homeCity.$invalid && v$.homeCity.$dirty">
              {{ v$.homeCity.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputText
                id="homeState"
                v-model.trim="player.homeState"
                :class="{ 'p-invalid': v$.homeState.$invalid && v$.homeState.$dirty }"
                required
              />
              <label for="homeState">Home State*</label>
            </span>
            <small class="p-error" v-if="v$.homeState.$invalid && v$.homeState.$dirty">
              {{ v$.homeState.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputText
                id="university"
                v-model.trim="player.university"
                :class="{ 'p-invalid': v$.university.$invalid && v$.university.$dirty }"
                required
              />
              <label for="university">University*</label>
            </span>
            <small class="p-error" v-if="v$.university.$invalid && v$.university.$dirty">
              {{ v$.university.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputNumber
                id="yearEnteredLeague"
                v-model="player.yearEnteredLeague"
                :min="1970"
                :max="currentYear"
                :class="{ 'p-invalid': v$.yearEnteredLeague.$invalid && v$.yearEnteredLeague.$dirty }"
                required
              />
              <label for="yearEnteredLeague">Year Entered League*</label>
            </span>
            <small class="p-error" v-if="v$.yearEnteredLeague.$invalid && v$.yearEnteredLeague.$dirty">
              {{ v$.yearEnteredLeague.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <Dropdown
                id="position"
                v-model="player.position"
                :options="positionOptions"
                :class="{ 'p-invalid': v$.position.$invalid && v$.position.$dirty }"
                required
              />
              <label for="position">Position*</label>
            </span>
            <small class="p-error" v-if="v$.position.$invalid && v$.position.$dirty">
              {{ v$.position.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <Dropdown
                id="teamId"
                v-model="player.teamId"
                :options="teams"
                optionLabel="name"
                optionValue="id"
                :filter="true"
                :class="{ 'p-invalid': v$.teamId.$invalid && v$.teamId.$dirty }"
                required
              />
              <label for="teamId">Team*</label>
            </span>
            <small class="p-error" v-if="v$.teamId.$invalid && v$.teamId.$dirty">
              {{ v$.teamId.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="formgrid grid mt-4">
          <div class="field col-12">
            <Button
              type="submit"
              :label="isEditMode ? 'Update Player' : 'Create Player'"
              class="p-button-primary mr-2"
              :loading="submitting"
            />
            <Button
              type="button"
              label="Cancel"
              class="p-button-secondary"
              @click="cancelForm"
              :disabled="submitting"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue, minLength } from '@vuelidate/validators';
import { usePlayerStore } from '../../infrastructure/store/player.store';
import { useTeamStore } from '../../infrastructure/store/team.store';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import type { Player } from '../../domain/models/Player';

// Props
const props = defineProps({
  playerId: {
    type: [Number, String],
    default: null
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
});

// Emit events
const emit = defineEmits(['saved', 'cancelled']);

// Stores and router
const playerStore = usePlayerStore();
const teamStore = useTeamStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

// State
const currentYear = new Date().getFullYear();
const submitting = ref(false);
const player = reactive<Player>({
  firstName: '',
  lastName: '',
  age: 22,
  height: 72,
  weight: 200,
  handSize: 9,
  armLength: 32,
  homeCity: '',
  homeState: '',
  university: '',
  yearEnteredLeague: currentYear,
  position: '',
  teamId: Number(route.query.teamId) || 0,
  pickId: 0
});

// Options for position dropdown
const positionOptions = [
  'QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P'
];

// Validation rules
const rules = {
  firstName: { required, minLength: minLength(2) },
  lastName: { required, minLength: minLength(2) },
  age: { required, minValue: minValue(18), maxValue: maxValue(50) },
  height: { required, minValue: minValue(60), maxValue: maxValue(96) },
  weight: { required, minValue: minValue(150), maxValue: maxValue(400) },
  handSize: { required, minValue: minValue(7), maxValue: maxValue(12) },
  armLength: { required, minValue: minValue(25), maxValue: maxValue(40) },
  homeCity: { required, minLength: minLength(2) },
  homeState: { required, minLength: minLength(2) },
  university: { required, minLength: minLength(2) },
  yearEnteredLeague: { required, minValue: minValue(1970), maxValue: maxValue(currentYear) },
  position: { required },
  teamId: { required, minValue: minValue(1) }
};

const v$ = useVuelidate(rules, player);

// Computed
const teams = computed(() => teamStore.teams);

// Methods
const loadTeams = async () => {
  if (teams.value.length === 0) {
    try {
      await teamStore.fetchTeams();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load teams', life: 3000 });
    }
  }
};

const loadPlayer = async (id: number) => {
  try {
    await playerStore.fetchPlayerById(id);
    const loadedPlayer = playerStore.currentPlayer;

    if (loadedPlayer) {
      // Copy player data to our reactive object
      Object.assign(player, loadedPlayer);
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Player not found', life: 3000 });
      router.push({ name: 'Players' });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load player', life: 3000 });
    router.push({ name: 'Players' });
  }
};

const submitForm = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Please correct the form errors', life: 3000 });
    return;
  }

  submitting.value = true;

  try {
    if (props.isEditMode && props.playerId) {
      await playerStore.updatePlayer(Number(props.playerId), player);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Player updated successfully', life: 3000 });
    } else {
      await playerStore.createPlayer(player);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Player created successfully', life: 3000 });
    }

    emit('saved');

    // If this was created from team detail, go back to that team
    if (route.query.teamId && !props.isEditMode) {
      router.push({ name: 'TeamDetail', params: { id: route.query.teamId } });
    } else {
      router.push({ name: 'Players' });
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: props.isEditMode ? 'Failed to update player' : 'Failed to create player',
      life: 3000
    });
  } finally {
    submitting.value = false;
  }
};

const cancelForm = () => {
  emit('cancelled');

  // If this was created from team detail, go back to that team
  if (route.query.teamId && !props.isEditMode) {
    router.push({ name: 'TeamDetail', params: { id: route.query.teamId } });
  } else {
    router.push({ name: 'Players' });
  }
};

// Lifecycle hooks
onMounted(async () => {
  await loadTeams();

  if (props.isEditMode && props.playerId) {
    await loadPlayer(Number(props.playerId));
  }
});
</script>

<style scoped>
.player-form {
  max-width: 900px;
  margin: 0 auto;
}
</style>
