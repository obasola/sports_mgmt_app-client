<!-- src/views/playerAward/PlayerAwardsView.vue -->
<template>
  <div class="player-awards-view">
    <h1>Player Awards</h1>
    <PlayerAwardList />
  </div>
</template>

<script lang="ts" setup>
import PlayerAwardList from '../../components/playerAward/PlayerAwardList.vue';
</script>

<style scoped>
.player-awards-view {
  width: 100%;
}
</style>


