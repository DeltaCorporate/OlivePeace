<script setup>
import {
  Home,
  Box,
    Menu,
  Users,
    TicketPercent,
UserCog,
} from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import {useSidebarStore} from "@/stores/admin/sidebar.store.ts";
import Return2Back from "@/components/ui/Return2Back.vue";

const sidebarStore = useSidebarStore();

</script>

<template>
    <button @click="sidebarStore.toggleSidebar" class="lg:hidden p-4 text-white bg-gray-800 fixed top-4 right-4 z-50 rounded-xl shadow-lg">
      <Menu class="h-6 w-6"/>
    </button>
    <div :class="{'translate-x-0': sidebarStore.isSidebarOpen, '-translate-x-full': !sidebarStore.isSidebarOpen}" class="sf-sidebar w-64 bg-gray-900 text-white h-screen lg:relative fixed lg:translate-x-0 transform transition-transform duration-300 ease-in-out z-40 shadow-lg rounded-tr-3xl rounded-br-3xl">
      <div class="flex flex-col items-center relative py-6">
        <img src="/logo-simple.svg" alt="Admin Logo" class="w-24 mb-6"/>
        <nav class="w-full">
          <router-link @click="sidebarStore.closeSidebar" to="/admin/product_categories" class="flex items-center w-full text-center py-3 px-4 hover:bg-gray-700 transition-colors duration-200">
            <UserCog class="h-5 w-5 mr-3"/> Mon Compte
          </router-link>
          <router-link @click="sidebarStore.closeSidebar" to="/admin/" class="flex items-center w-full text-center py-3 px-4 hover:bg-gray-700 transition-colors duration-200">
            <Home class="h-5 w-5 mr-3"/> Accueil
          </router-link>
          <router-link @click="sidebarStore.closeSidebar" to="/admin/product_categories" class="flex items-center w-full text-center py-3 px-4 hover:bg-gray-700 transition-colors duration-200">
            <Box class="h-5 w-5 mr-3"/> Catégorie de produit
          </router-link>
          <router-link @click="sidebarStore.closeSidebar" to="/admin/promotions" class="flex items-center w-full text-center py-3 px-4 hover:bg-gray-700 transition-colors duration-200">
            <TicketPercent class="h-5 w-5 mr-3"/> Catégorie de promotions
          </router-link>
          <router-link @click="sidebarStore.closeSidebar" to="/admin/product_categories" class="flex items-center w-full text-center py-3 px-4 hover:bg-gray-700 transition-colors duration-200">
            <Users class="h-5 w-5 mr-3"/> Utilisateurs
          </router-link>

        </nav>
      </div>
      <Return2Back class="bottom-5 left-5 absolute"/>
    </div>
</template>


