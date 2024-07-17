<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue';
import { useClientLayoutStore } from "@/stores/client-layout.store.ts";
import { SfLink } from '@storefront-ui/vue';

const clientLayoutStore = useClientLayoutStore();
clientLayoutStore.setPageTitle("Connexion");
</script>

<template>
  <div class="max-w-md mx-auto mt-8">
    <LoginForm />
    <div class="mt-4 text-center">
      <router-link to="/auth/register">
        <SfLink  class="text-primary-600 hover:text-primary-700">
          Pas encore de compte ? S'inscrire
        </SfLink>
      </router-link>
    </div>
    <div class="mt-2 text-center">
      <SfLink href="/auth/forgot-password" class="text-primary-600 hover:text-primary-700">
        Mot de passe oublié ?
      </SfLink>
    </div>
  </div>
</template>