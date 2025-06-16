// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import PlayerDetail from '@/views/PlayerDetail.vue'
import TeamDetail from '@/views/TeamDetail.vue'
import PlayerAwardDetail from '@/views/PlayerAwardDetail.vue'
import PlayerTeamDetail from '@/views/PlayerTeamDetail.vue'
import CombineScoreDetail from '@/views/CombineScoreDetail.vue'
import DraftPickDetail from '@/views/DraftPickDetail.vue'
import ProspectDetail from '@/views/ProspectDetail.vue'
/*

import ScheduleDetail from '@/views/ScheduleDetail.vue'

import TeamNeedDetail from '@/views/TeamNeedDetail.vue'
import PostSeasonResultDetail from '@/views/PostSeasonResultDetail.vue'
*/
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/players/:id?',
      name: 'PlayerDetail',
      component: PlayerDetail,
    },
    {
      path: '/teams/:id?',
      name: 'TeamDetail',
      component: TeamDetail,
    },
    {
      path: '/player-awards/:id?',
      name: 'PlayerAwardDetail',
      component: PlayerAwardDetail,
    },
    {
      path: '/player-teams/:id?',
      name: 'PlayerTeamDetail',
      component: PlayerTeamDetail,
    },
    {
      path: '/combine-scores/:id?',
      name: 'CombineScoreDetail',
      component: CombineScoreDetail,
    },
    {
      path: '/draft-picks/:id?',
      name: 'DraftPickDetail',
      component: DraftPickDetail,
    },
    {
      path: '/prospects/:id?',
      name: 'ProspectDetail',
      component: ProspectDetail,
    },
    /*
    
    {
      path: '/schedules/:id?',
      name: 'ScheduleDetail',
      component: ScheduleDetail,
    },
    {
      path: '/player-awards/:id?',
      name: 'PlayerAwardDetail',
      component: PlayerAwardDetail,
    },
    {
      path: '/team-needs/:id?',
      name: 'TeamNeedDetail',
      component: TeamNeedDetail,
    },
    {
      path: '/post-season-results/:id?',
      name: 'PostSeasonResultDetail',
      component: PostSeasonResultDetail,
    },
    */
  ],
})

export default router