import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'

import AdminLayout from '@/layouts/AdminLayout.vue'
import AdminProductCategoryList from "@/pages/admin/ProductCategoryList.vue";
import ProductCategoryList from "@/pages/ProductCategoryList.vue";
import CartLayout from "@/layouts/CartLayout.vue";
import AdminProductCategoryList from "@/pages/admin/ProductCategoryList.vue";
import ProductCategoryDetail from "@/pages/admin/ProductCategoryDetail.vue";
import PromotionList from "@/pages/admin/PromotionList.vue";
import BaseLayout from '@/layouts/BaseLayout.vue';
import Home from '@/pages/Home.vue';
import ProductList from "@/pages/ProductList.vue";
import AdminCommandList from "@/pages/admin/CommandList.vue";
import CommandList from "@/pages/CommandList.vue";
const routes = [
    {
        path:  '/',
        component: BaseLayout,
        children: [
            {
                path: '',
                component: Home
            },
            {
                path: 'products',
                component: ProductList,
            },
            {
                path: 'product_categories',
                component: ProductCategoryList,
            },
            {

                name: "product_categories_products",
                path: 'product_categories/:slug/products',
                component: ProductList,
            },
            {
                path: 'commands',
                component: CommandList,
            }
        ]
    },
    {
        path: '/cart',
        component: CartLayout
    },
    {
        path:  '/admin',
        component: AdminLayout,
        children: [
            {
                path: 'product_categories',
                component: AdminProductCategoryList
            },
            {
                path: 'product_categories/view/:slug',
                component: ProductCategoryDetail,
            },
            {
                path: 'promotions',
                component: PromotionList,
            },
            {
                name: "commands",
                path: 'commands',
                component: AdminCommandList,
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


export default router;
