import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import ProductCategoryList from "@/pages/ProductCategoryList.vue";
import Cart from "@/pages/Cart.vue";
import AdminProductCategoryList from "@/pages/admin/ProductCategoryList.vue";
import ProductCategoryDetail from "@/pages/admin/ProductCategoryDetail.vue";
import PromotionList from "@/pages/admin/PromotionList.vue";
import BaseLayout from '@/layouts/BaseLayout.vue';
import Home from '@/pages/Home.vue';
import ProductList from "@/pages/ProductList.vue";
import Register from "@/pages/Register.vue";
import ConfirmEmail from "@/pages/ConfirmEmail.vue";
import Login from "@/pages/Login.vue";
import ResetPassword from "@/pages/ResetPassword.vue";
import ForgotPassword from "@/pages/ForgotPassword.vue";
import ProductDetail from "@/pages/ProductDetail.vue";
import AdminProductList from "@/pages/admin/ProductList.vue";
import Dashboard from "@/pages/admin/Dashboard.vue";
import DashboardLayoutEditor from "@/components/admin/DashboardLayoutEditor.vue";
import DashboardLayoutList from "@/components/admin/DashboardLayoutList.vue";
import UserList from "@/pages/admin/UserList.vue";
import OrderHistory from "@/pages/OrderHistory.vue";
import Order from "@/pages/Order.vue";
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
                path: '/auth/register',
                component: Register
            },
            {
                path: '/auth/confirm-email/:token',
                component: ConfirmEmail
            },
            {
                path: '/auth/login',
                component: Login
            },
            {
                path: '/auth/forgot-password',
                component: ForgotPassword
            },
            {
                path: '/auth/reset-password/:token',
                component: ResetPassword
            },
            {
                path: '/cart/:userId',
                component: Cart
            },
            {
                path: '/products/:slug',
                component: ProductDetail,
            },
            {
                path: 'orders',
                component: OrderHistory,
            },
            {
                path: 'orders/:id',
                component: Order
            }
        ]
    },
    {
        path:  '/admin',
        component: AdminLayout,
        children: [
            {
                path: '',
                component: Dashboard
            },
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
                path: 'products',
                component: AdminProductList,
            },
            {
                path: 'users',
                component: UserList,
            },
        ]
    },
    {
        path: '/admin/dashboard-layouts',
        component: AdminLayout,
        children: [
            { path: '', name: 'DashboardLayoutList', component: DashboardLayoutList },
            { path: 'create', name: 'CreateDashboardLayout', component: DashboardLayoutEditor },
            { path: 'edit/:id', name: 'EditDashboardLayout', component: DashboardLayoutEditor },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


export default router;
