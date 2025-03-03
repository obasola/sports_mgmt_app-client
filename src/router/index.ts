import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/misc/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/misc/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/misc/AboutView.vue'),
    },
      // Team routes
  {
    path: '/teams',
    name: 'Teams',
    component: () => import('@/views/team/TeamsView.vue')
  },
  {
    path: '/teams/create',
    name: 'TeamCreate',
    component: () => import('@/views/team/TeamCreateView.vue')
  },
  {
    path: '/teams/:id',
    name: 'TeamDetail',
    component: () => import('@/views/team/TeamDetailView.vue'),
    props: true
  },
  {
    path: '/teams/:id/edit',
    name: 'TeamEdit',
    component: () => import('@/views/team/TeamEditView.vue'),
    props: true
  },
  // Player routes
  {
    path: '/players',
    name: 'Players',
    component: () => import('@/views/player/PlayersView.vue')
  },
  {
    path: '/players/create',
    name: 'PlayerCreate',
    component: () => import('@/views/player/PlayerCreateView.vue')
  },
  {
    path: '/players/:id',
    name: 'PlayerDetail',
    component: () => import('@/views/player/PlayerDetailView.vue'),
    props: true
  },
  {
    path: '/players/:id/edit',
    name: 'PlayerEdit',
    component: () => import('@/views/player/PlayerEditView.vue'),
    props: true
  },
  // PlayerAward routes
  {
    path: '/player-awards',
    name: 'PlayerAwards',
    component: () => import('@/views/playerAward/PlayerAwardsView.vue')
  },
  {
    path: '/player-awards/create',
    name: 'PlayerAwardCreate',
    component: () => import('@/views/playerAward/PlayerAwardCreateView.vue')
  },
  {
    path: '/player-awards/:id',
    name: 'PlayerAwardDetail',
    component: () => import('@/views/playerAward/PlayerAwardDetailView.vue'),
    props: true
  },
  {
    path: '/player-awards/:id/edit',
    name: 'PlayerAwardEdit',
    component: () => import('@/views/playerAward/PlayerAwardEditView.vue'),
    props: true
  },
  // Schedule routes
  {
    path: '/schedules',
    name: 'Schedules',
    component: () => import('@/views/schedule/SchedulesView.vue')
  },
  {
    path: '/schedules/create',
    name: 'ScheduleCreate',
    component: () => import('@/views/schedule/ScheduleCreateView.vue')
  },
  {
    path: '/schedules/:id',
    name: 'ScheduleDetail',
    component: () => import('@/views/schedule/ScheduleDetailView.vue'),
    props: true
  },
  {
    path: '/schedules/:id/edit',
    name: 'ScheduleEdit',
    component: () => import('@/views/schedule/ScheduleEditView.vue'),
    props: true
  },
  // Not Found route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/misc/NotFound.vue')
  }
  ],
})

export default router
