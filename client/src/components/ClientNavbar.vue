<script lang="ts" setup>
import {
  SfButton,
  SfIconShoppingCart,
  SfIconPerson,
  SfInput,
  SfIconSearch,
} from '@storefront-ui/vue';
import ProductSearchBar from "@/components/ProductSearchBar.vue";
import {useAuthStore} from "@/stores/auth.store.ts";

const actionItems = [
  {
    icon: SfIconShoppingCart,
    ariaLabel: 'Cart',
    role: 'button',
    label: '',
  },

  {
    label: 'Connexion',
    icon: SfIconPerson,
    ariaLabel: 'Log in',
    role: 'login',
  },
];

const authStore = useAuthStore();


</script>


<template>
  <header class="flex justify-center w-full py-2 px-4 lg:py-5 lg:px-6 bg-white border-b border-neutral-200">
    <div class="flex flex-wrap lg:flex-nowrap items-center flex-row justify-start h-full max-w-[1536px] w-full">

      <router-link to="/" class="inline-block mr-4 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm shrink-0">
        <picture>
          <source srcset="/logo-full.svg" media="(min-width: 768px)" />
          <img
              src="/logo-simple.svg"
              alt="Sf Logo"
              class="w-8 h-8 md:h-6 md:w-[176px] lg:w-[12.5rem] lg:h-[1.75rem]"
          />
        </picture>
      </router-link>
      <router-link to="/product_categories">
      <SfButton class="hidden lg:flex lg:mr-4" type="button" variant="tertiary">
        <span class="hidden lg:flex whitespace-nowrap">Catégories</span>
      </SfButton>
      </router-link>
      <ProductSearchBar />
      <nav class="flex-1 flex justify-end lg:order-last lg:ml-4">
        <div class="flex flex-row flex-nowrap">
          <router-link to="/cart">
            <SfButton
                class="mr-2 -ml-0.5 rounded-md text-primary-700 hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700"
                aria-label="Cart"
                variant="tertiary"
                square
            >
              <template #prefix>
                <SfIconShoppingCart />
              </template>
            </SfButton>
          </router-link>

            <SfButton
                @click="authStore.logout()"
                v-if="authStore.isAuthenticated"
                class="mr-2 -ml-0.5 rounded-md text-primary-700 hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700"
                aria-label="Log out"
                variant="tertiary"
                square
            >
              <template #prefix>
                <SfIconPerson />
              </template>
              <span class="hidden xl:inline-flex whitespace-nowrap">Déconnexion</span>
            </SfButton>
          <router-link v-if="!authStore.isAuthenticated" to="/auth/login">
            <SfButton
                class="mr-2 -ml-0.5 rounded-md text-primary-700 hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700"
                aria-label="Log in"
                variant="tertiary"
                square
            >
              <template #prefix>
                <SfIconPerson />
              </template>
              <span class="hidden xl:inline-flex whitespace-nowrap">Connexion</span>
            </SfButton>
          </router-link>
        </div>
      </nav>
    </div>
  </header>
</template>