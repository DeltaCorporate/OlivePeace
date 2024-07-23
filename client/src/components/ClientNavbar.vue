<script lang="ts" setup>
import {
  SfIconShoppingCart,
  SfIconPerson,
  SfInput,
  SfIconSearch, SfDropdown, useDisclosure, SfButton, SfIconLogout, SfModal,
} from '@storefront-ui/vue';

import {ChevronDown,ChevronUp,FilePenLine,ClipboardList} from "lucide-vue-next";
import ProductSearchBar from "@/components/ProductSearchBar.vue";
import {useAuthStore} from "@/stores/auth.store.ts";
import Button from "@/components/ui/Button.vue";
import {hasRoles} from "@/utils/divers.util.ts";
import { useAlertStore } from '@/stores/alerts.store';
import { deleteAccount } from '@/api/auth.api';
import {ref} from "vue";
import {pickError} from "@/utils/response.util.ts";

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
const { isOpen, toggle } = useDisclosure();

const alertStore = useAlertStore();
const showDeleteAccountModal = ref(false);

const hasRole = (roles) => {
  return roles.some(role => authStore.user.roles.includes(role));
};
const openDeleteAccountModal = () => {
  showDeleteAccountModal.value = true;
};

const deleteMyAccount = async () => {
  const response = await deleteAccount();
  showDeleteAccountModal.value = false;

  if(response.isSuccess){
    alertStore.showAlert('Votre compte a été supprimé avec succès', 'success');
    authStore.logout();
  }else {
    alertStore.showAlert(pickError(response.errors)?.message ?? "Une erreur est survenue lors de la suppression du compte", 'error');
    showDeleteAccountModal.value = false;
  }


};

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
          <router-link v-if="authStore.isAuthenticated" to="/cart/${userId}">
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

          <SfDropdown v-if="authStore.isAuthenticated" v-model="isOpen">
            <template #trigger>
              <Button class="flex flex-1 flex-row-reverse justify-start" :icon="isOpen ? ChevronUp : ChevronDown" variant="tertiary" :label="authStore.fullName" @click="toggle"/>
            </template>

            <div class="flex py-3 px-5 grid gap-5 bg-neutral-50 shadow z-20 relative">
              <div>
                <SfButton
                    @click="authStore.logout()"
                    class="mr-2 -ml-0.5 rounded-md text-primary-700 hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700"
                    aria-label="Log out"
                    variant="tertiary"
                    square
                >
                  <template #prefix>
                    <SfIconLogout />
                  </template>
                  <span class="xl:inline-flex cursor-pointer whitespace-nowrap">Déconnexion</span>
                </SfButton>
              </div>


              <router-link v-if="hasRoles(['ROLE_ADMIN'])" to="/admin">
                <SfButton
                    class="mr-2 -ml-0.5 rounded-md text-primary-700 hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700"
                    aria-label="Panel admin"
                    variant="tertiary"
                    square
                >
                  <template #prefix>
                    <FilePenLine />
                  </template>
                  <span class=" xl:inline-flex cursor-pointer">Panel admin</span>
                </SfButton>
              </router-link>

              <SfButton v-if="!hasRole(['ROLE_ADMIN'])" @click="openDeleteAccountModal" class="mr-2 -ml-0.5 rounded-md text-negative-700 hover:bg-negative-100 active:bg-negative-200 hover:text-negative-600 active:text-negative-700" aria-label="Delete Account" variant="tertiary" square>
                <template #prefix>
                  <Trash2 />
                </template>
                <span class="xl:inline-flex cursor-pointer whitespace-nowrap">Supprimer mon compte</span>
              </SfButton>
              <router-link to="/orders" custom v-slot="{ navigate }">
                <SfButton @click="navigate" class="mr-2 -ml-0.5 rounded-md text-primary-700 hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700" aria-label="Order History" variant="tertiary" square>
                  <template #prefix>
                    <ClipboardList />
                  </template>
                  <span class="xl:inline-flex cursor-pointer whitespace-nowrap">Historique des commandes</span>
                </SfButton>
              </router-link>
              <SfModal v-model="showDeleteAccountModal">
                <h2>Confirmation de suppression de compte</h2>
                <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
                <div class="flex justify-end mt-4">
                  <SfButton @click="deleteMyAccount" variant="danger">Confirmer la suppression</SfButton>
                  <SfButton @click="showDeleteAccountModal = false" variant="secondary" class="ml-2">Annuler</SfButton>
                </div>
              </SfModal>
            </div>

          </SfDropdown>

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
              <span class="xl:inline-flex whitespace-nowrap">Connexion</span>
            </SfButton>
          </router-link>
        </div>
      </nav>
    </div>
  </header>
</template>