<script lang="ts" setup>
import { onMounted } from 'vue';
import { useForm } from '@/composables/useForm';
import { productCategorySchemaCreate, productCategorySchemaUpdate } from '#shared/validations/schema/product-category.validation-schema';
import { getProductCategory } from "@/api/product-category.api";
import { createProductCategory, updateProductCategory } from '@/api/admin/product-category.api';
import Field from '@/components/ui/Field.vue';
import Button from '@/components/ui/Button.vue';
import { useAlertStore } from '@/stores/alerts.store';
import { ProductCategoryType } from '@/types/product-category.type';
import { SfInput, SfTextarea } from '@storefront-ui/vue';
import { autoResize } from "@/utils/divers.util.ts";

const props = defineProps<{
  id?: number;
}>();

const alertStore = useAlertStore();

const slugTransformer = (value: string) => value.toLowerCase().replace(/\s+/g, '-');
const emits = defineEmits(['success']);
const {
  formData,
  errors,
  serverError,
  isSubmitting,
  isDirty,
  initFormData,
    handleFileChange,
  handleSubmit,
} = useForm<ProductCategoryType, ProductCategoryType>({
  validationSchema: props.id ? productCategorySchemaUpdate : productCategorySchemaCreate,
  transformers: {
    slug: slugTransformer
  },
  submitQuery: async (values) => {
    return props.id
        ? await updateProductCategory(props.id, values)
        : await createProductCategory(values);
  },
  onSuccess: (response) => {
    alertStore.showAlert(
        `Catégorie de produit ${props.id ? 'mise à jour' : 'créée'} avec succès`,
        'positive'
    );
    emits('success');
  },
  onError: (error) => {
    console.error('Erreur lors de la soumission du formulaire:', error);
    alertStore.showAlert('Une erreur est survenue', 'negative');
  }
});

onMounted(async () => {
  if (props.id) {
    try {
      const response = await getProductCategory(props.id);
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
    <Field label="Nom" id="name" :error="errors.name">
      <SfInput
          v-model="formData.name"
          name="name"
          required
          class="w-full"
      />
    </Field>

    <Field label="Description" id="description" :error="errors.description">
      <SfTextarea
          v-model="formData.description"
          name="description"
          @input="autoResize"
          class="w-full resize-none max-h-42"
      />
    </Field>
    <input type="file" name="image" @change="handleFileChange" class="w-full" />
    <Field label="Slug" id="slug" :error="errors.slug">
      <SfInput
          v-model="formData.slug"
          name="slug"
          required
          class="w-full"
      />
    </Field>

    <Field label="ID de promotion" id="promotionId" :error="errors.PromotionId">
      <SfInput
          v-model="formData.PromotionId"
          name="promotionId"
          type="number"
          class="w-full"
      />
    </Field>


    <Button
        :loading="isSubmitting"
        :disabled="isSubmitting || !isDirty"
        type="submit"
        icon="Save"
        :label="id ? 'Mettre à jour' : 'Créer'"
        buttonClass="bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
        class="w-full"
    />

    <p v-if="serverError" class="sf-text-error mt-4 text-center">{{ serverError }}</p>
  </form>
</template>

