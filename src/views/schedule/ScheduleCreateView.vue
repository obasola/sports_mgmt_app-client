
<!-- src/views/schedule/ScheduleCreateView.vue -->
<template>
  <div class="schedule-create-view">
    <h1>Create New Schedule</h1>
    <ScheduleForm :isEditMode="false" />
  </div>
</template>

<script lang="ts" setup>
import ScheduleForm from '../../components/schedule/ScheduleForm.vue';
</script>
