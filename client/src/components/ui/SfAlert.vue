<template>
  <div
      v-if="visible"
      :class="alertClass"
      class="flex animate-fade-left animate-duration-300
 items-start md:items-center max-w-[600px] shadow-md pr-2 pl-4 ring-1 fixed bottom-5 right-10 z-10 typography-text-sm md:typography-text-base py-1 rounded-md"
  >
    <component :is="icon" class="my-2 mr-2 shrink-0" />
    <p class="py-2 mr-2">{{ message }}</p>
    <button
        v-if="type !== 'info'"
        type="button"
        @click="closeAlert"
        class="p-1.5 md:p-2 ml-auto rounded-md focus-visible:outline focus-visible:outline-offset"
        :class="buttonClass"
        aria-label="Close alert"
    >
      <SfIconClose class="hidden md:block" />
      <SfIconClose size="sm" class="block md:hidden" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAlertStore } from '@/stores/alerts.store.ts';
import { SfIconClose, SfIconCheckCircle, SfIconInfo, SfIconWarning } from '@storefront-ui/vue';

const store = useAlertStore();

const visible = computed(() => store.visible);
const message = computed(() => store.message);
const type = computed(() => store.type);


const icon = computed(() => {
  switch (type.value) {
    case 'positive':
      return SfIconCheckCircle;
    case 'negative':
      return SfIconClose;
    case 'warning':
      return SfIconWarning;
    case 'info':
      return SfIconInfo;
    default:
      return null;
  }
});

const alertClass = computed(() => {
  switch (type.value) {
    case 'positive':
      return 'bg-positive-100 ring-positive-200 text-positive-700';
    case 'negative':
      return 'bg-negative-100 ring-negative-300 text-negative-700';
    case 'warning':
      return 'bg-warning-100 ring-warning-200 text-warning-700';
    case 'info':
      return 'bg-secondary-100 ring-secondary-200 text-secondary-700';
    default:
      return '';
  }
});

const buttonClass = computed(() => {
  switch (type.value) {
    case 'positive':
      return 'hover:bg-positive-200 active:bg-positive-300 hover:text-positive-800 active:text-positive-900';
    case 'negative':
      return 'hover:bg-negative-200 active:bg-negative-300 hover:text-negative-800 active:text-negative-900';
    case 'warning':
      return 'hover:bg-warning-200 active:bg-warning-300 hover:text-warning-800 active:text-warning-900';
    default:
      return '';
  }
});

function closeAlert() {
  store.hideAlert();
}
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
