<script lang="ts" setup>
import {computed, onMounted} from 'vue';
import { useForm } from '@/composables/useForm';
import { createPromotionSchema, updatePromotionSchema } from '#shared/validations/schema/promotion.validation-schema';
import { getPromotion, createPromotion, updatePromotion } from '@/api/admin/promotion.api';
import Field from '@/components/ui/Field.vue';
import Button from '@/components/ui/Button.vue';
import { useAlertStore } from '@/stores/alerts.store';
import { PromotionType } from '@/types/promotion.type';
import { SfInput, SfSelect } from '@storefront-ui/vue';
import VueDatePicker from "@vuepic/vue-datepicker";
import {toFrenchDate} from "@/utils/date.util.ts";

const props = defineProps<{
  id?: number;
}>();

const alertStore = useAlertStore();

const emits = defineEmits(['success']);

const {
  formData,
  errors,
  serverError,
  isSubmitting,
  initFormData,
  handleSubmit,
} = useForm<PromotionType, PromotionType>({
  validationSchema: props.id ? updatePromotionSchema : createPromotionSchema,
  submitQuery: async (values) => {
    return props.id ? await updatePromotion(props.id, values) : await createPromotion(values);
  },
  onSuccess: (response) => {
    alertStore.showAlert(`Promotion ${props.id ? 'mise à jour' : 'créée'} avec succès`, 'positive');
    emits('success');
  },
  onError: (error) => {
    alertStore.showAlert('Une erreur est survenue', 'negative');
  }
});

onMounted(async () => {
  initFormData({});
  if (props.id) {
    try {
      const response = await getPromotion(props.id);
      if (response.isSuccess) initFormData(response.data);
    } catch (error) {
      alertStore.showAlert('Erreur lors du chargement des données', 'negative');
    }
  }

});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full space-y-4">
    <Field label="Nom" id="name" :error="errors.name">
      <SfInput v-model="formData.name" name="name" required class="w-full" />
    </Field>

    <Field label="Valeur" id="value" :error="errors.value">
      <SfInput v-model="formData.value" max="100" min="1" name="value" type="number" required class="w-full" />
    </Field>

    <Field label="Date d'expiration" id="expirationDate" :error="errors.expirationDate">
      <VueDatePicker v-model="formData.expirationDate"
                     :min-date="new Date()"
                     :format="toFrenchDate"
                     name="expirationDate"
                     type="date" required class="w-full" />
    </Field>

    <Button
        :loading="isSubmitting"
        :disabled="isSubmitting"
        type="submit"
        icon="Save"
        :label="id ? 'Mettre à jour' : 'Créer'"
        buttonClass="bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
        class="w-full"
    />

    <p v-if="serverError" class="sf-text-error mt-4 text-center">{{ serverError }}</p>
  </form>
</template>