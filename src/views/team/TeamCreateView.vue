<!-- src/views/team/TeamCreateView.vue -->
<template>
  <div class="team-create-view">
    <h1>Create New Team</h1>
    <TeamForm :isEditMode="false" />
  </div>
</template>

<script lang="ts" setup>
import TeamForm from '../../components/team/TeamForm.vue';
</script>
