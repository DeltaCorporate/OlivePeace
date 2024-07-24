<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { SfInput, SfButton, SfSelect } from '@storefront-ui/vue';
import { useForm } from '@/composables/useForm';
import { useAlertStore } from '@/stores/alerts.store';
import { createUser, updateUser, getUser } from '@/api/admin/user.api';
import Field from '@/components/ui/Field.vue';
import { userSchemaCreate, userSchemaUpdate } from '#shared/validations/schema/user.validation-schema.js';

const props = defineProps({
  userId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['success']);
const alertStore = useAlertStore();
const isEditing = computed(() => !!props.userId);

const availableRoles = [
  { value: 'ROLE_USER', label: 'Utilisateur' },
  { value: 'ROLE_ADMIN', label: 'Administrateur' },
  { value: 'ROLE_STORE_KEEPER', label: 'Gestionnaire de stock' }
];

const {
  formData,
  errors,
  isSubmitting,
  handleSubmit,
  initFormData
} = useForm({
  validationSchema: isEditing.value ? userSchemaUpdate : userSchemaCreate,
  submitQuery: async (values) => {
    return isEditing.value
        ? await updateUser(props.userId, values)
        : await createUser(values);
  },
  onSuccess: (response) => {
    alertStore.showAlert(`Utilisateur ${isEditing.value ? 'mis à jour' : 'créé'} avec succès`, 'positive');
    emit('success');
  },
  onError: (error) => {
    alertStore.showAlert(`Erreur lors de ${isEditing.value ? 'la mise à jour' : 'la création'} de l'utilisateur`, 'negative');
  }
});

onMounted(async () => {
  if (isEditing.value) {
    const response = await getUser(props.userId);
    if (response.isSuccess) {
      initFormData(response.data);
    }
  }
});
</script>

<template>
  <div class="user-form w-full">
    <h2>{{ isEditing ? 'Modifier' : 'Créer' }} un utilisateur</h2>
    <form @submit.prevent="handleSubmit">
      <Field label="Email" id="email" :error="errors.email">
        <SfInput v-model="formData.email" type="email" name="email" required />
      </Field>
      <div class="grid grid-cols-2 gap-3">
        <Field label="Prénom" id="firstName" :error="errors.firstName">
          <SfInput v-model="formData.firstName" name="firstName" required />
        </Field>
        <Field label="Nom" id="lastName" :error="errors.lastName">
          <SfInput v-model="formData.lastName" name="lastName" required />
        </Field>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <Field label="Code postal" id="zipCode" :error="errors.zipCode">
          <SfInput v-model="formData.zipCode" name="zipCode" required />
        </Field>
        <Field label="Ville" id="city" :error="errors.city">
          <SfInput v-model="formData.city" name="city" required />
        </Field>
      </div>
      <Field label="Adresse" id="address" :error="errors.address">
        <SfInput v-model="formData.address" name="address" required />
      </Field>
      <Field label="Rôles" id="roles" :error="errors.roles">
        <SfSelect v-model="formData.roles" multiple>
          <option v-for="role in availableRoles" :key="role.value" :value="role.value">
            {{ role.label }}
          </option>
        </SfSelect>
      </Field>
      <Field v-if="!isEditing" label="Mot de passe" id="password" :error="errors.password">
        <SfInput v-model="formData.password" type="password" name="password" required />
      </Field>
      <div class="flex justify-end">
        <SfButton type="submit" :loading="isSubmitting">
          {{ isEditing ? 'Mettre à jour' : 'Créer' }}
        </SfButton>
      </div>
    </form>
  </div>
</template>