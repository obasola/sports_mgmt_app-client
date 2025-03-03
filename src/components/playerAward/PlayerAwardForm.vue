<!-- src/components/playerAward/PlayerAwardForm.vue -->
<template>
  <div class="player-award-form">
    <form @submit.prevent="submitForm">
      <div class="p-fluid">
        <div class="p-field mb-3">
          <span class="p-float-label">
            <Dropdown
              id="playerId"
              v-model="playerAward.playerId"
              :options="players"
              optionLabel="fullName"
              optionValue="id"
              :filter="true"
              :class="{ 'p-invalid': v$.playerId.$invalid && v$.playerId.$dirty }"
              required
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  {{ getPlayerFullName(slotProps.value) }}
                </div>
                <div v-else>Select a Player</div>
              </template>
              <template #option="slotProps">
                <div>{{ slotProps.option.fullName }}</div>
              </template>
            </Dropdown>
            <label for="playerId">Player*</label>
          </span>
          <small class="p-error" v-if="v$.playerId.$invalid && v$.playerId.$dirty">
            {{ v$.playerId.$errors[0].$message }}
          </small>
        </div>

        <div class="p-field mb-3">
          <span class="p-float-label">
            <InputText
              id="awardName"
              v-model.trim="playerAward.awardName"
              :class="{ 'p-invalid': v$.awardName.$invalid && v$.awardName.$dirty }"
              required
            />
            <label for="awardName">Award Name*</label>
          </span>
          <small class="p-error" v-if="v$.awardName.$invalid && v$.awardName.$dirty">
            {{ v$.awardName.$errors[0].$message }}
          </small>
        </div>

        <div class="p-field mb-3">
          <span class="p-float-label">
            <InputNumber
              id="awardYear"
              v-model="playerAward.awardYear"
              :min="1900"
              :max="currentYear"
              :class="{ 'p-invalid': v$.awardYear.$invalid && v$.awardYear.$dirty }"
              required
            />
            <label for="awardYear">Award Year*</label>
          </span>
          <small class="p-error" v-if="v$.awardYear.$invalid && v$.awardYear.$dirty">
            {{ v$.awardYear.$errors[0].$message }}
          </small>
        </div>

        <div class="formgrid grid mt-4">
          <div class="field col-12">
            <Button
              type="submit"
              :label="isEditMode ? 'Update Award' : 'Create Award'"
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
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue, minLength } from '@vuelidate/validators';
import { usePlayerAwardStore } from '../../infrastructure/store/playerAward.store';
import { usePlayerStore } from '../../infrastructure/store/player.store';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import type { PlayerAward } from '../../domain/models/PlayerAward';

// Props
const props = defineProps({
  playerAwardId: {
    type: [Number, String],
    default: null
  },
  isEditMode: {
    type: Boolean,
    default: false
  },
  preSelectedPlayerId: {
    type: [Number, String],
    default: null
  }
});

// Emit events
const emit = defineEmits(['saved', 'cancelled']);

// Store and router
const playerAwardStore = usePlayerAwardStore();
const playerStore = usePlayerStore();
const router = useRouter();
const toast = useToast();

// State
const currentYear = new Date().getFullYear();
const submitting = ref(false);
const playerAward = reactive<PlayerAward>({
  playerId: props.preSelectedPlayerId ? Number(props.preSelectedPlayerId) : 0,
  awardName: '',
  awardYear: currentYear
});

// Computed properties
const players = computed(() => {
  return playerStore.players.map(player => ({
    id: player.id,
    fullName: `${player.firstName} ${player.lastName} (${player.position})`
  }));
});

// Validation rules
const rules = {
  playerId: { required, minValue: minValue(1) },
  awardName: { required, minLength: minLength(2) },
  awardYear: { required, minValue: minValue(1900), maxValue: maxValue(currentYear) }
};

const v$ = useVuelidate(rules, playerAward);

// Methods
const getPlayerFullName = (playerId) => {
  const player = playerStore.players.find(p => p.id === playerId);
  return player ? `${player.firstName} ${player.lastName} (${player.position})` : 'Unknown Player';
};

const loadPlayerAward = async (id: number) => {
  try {
    await playerAwardStore.fetchPlayerAwardById(id);
    const loadedPlayerAward = playerAwardStore.currentPlayerAward;

    if (loadedPlayerAward) {
      // Copy player award data to our reactive object
      Object.assign(playerAward, loadedPlayerAward);
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Player award not found', life: 3000 });
      router.push({ name: 'PlayerAwards' });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load player award', life: 3000 });
    router.push({ name: 'PlayerAwards' });
  }
};

const loadPlayers = async () => {
  if (playerStore.players.length === 0) {
    try {
      await playerStore.fetchPlayers();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load players', life: 3000 });
    }
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
    if (props.isEditMode && props.playerAwardId) {
      await playerAwardStore.updatePlayerAward(Number(props.playerAwardId), playerAward);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Player award updated successfully', life: 3000 });
    } else {
      await playerAwardStore.createPlayerAward(playerAward);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Player award created successfully', life: 3000 });
    }

    emit('saved');
    router.push({ name: 'PlayerAwards' });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: props.isEditMode ? 'Failed to update player award' : 'Failed to create player award',
      life: 3000
    });
  } finally {
    submitting.value = false;
  }
};

const cancelForm = () => {
  emit('cancelled');
  router.push({ name: 'PlayerAwards' });
};

// Lifecycle hooks
onMounted(async () => {
  await loadPlayers();

  if (props.isEditMode && props.playerAwardId) {
    await loadPlayerAward(Number(props.playerAwardId));
  }
});
</script>

<style scoped>
.player-award-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>
