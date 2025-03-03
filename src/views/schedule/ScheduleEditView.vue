
<!-- src/views/schedule/ScheduleEditView.vue -->
<template>
  <div class="schedule-edit-view">
    <h1>Edit Schedule</h1>
    <ScheduleForm :isEditMode="true" :scheduleId="scheduleId" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ScheduleForm from '../../components/schedule/ScheduleForm.vue';

const route = useRoute();
const scheduleId = computed(() => route.params.id);
</script>
