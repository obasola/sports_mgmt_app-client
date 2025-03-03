<!-- src/views/team/TeamEditView.vue -->
<template>
  <div class="team-edit-view">
    <h1>Edit Team</h1>
    <TeamForm :isEditMode="true" :teamId="teamId" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TeamForm from '../../components/team/TeamForm.vue';

const route = useRoute();
const teamId = computed(() => route.params.id);
</script>
