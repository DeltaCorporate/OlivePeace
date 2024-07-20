<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useForm } from '@/composables/useForm';
import { productSchemaCreate, productSchemaUpdate } from '#shared/validations/schema/product.validation-schema';
import { createProduct, updateProduct } from '@/api/admin/product.api';
import Field from '@/components/ui/Field.vue';
import Button from '@/components/ui/Button.vue';
import { useAlertStore } from '@/stores/alerts.store';
import { ProductType } from '@/types/product.type';
import { SfInput, SfSelect, SfTextarea } from '@storefront-ui/vue';
import { autoResize, slugify } from "@/utils/divers.util.ts";
import { getAllProductCategories } from "@/api/admin/product-category.api.ts";
import { getAllPromotions } from "@/api/admin/promotion.api.ts";
import { ProductCategoryType } from "@/types/product-category.type.ts";
import { PromotionType } from "@/types/promotion.type.ts";
import {getProduct} from "@/api/product.api.ts";
import {useRouter} from "vue-router";

const props = defineProps<{
  id?: number;
}>();

const alertStore = useAlertStore();
const productCategories = ref<ProductCategoryType[]|null>(null);
const promotions = ref<PromotionType[]|null>(null);

const emits = defineEmits(['success']);
const router = useRouter();
const {
  formData,
  errors,
  serverError,
  isSubmitting,
  initFormData,
  handleFileChange,
  handleSubmit,
} = useForm<ProductType, ProductType>({
  validationSchema: props.id ? productSchemaUpdate : productSchemaCreate,
  transformers: {
    name: (value) => {
      formData.slug = slugify(value);
      return value;
    },
    price: (value) => parseFloat(value),
    stock: (value) => parseInt(value),
  },
  submitQuery: async (values) => {
    return props.id ? await updateProduct(props.id, values) : await createProduct(values);
  },
  onSuccess: (response) => {
    router.push('/products/'+ formData.slug).then(() => {
      alertStore.showAlert(`Produit ${props.id ? 'mis à jour' : 'créé'} avec succès`, 'positive');

    });
    emits('success');
  },
  onError: (error) => {
    alertStore.showAlert('Une erreur est survenue', 'negative');
  }
});

onMounted(async () => {
  const fetchProductCategories = await getAllProductCategories('f_name=ord:ASC');
  const fetchPromotions = await getAllPromotions('f_name=ord:ASC');
  initFormData({});
  if (fetchProductCategories.isSuccess) productCategories.value = fetchProductCategories.data;
  if (fetchPromotions.isSuccess) promotions.value = fetchPromotions.data;
  if (props.id) {
    try {
      const response = await getProduct(props.id);
      if (response.isSuccess) initFormData(response.data);
    } catch (error) {
      alertStore.showAlert('Erreur lors du chargement des données', 'negative');
    }
  }
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Nom" id="name" :error="errors.name">
        <SfInput v-model="formData.name" name="name" required class="w-full"/>
      </Field>

      <Field label="Marque" id="brand" :error="errors.brand">
        <SfInput v-model="formData.brand" name="brand" required class="w-full"/>
      </Field>
    </div>

    <Field label="Description" id="description" :error="errors.description">
      <SfTextarea v-model="formData.description" name="description" @input="autoResize" class="w-full resize-none max-h-42"/>
    </Field>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Prix" id="price" :error="errors.price">
        <SfInput v-model="formData.price" name="price" type="number" step="0.01" required class="w-full"/>
      </Field>

      <Field label="Stock" id="stock" :error="errors.stock">
        <SfInput v-model="formData.stock" name="stock" type="number" step="1" required class="w-full"/>
      </Field>


    </div>
    <Field id="image" label="Image" :error="errors.image">
      <input type="file" name="image" @change="handleFileChange" class="w-full" />
    </Field>
    <Field label="Slug" id="slug" :error="errors.slug">
      <SfInput v-model="formData.slug" name="slug" readonly required class="w-full aria-readonly:bg-gray-100"/>
    </Field>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Catégorie" id="ProductCategoryId" :error="errors.ProductCategoryId">
        <SfSelect v-model="formData.ProductCategoryId" name="ProductCategoryId" class="w-full">
          <option v-for="category in productCategories" :key="category._id" :value="category._id">
            {{ category.name }}
          </option>
        </SfSelect>
      </Field>
      <Field label="Promotion" id="PromotionId" :error="errors.PromotionId">
        <SfSelect v-model="formData.PromotionId" name="PromotionId" class="w-full">
          <option value="">Aucune promotion</option>
          <option v-for="promotion in promotions" :key="promotion._id" :value="promotion._id">
            {{ promotion.name }} (-{{ promotion.value }}%)
          </option>
        </SfSelect>
      </Field>
    </div>



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