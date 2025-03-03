<!-- src/views/player/PlayerEditView.vue -->
<template>
  <div class="player-edit-view">
    <h1>Edit Player</h1>
    <PlayerForm :isEditMode="true" :playerId="playerId" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PlayerForm from '../../components/player/PlayerForm.vue';

const route = useRoute();
const playerId = computed(() => route.params.id);
</script>
