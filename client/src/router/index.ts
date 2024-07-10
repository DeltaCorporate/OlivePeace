import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'

import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseLayout from "@/layouts/BaseLayout.vue";
import ProductCategoryList from "@/pages/admin/ProductCategoryList.vue";
import ProductCategoryDetail from "@/pages/admin/ProductCategoryDetail.vue";
import PromotionList from "@/pages/admin/PromotionList.vue";

const routes = [
    {
        path:  '/',
        component: BaseLayout,
    },
    {
        path:  '/admin',
        component: AdminLayout,
        children: [
            {
                path: 'product_categories',
                component: ProductCategoryList
            },
            {
                path: 'product_categories/view/:slug',
                component: ProductCategoryDetail,
            },
            {
                path: 'promotions',
                component: PromotionList,
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


export default router;
