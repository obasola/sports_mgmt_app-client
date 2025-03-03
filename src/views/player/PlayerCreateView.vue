
<!-- src/views/player/PlayerCreateView.vue -->
<template>
  <div class="player-create-view">
    <h1>Create New Player</h1>
    <PlayerForm :isEditMode="false" />
  </div>
</template>

<script lang="ts" setup>
import PlayerForm from '../../components/player/PlayerForm.vue';
</script>
