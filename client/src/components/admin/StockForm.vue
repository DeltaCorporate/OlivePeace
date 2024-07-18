<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useForm } from '@/composables/useForm';
import { stockSchemaCreate, stockSchemaUpdate } from '#shared/validations/schema/stock.validation-schema';
import { getStock } from "@/api/stock.api";
import { createStock, updateStock } from '@/api/admin/stock.api';
import Field from '@/components/ui/Field.vue';
import Button from '@/components/ui/Button.vue';
import { useAlertStore } from '@/stores/alerts.store';
import { StockType } from '@/types/stock.type';
import { SfInput, SfSelect, SfTextarea } from '@storefront-ui/vue';
import router from "@/router";
import { getProducts } from "@/api/product.api.ts";
import { ProductType } from "@/types/product.type.ts";

const props = defineProps<{
  id?: number;
}>();

const alertStore = useAlertStore();
const products = ref<ProductType[] | null>(null);

const emits = defineEmits(['success']);
const {
  formData,
  errors,
  serverError,
  isSubmitting,
  initFormData,
  handleFileChange,
  handleSubmit,
} = useForm<StockType, StockType>({
  validationSchema: props.id ? stockSchemaUpdate : stockSchemaCreate,
  submitQuery: async (values) => {
    return props.id
        ? await updateStock(props.id, values)
        : await createStock(values);
  },
  onSuccess: (response) => {
    alertStore.showAlert(
        `Stock ${props.id ? 'mis à jour' : 'créé'} avec succès`,
        'positive'
    );
    if(!props.id){
      setTimeout(() => {
        router.push(`/admin/stock/view/${formData.id}`);
      }, 1000);
    }
    emits('success');
  },
  onError: (error) => {
    alertStore.showAlert('Une erreur est survenue', 'negative');
  }
});

onMounted(async () => {
  const fetchProducts = await getProducts();
  initFormData({});
  if(fetchProducts.isSuccess)
    products.value = fetchProducts.data;

  if (props.id) {
    try {
      const response = await getStock(props.id);
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
    <Field label="Produit" id="productId" :error="errors.productId">
      <SfSelect v-model="formData.productId" name="productId" required class="w-full">
        <option v-for="product in products" :key="product.id" :value="product.id">
          {{ product.name }}
        </option>
      </SfSelect>
    </Field>

    <Field label="Quantité" id="quantity" :error="errors.quantity">
      <SfInput
          v-model="formData.quantity"
          name="quantity"
          required
          type="number"
          class="w-full"
      />
    </Field>

    <Field label="Localisation" id="location" :error="errors.location">
      <SfInput
          v-model="formData.location"
          name="location"
          required
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
