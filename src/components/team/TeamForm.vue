<!-- src/components/team/TeamForm.vue -->
<template>
  <div class="team-form">
    <form @submit.prevent="submitForm">
      <div class="p-fluid">
        <div class="p-field mb-3">
          <span class="p-float-label">
            <InputText
              id="name"
              v-model.trim="team.name"
              :class="{ 'p-invalid': v$.name.$invalid && v$.name.$dirty }"
              required
            />
            <label for="name">Team Name*</label>
          </span>
          <small class="p-error" v-if="v$.name.$invalid && v$.name.$dirty">
            {{ v$.name.$errors[0].$message }}
          </small>
        </div>

        <div class="formgrid grid">
          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputText
                id="city"
                v-model.trim="team.city"
                :class="{ 'p-invalid': v$.city.$invalid && v$.city.$dirty }"
                required
              />
              <label for="city">City*</label>
            </span>
            <small class="p-error" v-if="v$.city.$invalid && v$.city.$dirty">
              {{ v$.city.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputText
                id="state"
                v-model.trim="team.state"
                :class="{ 'p-invalid': v$.state.$invalid && v$.state.$dirty }"
                required
              />
              <label for="state">State*</label>
            </span>
            <small class="p-error" v-if="v$.state.$invalid && v$.state.$dirty">
              {{ v$.state.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <Dropdown
                id="conference"
                v-model="team.conference"
                :options="conferenceOptions"
                :class="{ 'p-invalid': v$.conference.$invalid && v$.conference.$dirty }"
                required
              />
              <label for="conference">Conference*</label>
            </span>
            <small class="p-error" v-if="v$.conference.$invalid && v$.conference.$dirty">
              {{ v$.conference.$errors[0].$message }}
            </small>
          </div>

          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <Dropdown
                id="division"
                v-model="team.division"
                :options="divisionOptions"
                :class="{ 'p-invalid': v$.division.$invalid && v$.division.$dirty }"
                required
              />
              <label for="division">Division*</label>
            </span>
            <small class="p-error" v-if="v$.division.$invalid && v$.division.$dirty">
              {{ v$.division.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="p-field mb-3">
          <span class="p-float-label">
            <InputText
              id="stadium"
              v-model.trim="team.stadium"
              :class="{ 'p-invalid': v$.stadium.$invalid && v$.stadium.$dirty }"
              required
            />
            <label for="stadium">Stadium Name*</label>
          </span>
          <small class="p-error" v-if="v$.stadium.$invalid && v$.stadium.$dirty">
            {{ v$.stadium.$errors[0].$message }}
          </small>
        </div>

        <div class="p-field mb-3">
          <span class="p-float-label">
            <InputNumber
              id="scheduleId"
              v-model="team.scheduleId"
              :class="{ 'p-invalid': v$.scheduleId.$invalid && v$.scheduleId.$dirty }"
              required
            />
            <label for="scheduleId">Schedule ID*</label>
          </span>
          <small class="p-error" v-if="v$.scheduleId.$invalid && v$.scheduleId.$dirty">
            {{ v$.scheduleId.$errors[0].$message }}
          </small>
        </div>

        <div class="formgrid grid mt-4">
          <div class="field col-12">
            <Button
              type="submit"
              :label="isEditMode ? 'Update Team' : 'Create Team'"
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
import { required, minValue, minLength } from '@vuelidate/validators';
import { useTeamStore } from '../../infrastructure/store/team.store';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import type { Team } from '../../domain/models/Team';

// Props
const props = defineProps({
  teamId: {
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

// Store and router
const teamStore = useTeamStore();
const router = useRouter();
const toast = useToast();

// State
const submitting = ref(false);
const team = reactive<Team>({
  name: '',
  city: '',
  state: '',
  conference: '',
  division: '',
  stadium: '',
  scheduleId: 0
});

// Options
const conferenceOptions = ['AFC', 'NFC'];
const divisionOptions = ['North', 'South', 'East', 'West'];

// Validation rules
const rules = {
  name: { required, minLength: minLength(2) },
  city: { required, minLength: minLength(2) },
  state: { required, minLength: minLength(2) },
  conference: { required },
  division: { required },
  stadium: { required, minLength: minLength(2) },
  scheduleId: { required, minValue: minValue(1) }
};

const v$ = useVuelidate(rules, team);

// Methods
const loadTeam = async (id: number) => {
  try {
    await teamStore.fetchTeamById(id);
    const loadedTeam = teamStore.currentTeam;

    if (loadedTeam) {
      // Copy team data to our reactive object
      Object.assign(team, loadedTeam);
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Team not found', life: 3000 });
      router.push({ name: 'Teams' });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load team', life: 3000 });
    router.push({ name: 'Teams' });
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
    if (props.isEditMode && props.teamId) {
      await teamStore.updateTeam(Number(props.teamId), team);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Team updated successfully', life: 3000 });
    } else {
      await teamStore.createTeam(team);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Team created successfully', life: 3000 });
    }

    emit('saved');
    router.push({ name: 'Teams' });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: props.isEditMode ? 'Failed to update team' : 'Failed to create team',
      life: 3000
    });
  } finally {
    submitting.value = false;
  }
};

const cancelForm = () => {
  emit('cancelled');
  router.push({ name: 'Teams' });
};

// Lifecycle hooks
onMounted(async () => {
  if (props.isEditMode && props.teamId) {
    await loadTeam(Number(props.teamId));
  }
});
</script>

<style scoped>
.team-form {
  max-width: 800px;
  margin: 0 auto;
}
</style>
