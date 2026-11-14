import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router';
import {HISTORY_MODES, ROUTE_NAMES} from '@/core/constants';

import GamePage from '@/pages/GamePage.vue';

function createHistory() {
    if (import.meta.env.VITE_HISTORY === HISTORY_MODES.memory) {
        return createMemoryHistory();
    }

    return createWebHistory(import.meta.env.BASE_URL);
}

export const router = createRouter({
    history: createHistory(),
    routes: [
        {path: '/', name: ROUTE_NAMES.game, component: GamePage},
        {path: '/:pathMatch(.*)*', redirect: {name: ROUTE_NAMES.game}},
    ],
});
