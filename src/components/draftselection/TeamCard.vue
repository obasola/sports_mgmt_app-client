<template>
  <div 
    class="team-item"
    :class="{ selected }"
    @click="$emit('toggle')"
    :title="`${team.city} ${team.name}`"
  >
    <div class="team-logo">
      <img 
        v-if="team.logoUrl && !imageError"
        :src="team.logoUrl" 
        :alt="`${team.city} ${team.name} logo`"
        class="team-logo-img"
        @error="onImageError"
      />
      <div 
        v-else
        class="team-logo-fallback" 
        :style="{ backgroundColor: team.color }"
      >
        {{ team.code }}
      </div>
    </div>
    <div class="team-info">
      <div class="team-name">{{ team.name }}</div>
      <div class="team-city">{{ team.city }}</div>
    </div>
    <div v-if="selected" class="selected-indicator">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Team, Conference } from '@/types/Teams'

interface Props {
  team: Team
  conference: Conference
  selected: boolean
}

const props = defineProps<Props>()

defineEmits<{
  toggle: []
}>()

const imageError = ref(false)

const onImageError = (event: Event) => {
  console.warn(`Failed to load team logo: ${props.team.logoUrl}`)
  imageError.value = true
}
</script>

<style scoped>
.team-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  min-height: 50px;
}

.team-item:hover {
  background: #4a4a4a;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.team-item.selected {
  background: #1a5d3a;
  border-color: #28a745;
  box-shadow: 0 0 0 1px rgba(40, 167, 69, 0.3);
}

.team-item.selected:hover {
  background: #1e6b42;
}

.team-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 6px;
  flex-shrink: 0;
  overflow: hidden;
  background: #555;
}

.team-logo-img {
  width: 160px;
  height: 160px;
  object-fit: contain;
  background: white;
  border-radius: 4px;
}

.team-logo-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 0.65rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.team-info {
  flex: 1;
  min-width: 0;
}

.team-name {
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.team-city {
  color: #aaa;
  font-size: 0.65rem;
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-indicator {
  color: #28a745;
  flex-shrink: 0;
}

.selected-indicator svg {
  width: 14px;
  height: 14px;
}

/* Compact mode for mobile */
@media (max-width: 600px) {
  .team-item {
    padding: 0.4rem;
    min-height: 45px;
    gap: 0.4rem;
  }
  
  .team-logo {
    width: 30px;
    height: 30px;
  }
  
  .team-name {
    font-size: 0.7rem;
  }
  
  .team-city {
    font-size: 0.6rem;
  }
  
  .team-logo-fallback {
    font-size: 0.6rem;
  }
}
</style>

<style scoped>
.team-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  min-height: 50px;
}

.team-item:hover {
  background: #4a4a4a;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.team-item.selected {
  background: #1a5d3a;
  border-color: #28a745;
  box-shadow: 0 0 0 1px rgba(40, 167, 69, 0.3);
}

.team-item.selected:hover {
  background: #1e6b42;
}

.team-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  flex-shrink: 0;
  overflow: hidden;
  background: #555;
}

.team-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: white;
  border-radius: 4px;
}

.team-logo-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 0.7rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.team-info {
  flex: 1;
  min-width: 0;
}

.team-name {
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.team-city {
  color: #aaa;
  font-size: 0.7rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-indicator {
  color: #28a745;
  flex-shrink: 0;
}
</style>

<style scoped>
.team-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  min-height: 50px;
}

.team-item:hover {
  background: #4a4a4a;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.team-item.selected {
  background: #1a5d3a;
  border-color: #28a745;
  box-shadow: 0 0 0 1px rgba(40, 167, 69, 0.3);
}

.team-item.selected:hover {
  background: #1e6b42;
}

.team-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  flex-shrink: 0;
  overflow: hidden;
  background: #555;
}

.team-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: white;
  border-radius: 4px;
}

.team-logo-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 0.7rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.team-info {
  flex: 1;
  min-width: 0;
}

.team-name {
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.team-city {
  color: #aaa;
  font-size: 0.7rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-indicator {
  color: #28a745;
  flex-shrink: 0;
}
</style>