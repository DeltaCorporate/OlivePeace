import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'

import AdminLayout from '@/layouts/AdminLayout.vue'
import ProductCategoryList from "@/pages/ProductCategoryList.vue";
import AdminStockList from "@/pages/admin/StockList.vue";
import StockList from "@/pages/StockList.vue";
import CartLayout from "@/layouts/CartLayout.vue";
import AdminProductCategoryList from "@/pages/admin/ProductCategoryList.vue";
import ProductCategoryDetail from "@/pages/admin/ProductCategoryDetail.vue";
import PromotionList from "@/pages/admin/PromotionList.vue";
import BaseLayout from '@/layouts/BaseLayout.vue';
import Home from '@/pages/Home.vue';
import ProductList from "@/pages/ProductList.vue";
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
                path: 'cart',
                component: CartLayout
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
                name: "stock",
                path: 'stock',
                component: StockList,
            }
        ]
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
                path: 'stock',
                component: AdminStockList,
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


export default router;
