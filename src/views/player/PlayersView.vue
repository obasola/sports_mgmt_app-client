<!-- src/views/player/PlayersView.vue -->
<template>
  <div class="players-view">
    <h1>Players</h1>
    <PlayerList />
  </div>
</template>

<script lang="ts" setup>
import PlayerList from '../../components/player/PlayerList.vue';
</script>

<style scoped>
.players-view {
  width: 100%;
}
</style>



