<!-- src/views/schedule/SchedulesView.vue -->
<template>
  <div class="schedules-view">
    <h1>Game Schedules</h1>
    <ScheduleList />
  </div>
</template>

<script lang="ts" setup>
import ScheduleList from '../../components/schedule/ScheduleList.vue';
</script>

<style scoped>
.schedules-view {
  width: 100%;
}
</style>
