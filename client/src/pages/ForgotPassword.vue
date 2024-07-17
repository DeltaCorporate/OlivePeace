<script setup lang="ts">
import { useForm } from '@/composables/useForm';
import { requestPasswordResetSchema } from '#shared/validations/schema/user.validation-schema.js';
import { requestPasswordReset } from '@/api/auth.api';
import Field from '@/components/ui/Field.vue';
import Button from '@/components/ui/Button.vue';
import { SfInput } from '@storefront-ui/vue';
import { onMounted } from "vue";
import { useAlertStore } from "@/stores/alerts.store.ts";
import { useRouter } from "vue-router";
import { pickError } from "@/utils/response.util.ts";
import { useClientLayoutStore } from "@/stores/client-layout.store.ts";

const alertStore = useAlertStore();
const router = useRouter();
const clientLayoutStore = useClientLayoutStore();

clientLayoutStore.setPageTitle("Mot de passe oublié");

const {
  formData,
  errors,
  serverError,
  isSubmitting,
  initFormData,
  handleSubmit,
} = useForm({
  validationSchema: requestPasswordResetSchema,
  submitQuery: (data) => requestPasswordReset(data.email),
  onSuccess: () => {
    alertStore.showAlert("Un email de réinitialisation a été envoyé si l'adresse existe.", 'positive');
    router.push('/auth/login');
  },
  onError: (error) => {
    const errorMessage = pickError(error.errors)?.message ?? "Une erreur est survenue lors de la demande de réinitialisation";
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
      <Field label="Email" id="email" :error="errors.email">
        <SfInput v-model="formData.email" type="email" name="email" required />
      </Field>
      <Button
          :loading="isSubmitting"
          :disabled="isSubmitting"
          type="submit"
          icon="Send"
          label="Envoyer le lien de réinitialisation"
          buttonClass="bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
          class="w-full"
      />

      <p v-if="serverError" class="text-red-500 text-center mt-2">{{ serverError }}</p>
    </form>
  </div>
</template>

