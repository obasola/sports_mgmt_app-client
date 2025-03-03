<!-- src/views/playerAward/PlayerAwardEditView.vue -->
<template>
  <div class="player-award-edit-view">
    <h1>Edit Player Award</h1>
    <PlayerAwardForm :isEditMode="true" :playerAwardId="playerAwardId" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PlayerAwardForm from '@/components/playerAward/PlayerAwardForm.vue';

const route = useRoute();
const playerAwardId = computed(() => route.params.id);
</script>
