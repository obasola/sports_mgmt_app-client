<!-- src/views/team/TeamsView.vue -->
<template>
  <div class="teams-view">
    <h1>Teams</h1>
    <TeamList />
  </div>
</template>

<script lang="ts" setup>
import TeamList from '../../components/team/TeamList.vue';
</script>

<style scoped>
.teams-view {
  width: 100%;
}
</style>
