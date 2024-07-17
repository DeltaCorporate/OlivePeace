<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { confirmEmail } from '@/api/auth.api';
import { useAlertStore } from '@/stores/alerts.store';
import { SfLoaderCircular } from '@storefront-ui/vue';
import {pickError} from "@/utils/response.util.ts";
import {useClientLayoutStore} from "@/stores/client-layout.store.ts";

const route = useRoute();
const router = useRouter();
const alertStore = useAlertStore();
const clientLayoutStore = useClientLayoutStore();
const isLoading = ref(true);
const isSuccess = ref(false);

clientLayoutStore.setPageTitle("Confirmation de l'email");
onMounted(async () => {
  const token = route.params.token as string;
  const response = await confirmEmail(token);
    if (response.isSuccess) {
      isSuccess.value = true;
      alertStore.showAlert("Votre email a été confirmé avec succès.", 'positive');
      await router.push('/auth/login');
    }else
      alertStore.showAlert(pickError(response.errors).message ?? "Impossible de vérifier l'email", 'negative', 0);
});
</script>

<template>
  <div class="max-w-md mx-auto mt-8 text-center">
    <div v-if="isLoading">
      <SfLoaderCircular size="lg" />
      <p class="mt-4">Confirmation de votre email en cours...</p>
    </div>
    <div v-else-if="isSuccess">
      <p class="mt-2">Vous allez être redirigé vers la page de connexion...</p>
    </div>
  </div>
</template>