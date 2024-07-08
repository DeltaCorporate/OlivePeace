<template>
  <div>
    <button @click="openModal" class="btn">Delete</button>
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <p>Are you sure you want to delete this item?</p>
        <button @click="confirmDeletion" class="btn" :disabled="isDeleting">Yes</button>
        <button @click="closeModal" class="btn">No</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const isModalOpen = ref(false);
    const isDeleting = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const confirmDeletion = async () => {
      isDeleting.value = true;
      try {
        // simulate deletion request
        await new Promise((resolve) => setTimeout(resolve, 1000));
        isModalOpen.value = false;
      } catch (error) {
        console.error(error);
      } finally {
        isDeleting.value = false;
      }
    };

    return {
      isModalOpen,
      isDeleting,
      openModal,
      closeModal,
      confirmDeletion,
    };
  },
});
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background-color: white;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}
</style>
