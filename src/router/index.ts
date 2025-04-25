// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import TeamSelectionView from '@/views/TeamSelectionView.vue';
import DraftTrackerView from '@/views/DraftTrackerView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    // Player routes
    {
      path: '/players',
      name: 'players',
      component: () => import('@/views/PlayerView.vue')
    },
    {
      path: '/players/:id',
      name: 'player-detail',
      component: () => import('@/views/PlayerView.vue'),
      props: true
    },
    // Team routes
    {
      path: '/teams',
      name: 'teams',
      component: () => import('@/views/TeamView.vue')
    },
    {
      path: '/teams/:id',
      name: 'team-detail',
      component: () => import('@/views/TeamView.vue'),
      props: true
    },
    // Schedule routes
    {
      path: '/schedules',
      name: 'schedules',
      component: () => import('@/views/ScheduleView.vue')
    },
    {
      path: '/schedules/:id',
      name: 'schedule-detail',
      component: () => import('@/views/ScheduleView.vue'),
      props: true
    },
    // Draft pick routes
    {
      path: '/draft-picks',
      name: 'draft-picks',
      component: () => import('@/views/DraftPickView.vue')
    },
    {
      path: '/draft-picks/:id',
      name: 'draft-pick-detail',
      component: () => import('@/views/DraftPickView.vue'),
      props: true
    },
    // Player award routes
    {
      path: '/player-awards',
      name: 'player-awards',
      component: () => import('@/views/PlayerAwardView.vue')
    },
    {
      path: '/player-awards/:id',
      name: 'player-award-detail',
      component: () => import('@/views/PlayerAwardView.vue'),
      props: true
    },
    // Combine score routes
    {
      path: '/combine-scores',
      name: 'combine-scores',
      component: () => import('@/views/CombineScoreView.vue')
    },
    {
      path: '/combine-scores/:id',
      name: 'combine-score-detail',
      component: () => import('@/views/CombineScoreView.vue'),
      props: true
    },
    // Not found route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    },    
    {
      path: '/draft',
      name: 'draft',
      component: TeamSelectionView
    },
    {
      path: '/draft-tracker',
      name: 'draft-tracker',
      component: DraftTrackerView
    },
    {
      path: '/batch/upload-prospects',
      name: 'upload-prospects',
      component: () => import('@/views/UploadProspectsView.vue')
    },
    {
      path: '/batch/upload-combine-scores',
      name: 'upload-combine-scores',
      component: () => import('@/views/UploadCombineScoresView.vue')
    }
  ]
})

export default router
