<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { SfButton } from '@storefront-ui/vue';
import {PaginationInterface} from "@/types/pagination.type.ts";

const props = defineProps<PaginationInterface>();

const emits = defineEmits(['pageChange']);

const pages = computed(() => {
  const pagesArray = [];
  const startPage = Math.max(1, props.currentPage - 2);
  const endPage = Math.min(props.totalPages, props.currentPage + 2);
  for (let i = startPage; i <= endPage; i++)
    pagesArray.push(i);
  return pagesArray;
});

function changePage(page: number) {
  if (page > 0 && page <= props.totalPages)
    emits('pageChange', page);
}

function nextPage() {
  if (props.currentPage < props.totalPages)
    changePage(props.currentPage + 1);

}

function prevPage() {
  if (props.currentPage > 1)
    changePage(props.currentPage - 1);

}
</script>

<template>
  <div class="flex items-center justify-end gap-2 mt-4">
    <SfButton class="bg-primary-500 text-white" @click="prevPage" :disabled="props.currentPage === 1">
      <
    </SfButton>
    <div class="flex space-x-2">
      <SfButton
          v-for="page in pages"
          :key="page"
          class="px-3 py-1"
          :class="{'bg-primary-500 text-white': page === props.currentPage, 'bg-white text-primary-600 hover:text-white': page !== props.currentPage}"
          @click="changePage(page)"
      >
        {{ page }}
      </SfButton>
    </div>
    <SfButton class="bg-primary-500 text-white" @click="nextPage" :disabled="props.currentPage === props.totalPages">
      >
    </SfButton>
  </div>
</template>

<style scoped>
</style>
