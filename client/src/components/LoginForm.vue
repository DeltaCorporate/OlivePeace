<script setup lang="ts">
import { useForm } from '@/composables/useForm';
import { loginSchema } from '#shared/validations/schema/auth.validation-schema.js';
import { login } from '@/api/auth.api';
import Field from '@/components/ui/Field.vue';
import Button from '@/components/ui/Button.vue';
import { SfInput } from '@storefront-ui/vue';
import { onMounted } from "vue";
import { useAlertStore } from "@/stores/alerts.store.ts";
import { useRouter } from "vue-router";
import { pickError } from "@/utils/response.util.ts";
import {useAuthStore} from "@/stores/auth.store.ts";

const emit = defineEmits(['success', 'error']);
const alertStore = useAlertStore();
const router = useRouter();
const authStore = useAuthStore();
const {
  formData,
  errors,
  serverError,
  isSubmitting,
  initFormData,
  handleSubmit,
} = useForm({
  validationSchema: loginSchema,
  submitQuery: login,
  onSuccess: (response) => {
    alertStore.showAlert("Connexion réussie.", 'positive');
    authStore.setAuth(response.data.token, response.data);
    router.push('/');
  },
  onError: (error) => {
    const errorMessage = pickError(error.errors)?.message ?? "Une erreur est survenue lors de la connexion";
    alertStore.showAlert(errorMessage, 'negative');
  }
});

onMounted(() => {
  initFormData({});
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <Field label="Email" id="email" :error="errors.email">
      <SfInput v-model="formData.email" type="email" name="email" required />
    </Field>

    <Field label="Mot de passe" id="password" :error="errors.password">
      <SfInput v-model="formData.password" type="password" name="password" required />
    </Field>

    <Button
        :loading="isSubmitting"
        :disabled="isSubmitting"
        type="submit"
        icon="Login"
        label="Se connecter"
        buttonClass="bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
        class="w-full"
    />

    <p v-if="serverError" class="text-red-500 text-center mt-2">{{ serverError }}</p>
  </form>
</template>