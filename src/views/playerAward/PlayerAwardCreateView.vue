<!-- src/views/playerAward/PlayerAwardCreateView.vue -->
<template>
  <div class="player-award-create-view">
    <h1>Create New Player Award</h1>
    <PlayerAwardForm :isEditMode="false" :preSelectedPlayerId="playerId" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PlayerAwardForm from '../../components/playerAward/PlayerAwardForm.vue';

const route = useRoute();
const playerId = computed(() => route.query.playerId);
</script>
