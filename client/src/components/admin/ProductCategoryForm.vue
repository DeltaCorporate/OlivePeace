<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import { useForm } from '@/composables/useForm';
import { productCategorySchemaCreate, productCategorySchemaUpdate } from '#shared/validations/schema/product-category.validation-schema';
import { getProductCategory } from "@/api/product-category.api";
import { createProductCategory, updateProductCategory } from '@/api/admin/product-category.api';
import Field from '@/components/ui/Field.vue';
import Button from '@/components/ui/Button.vue';
import { useAlertStore } from '@/stores/alerts.store';
import { ProductCategoryType } from '@/types/product-category.type';
import {SfInput, SfSelect, SfTextarea} from '@storefront-ui/vue';
import {autoResize, slugify} from "@/utils/divers.util.ts";
import router from "@/router";
import {getAllPromotions} from "@/api/admin/promotion.api.ts";
import {PromotionType} from "@/types/promotion.type.ts";

const props = defineProps<{
  id?: number;
}>();

const alertStore = useAlertStore();
const promotions = ref<PromotionType[] | null>(null);

const emits = defineEmits(['success']);
const {
  formData,
  errors,
  serverError,
  isSubmitting,
  initFormData,
    handleFileChange,
  handleSubmit,
} = useForm<ProductCategoryType, ProductCategoryType>({
  validationSchema: props.id ? productCategorySchemaUpdate : productCategorySchemaCreate,
  transformers: {
    name: (value) => {
      formData.slug = slugify(value);
      return value;
    }
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
    if(!props.id){
      setTimeout(() => {
        router.push(`/admin/product_categories/view/${formData.id}`);
      }, 1000);
    }
    emits('success');
  },
  onError: (error) => {
    alertStore.showAlert('Une erreur est survenue', 'negative');
  }
});

onMounted(async () => {
  const fetchPromotions = await getAllPromotions('f_name=ord:ASC');
   initFormData({});
  if(fetchPromotions.isSuccess)
    promotions.value = fetchPromotions.data;

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
    <Field id="image" label="Image" :error="errors.image">
      <input type="file" name="image" @change="handleFileChange" class="w-full" />
    </Field>
    <Field label="Slug" id="slug" :error="errors.slug">
      <SfInput
          v-model="formData.slug"
          name="slug"
          readonly
          required
          class="w-full aria-readonly:bg-gray-100"
      />
    </Field>

    <Field  label="Appliquer une promotion ?" id="promotionId" :error="errors.PromotionId">
      <SfInput v-if="!promotions"
          v-model="formData.PromotionId"
          name="promotionId"
          type="number"
          class="w-full"
      />
      <SfSelect v-else
          v-model="formData.PromotionId"
          name="promotionId"
          class="w-full">
        <option value="">Aucune promotion</option>
        <option
            v-for="promotion in promotions"
            :key="promotion._id"
            :value="promotion._id">{{promotion.name}} (-{{promotion.value}}%)</option>
      </SfSelect>
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

