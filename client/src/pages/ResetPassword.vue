
<script setup lang="ts">
import { useForm } from '@/composables/useForm';
import { resetPasswordSchema } from '#shared/validations/schema/auth.validation-schema.js';
import { resetPassword } from '@/api/auth.api';
import Field from '@/components/ui/Field.vue';
import Button from '@/components/ui/Button.vue';
import { SfInput } from '@storefront-ui/vue';
import { onMounted } from "vue";
import { useAlertStore } from "@/stores/alerts.store.ts";
import { useRouter, useRoute } from "vue-router";
import { pickError } from "@/utils/response.util.ts";
import { useClientLayoutStore } from "@/stores/client-layout.store.ts";

const alertStore = useAlertStore();
const router = useRouter();
const route = useRoute();
const clientLayoutStore = useClientLayoutStore();

clientLayoutStore.setPageTitle("Réinitialisation du mot de passe");

const token = route.params.token as string;

const {
  formData,
  errors,
  serverError,
  isSubmitting,
  initFormData,
  handleSubmit,
} = useForm({
  validationSchema: resetPasswordSchema,
  submitQuery: (data) => resetPassword(token, data.password),
  onSuccess: () => {
    alertStore.showAlert("Votre mot de passe a été réinitialisé avec succès.", 'positive');
    router.push('/auth/login');
  },
  onError: (error) => {
    const errorMessage = pickError(error.errors)?.message ?? "Une erreur est survenue lors de la réinitialisation du mot de passe";
    alertStore.showAlert(errorMessage, 'negative');
  }
});

onMounted(() => {
  initFormData({});
});
</script>

<template>
  <div class="max-w-md mx-auto mt-8">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <Field label="Nouveau mot de passe" id="password" :error="errors.password">
        <SfInput v-model="formData.password" type="password" name="password" required />
      </Field>

      <Field label="Confirmer le mot de passe" id="confirmPassword" :error="errors.confirmPassword">
        <SfInput v-model="formData.confirmPassword" type="password" name="confirmPassword" required />
      </Field>

      <Button
          :loading="isSubmitting"
          :disabled="isSubmitting"
          type="submit"
          icon="Save"
          label="Réinitialiser le mot de passe"
          buttonClass="bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
          class="w-full"
      />

      <p v-if="serverError" class="text-red-500 text-center mt-2">{{ serverError }}</p>
    </form>
  </div>
</template>
