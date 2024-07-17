<template>
  <div>
    <SfButton @click="openModal" variant="secondary">
      {{ buttonText }}
    </SfButton>
    <SfModal v-model="isModalOpen" title="Confirmation de suppression">
      <p>Êtes-vous sûr de vouloir supprimer ?</p>
      <div class="modal-actions">
        <SfButton @click="confirmDelete" variant="primary" :disabled="loading">
          <template #default>
            <span v-if="loading">Suppression...</span>
            <span v-else>Confirmer</span>
          </template>
        </SfButton>
        <SfButton @click="closeModal" variant="tertiary" :disabled="loading">Annuler</SfButton>
      </div>
      <template #footer>
        <div v-if="error" class="error">{{ error }}</div>
      </template>
    </SfModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { SfButton, SfModal } from '@storefront-ui/vue';

const props = defineProps({
  buttonText: {
    type: String,
    default: 'Supprimer'
  },
  onConfirm: {
    type: Function,
    required: true
  }
});

const isModalOpen = ref(false);
const loading = ref(false);
const error = ref('');

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  loading.value = false;
  error.value = '';
};

const confirmDelete = async () => {
  loading.value = true;
  error.value = '';
  try {
    await props.onConfirm();
    closeModal();
  } catch (e) {
    error.value = 'Une erreur est survenue lors de la suppression.';
    loading.value = false;
  }
  alert('Suppression confirmée !');
};
</script>

<style scoped>
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
