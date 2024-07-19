<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useForm } from '@/composables/useForm';
import { commandeSchemaCreate, commandSchemaUpdate } from '#shared/validations/schema/command.validation-schema.js';
import { getCommand } from "@/api/command.api";
import { createCommand, updateCommand } from '@/api/admin/command.api';
import Field from '@/components/ui/Field.vue';
import Button from '@/components/ui/Button.vue';
import { useAlertStore } from '@/stores/alerts.store.ts';
import { CommandType } from '@/types/command.type.ts';
import { SfInput, SfSelect } from '@storefront-ui/vue';
import router from "@/router";

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
} = useForm<CommandType, CommandType>({
  validationSchema: props.id ? orderSchemaUpdate : orderSchemaCreate,
  submitQuery: async (values) => {
    return props.id
        ? await updateCommand(props.id, values)
        : await createCommand(values);
  },
  onSuccess: (response) => {
    alertStore.showAlert(
        `Commande ${props.id ? 'mise à jour' : 'créée'} avec succès`,
        'positive'
    );
    if(!props.id){
      setTimeout(() => {
        router.push(`/admin/orders/view/${formData.id}`);
      }, 1000);
    }
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
      const response = await getCommand(props.id);
      if (response.isSuccess)
        initFormData(response.data);
    } catch (error) {
      alertStore.showAlert('Erreur lors du chargement des données', 'negative');
    }
  }
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full space-y-4">
    <Field label="Statut" id="status" :error="errors.status">
      <SfSelect v-model="formData.status" name="status" required class="w-full">
        <option value="processing">Processing</option>
        <option value="shipping">Shipping</option>
        <option value="delivered">Delivered</option>
        <option value="delivery_issue">Delivery Issue</option>
      </SfSelect>
    </Field>

    <Field label="Montant Total" id="totalAmount" :error="errors.totalAmount">
      <SfInput
          v-model="formData.totalAmount"
          name="totalAmount"
          required
          type="number"
          class="w-full"
      />
    </Field>

    <Button
        :loading="isSubmitting"
        :disabled="isSubmitting"
        type="submit"
        icon="Save"
        :label="props.id ? 'Mettre à jour' : 'Créer'"
        buttonClass="bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
        class="w-full"
    />

    <p v-if="serverError" class="sf-text-error mt-4 text-center">{{ serverError }}</p>
  </form>
</template>

<style scoped>
</style>
