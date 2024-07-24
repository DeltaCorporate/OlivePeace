<script setup lang="ts">
import { useForm } from '@/composables/useForm';
import { registerSchema } from '#shared/validations/schema/auth.validation-schema.js';
import { register } from '@/api/auth.api';
import Field from '@/components/ui/Field.vue';
import Button from '@/components/ui/Button.vue';
import { SfInput } from '@storefront-ui/vue';
import {onMounted} from "vue";
import {useAlertStore} from "@/stores/alerts.store.ts";
import {useRouter} from "vue-router";

const emit = defineEmits(['success', 'error']);
const alertStore = useAlertStore();
const router = useRouter();
const {
  formData,
  errors,
  serverError,
  isSubmitting,
    initFormData,
  handleSubmit,
} = useForm({
  validationSchema: registerSchema,
  submitQuery: register,
  onSuccess: (response) => {
    alertStore.showAlert("Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.", 'positive');
    router.push('/auth/login');
  },
  onError: (error) => {
    alertStore.showAlert("Une erreur est survenue lors de l'inscription", 'negative');
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


    <!--- address layout --->
    <div class="grid grid-cols-2 w-full  gap-3">
      <Field label="Code Postal" id="zipCode" :error="errors.zipCode">
        <SfInput v-model="formData.zipCode" pattern="\d{5,5}" name="zipCode" required />
      </Field>

      <Field label="Ville" id="city" :error="errors.city">
        <SfInput v-model="formData.city" name="city" required />
      </Field>
    </div>
    <Field class="w-full" label="Adresse" id="address" :error="errors.address">
      <SfInput v-model="formData.address" name="address" required />
    </Field>
    <Field label="Nom" id="lastName" :error="errors.lastName">
      <SfInput v-model="formData.lastName" name="lastName" required />
    </Field>
    <Field label="Prénom" id="firstName" :error="errors.firstName">
      <SfInput v-model="formData.firstName" name="firstName" required />
    </Field>
    <Button
        :loading="isSubmitting"
        :disabled="isSubmitting"
        type="submit"
        icon="Save"
        label="S'inscrire"
        buttonClass="bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
        class="w-full"
    />

    <p v-if="serverError" class="text-red-500 text-center mt-2">{{ serverError }}</p>
  </form>
</template>