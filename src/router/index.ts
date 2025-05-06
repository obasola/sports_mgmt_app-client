// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import TeamSelectionView from '@/views/TeamSelectionView.vue'
import DraftTrackerView from '@/views/DraftTrackerView.vue'

// Import the parent view component
import DraftSelectionView from '@/views/DraftSelectionView.vue';

// Import child components
import DraftSelectionList from '@/components/draftselection/DraftSelectionList.vue';
import DraftSelectionDetails from '@/components/draftselection/DraftSelectionView.vue';
import DraftSelectionForm from '@/components/draftselection/DraftSelectionForm.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    // Player routes
    {
      path: '/players',
      name: 'players',
      component: () => import('@/views/PlayerView.vue'),
    },
    {
      path: '/players/:id',
      name: 'player-detail',
      component: () => import('@/views/PlayerView.vue'),
      props: true,
    },
    // Team routes
    {
      path: '/teams',
      name: 'teams',
      component: () => import('@/views/TeamView.vue'),
    },
    {
      path: '/teams/:id',
      name: 'team-detail',
      component: () => import('@/views/TeamView.vue'),
      props: true,
    },
    // Schedule routes
    {
      path: '/schedules',
      name: 'schedules',
      component: () => import('@/views/ScheduleView.vue'),
    },
    {
      path: '/schedules/:id',
      name: 'schedule-detail',
      component: () => import('@/views/ScheduleView.vue'),
      props: true,
    },
    // Draft pick routes
    {
      path: '/draft-picks',
      name: 'draft-picks',
      component: () => import('@/views/DraftPickView.vue'),
    },
    {
      path: '/draft-picks/:id',
      name: 'draft-pick-detail',
      component: () => import('@/views/DraftPickView.vue'),
      props: true,
    },
    // Player award routes
    {
      path: '/player-awards',
      name: 'player-awards',
      component: () => import('@/views/PlayerAwardView.vue'),
    },
    {
      path: '/player-awards/:id',
      name: 'player-award-detail',
      component: () => import('@/views/PlayerAwardView.vue'),
      props: true,
    },
    // Combine score routes
    {
      path: '/combine-scores',
      name: 'combine-scores',
      component: () => import('@/views/CombineScoreView.vue'),
    },
    {
      path: '/combine-scores/:id',
      name: 'combine-score-detail',
      component: () => import('@/views/CombineScoreView.vue'),
      props: true,
    },
    // Not found route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
    {
      path: '/draft',
      name: 'draft',
      component: TeamSelectionView,
    },
    {
      path: '/draft-tracker',
      name: 'draft-tracker',
      component: DraftTrackerView,
    },
    // Draft Selection routes - nested under the parent view
    {
      path: '/draft-selections',
      component: DraftSelectionView,
      children: [
        {
          path: '/draft-selection-list',
          name: 'DraftSelectionList',
          component: DraftSelectionList,
          meta: {
            title: 'NFL Draft Selections',
          },
        },
        {
          path: 'create',
          name: 'CreateDraftSelection',
          component: DraftSelectionForm,
          meta: {
            title: 'Record Draft Pick',
          },
        },
        {
          path: ':id',
          name: 'DraftSelectionDetails',
          component: DraftSelectionDetails,
          meta: {
            title: 'Draft Pick Details',
          },
          props: (route) => {
            return { id: parseInt(route.params.id as string) }
          },
          beforeEnter: (to, _from, next) => {
            // Redirect to edit form if edit query param is true
            if (to.query.edit === 'true') {
              next({
                name: 'EditDraftSelection',
                params: { id: to.params.id },
                replace: true,
              })
            } else {
              next()
            }
          },
        },
        {
          path: ':id/edit',
          name: 'EditDraftSelection',
          component: DraftSelectionForm,
          meta: {
            title: 'Edit Draft Pick',
          },
          props: (route) => {
            return {
              id: parseInt(route.params.id as string),
              isEditMode: true,
            }
          },
        },
      ],
    },
    {
      path: '/batch/upload-prospects',
      name: 'upload-prospects',
      component: () => import('@/views/UploadProspectsView.vue'),
    },
    {
      path: '/batch/upload-combine-scores',
      name: 'upload-combine-scores',
      component: () => import('@/views/UploadCombineScoresView.vue'),
    },
  ],
})

export default router
