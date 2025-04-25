<template>
    <div class="draft-tracker-container" style="background-color: black; color: white; min-height: 100vh; padding: 20px;">
      <!-- Section 1: Draft Status -->
      <div class="container">
        <div class="draft-header p-3 rounded mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <button class="btn btn-primary px-4">Draft Results</button>
            <a href="#" class="text-white text-decoration-none">My Picks</a>
          </div>
          
          <div class="draft-current-pick text-center py-3">
            <div class="d-flex justify-content-center align-items-center mb-3">
              <span class="mr-2">Round {{ currentRound }}</span>
              <div class="image-placeholder mx-3" style="width: 40px; height: 40px; background: #ddd; border-radius: 50%;"></div>
              <span>{{ currentPick }}</span>
            </div>
            <div class="text-right pr-5">
              <span>Next Pick</span>
            </div>
          </div>
          
          <div class="draft-selection py-3 d-flex align-items-center">
            <span class="mr-2">{{ currentPick }}</span>
            <div class="image-placeholder mr-3" style="width: 40px; height: 40px; background: #ddd; border-radius: 50%;"></div>
            <span>{{ currentDraftSelection ? currentDraftSelection.name : '' }}</span>
          </div>
        </div>
      </div>
      
      <!-- Section 2: Player Selection -->
      <div class="container mt-4">
        <!-- Team Needs Container -->
        <div class="team-needs-container p-3 rounded mb-4">
          <div class="d-flex align-items-center mb-2">
            <div class="image-placeholder mr-2" style="width: 30px; height: 30px; background: #ddd; border-radius: 50%;"></div>
            <span>Teams Needs: </span>
            <span class="ml-2">{{ currentTeamNeeds }}</span>
          </div>
        </div>
        
        <!-- Player Filter Tabs -->
        <div class="position-filter p-2 rounded mb-3">
          <ul class="nav nav-tabs">
            <li class="nav-item" v-for="tab in tabs" :key="tab">
              <a 
                class="nav-link" 
                :class="{ active: activeTab === tab }" 
                href="#"
                @click.prevent="activeTab = tab"
              >
                {{ tab }}
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Search Container -->
        <div class="search-container p-3 rounded mb-4">
          <div class="d-flex align-items-center">
            <span class="mr-2">🔍</span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search for players..." 
              v-model="searchQuery"
            >
          </div>
        </div>
        
        <!-- Player List -->
        <div class="player-list">
          <div 
            v-for="player in filteredPlayers" 
            :key="player.id" 
            class="player-item p-3 mb-3 rounded d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center">
              <span class="draft-position mr-3">{{ player.draftPosition }}</span>
              <div>
                <div class="player-name">{{ player.name }}</div>
                <div class="player-details">{{ player.position }} • {{ player.college }}</div>
              </div>
            </div>
            <button 
              class="btn btn-success rounded-pill"
              @click="draftPlayer(player)"
            >
              Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { useDraftPickStore } from '@/stores/draftPick';
  import { PlayerRepository } from '@/repositories';
  import { TeamRepository } from '@/repositories';

  export default defineComponent({
    name: 'DraftTrackerView',
    setup() {
      const draftStore = useDraftPickStore();
      const playerRepository = new PlayerRepository();
      const teamRepository = new TeamRepository();
      
      const currentRound = ref(draftStore.currentRound);
      const currentPick = ref(1);
      const currentTeam = ref<any>(null);
      const currentTeamNeeds = ref('');
      const currentDraftSelection = ref<any>(null);
      
      const players = ref<any[]>([]);
      const searchQuery = ref('');
      const tabs = ['All', 'Offense', 'Defense', 'S/T'];
      const activeTab = ref('All');
      
      onMounted(async () => {
        try {
          // Load players
          const allPlayers = await playerRepository.getProspects();
          players.value = allPlayers.map((player, index) => ({
            ...player,
            draftPosition: index + 1
          }));
          
          // Get current team
          if (draftStore.selectedTeams.length > 0) {
            const team = await teamRepository.getById(draftStore.selectedTeams[0]);
            currentTeam.value = team;
           // currentTeamNeeds.value = team.teamNeeds || '';
          }
        } catch (error) {
          console.error('Failed to load data:', error);
        }
      });
      
      const filteredPlayers = computed(() => {
        let filtered = [...players.value];
        
        // Apply position filter
        if (activeTab.value === 'Offense') {
          filtered = filtered.filter(player => 
            ['QB', 'RB', 'WR', 'TE', 'OT', 'OG', 'C'].includes(player.position)
          );
        } else if (activeTab.value === 'Defense') {
          filtered = filtered.filter(player => 
            ['DE', 'DT', 'LB', 'CB', 'S'].includes(player.position)
          );
        } else if (activeTab.value === 'S/T') {
          filtered = filtered.filter(player => 
            ['K', 'P', 'LS'].includes(player.position)
          );
        }
        
        // Apply search query
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(player =>
            player.name.toLowerCase().includes(query) ||
            player.position.toLowerCase().includes(query) ||
            player.college.toLowerCase().includes(query)
          );
        }
        
        return filtered;
      });
      
      const draftPlayer = (player: any) => {
        currentDraftSelection.value = player;
        /*
        draftStore.addDraftPick({
          round: currentRound.value,
          pick: currentPick.value,
          playerId: player.id,
          teamId: currentTeam.value ? currentTeam.value.id : null
        });
        */
        // Move to next pick
        currentPick.value++;
      };
      
      return {
        currentRound,
        currentPick,
        currentTeamNeeds,
        currentDraftSelection,
        players,
        searchQuery,
        tabs,
        activeTab,
        filteredPlayers,
        draftPlayer
      };
    }
  });
  </script>
  
  <style scoped>
  .draft-header, .team-needs-container, .position-filter, .search-container, .player-item {
    background-color: #222;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  .player-item {
    background-color: #333;
    transition: all 0.2s;
  }
  
  .player-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  
  .player-name {
    font-weight: bold;
    font-size: 1.1rem;
  }
  
  .player-details {
    font-size: 0.9rem;
    color: #aaa;
  }
  
  .draft-position {
    font-weight: bold;
    min-width: 30px;
  }
  
  .nav-tabs .nav-link {
    color: #fff;
  }
  
  .nav-tabs .nav-link.active {
    background-color: #343a40;
    color: white;
    border-color: #343a40;
  }
  
  .image-placeholder {
    display: inline-block;
  }
  </style>