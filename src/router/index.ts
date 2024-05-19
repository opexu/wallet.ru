import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:catchAll(.*)*',
            redirect: 'home',
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            children: [
                {
                    path: '/settings',
                    name: 'settings',
                    component: () => import('../views/Settings.vue'),
                },
                {
                    path: '/order-book',
                    name: 'order-book',
                    component: () => import('../views/OrderBook.vue'),
                }
                
            ]
        },

    ]
})

export default router
