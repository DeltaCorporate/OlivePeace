import { createMemoryHistory, createRouter } from 'vue-router'

import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseLayout from "@/layouts/BaseLayout.vue";
import ProductCategoryList from "@/pages/admin/ProductCategoryList.vue";

const routes = [
    {
        path:  '/',
        component: BaseLayout,
    },
    {
        path:  '/admin',
        component: AdminLayout,
        children: [{
            path: 'product_categories',
            component: ProductCategoryList
        }]
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router;
