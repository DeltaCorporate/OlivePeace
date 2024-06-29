<script setup lang="ts">
import { ref, defineEmits, defineProps, useSlots, reactive, computed } from 'vue';
import FilterBuilder from '@/utils/filter.util.ts';
import OpTablePagination from './OpTablePagination.vue';
import { SfInput } from '@storefront-ui/vue';
import { PaginationInterface } from "@/types/pagination.type.ts";
import {debounce} from "@/utils/debounce.utils.ts";

const props = defineProps<{
  rowKeyField: string;
  data: object[];
  pagination: PaginationInterface;
}>();

const emits = defineEmits(['sort', 'pageChange', 'search']);
const slots = useSlots();

const sortOrders = ref<{ [key: string]: 'ASC' | 'DESC' | null }>({});
const searchTerms = reactive<{ [key: string]: string }>({});
const filterBuilder = ref(new FilterBuilder());

function handleSort(property: string) {
  if (sortOrders.value[property] === 'ASC') sortOrders.value[property] = 'DESC';
  else if (sortOrders.value[property] === 'DESC') sortOrders.value[property] = null;
  else sortOrders.value[property] = 'ASC';

  Object.keys(sortOrders.value).forEach((key) => {
    if (sortOrders.value[key])
      filterBuilder.value.add(key).ord(sortOrders.value[key]);
    else filterBuilder.value.remove(key, 'ord');
  });
  emits('sort', filterBuilder.value);
}

function handlePageChange(page: number) {
  emits('pageChange', page);
}

const handleSearch = debounce((property: string, value: string) => {
  searchTerms[property] = value;
  Object.keys(searchTerms).forEach((key) => {
    filterBuilder.value.add(key).contains(searchTerms[key]);
  });
  emits('search', filterBuilder.value);
}, 500);


const hasSearchableColumns = computed(() => {
  const cols = slots.default ? slots.default() : [];
  return cols.filter((vnode: any) => vnode.props.hasOwnProperty('searchable')).length > 0;
});

const renderCols = (props: any) => {
  const cols = slots.default ? slots.default() : [];
  cols.forEach((vnode: any) => {
    Object.assign(vnode.props ??= {}, props);
  });
  return cols;
};
</script>

<template>
  <div class="relative">
    <table class="relative min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
      <thead class="bg-primary-500">
      <tr>
        <render-cols :renderAs="'header'" @sort="handleSort" :sortOrders="sortOrders" />
      </tr>

      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <tr v-if="hasSearchableColumns">
        <render-cols :renderAs="'search'" @search="handleSearch" :searchTerms="searchTerms" />
      </tr>
      <tr
          v-for="row in props.data"
          :key="row[props.rowKeyField]"
          class="odd:bg-primary-50 hover:bg-primary-100 even:bg-white"
      >
        <render-cols :renderAs="'cell'" :row="row" />
      </tr>
      </tbody>
    </table>
    <OpTablePagination
        class="sticky bottom-5 right-10"
        :totalItems="props.pagination.totalItems"
        :totalPages="props.pagination.totalPages"
        :currentPage="props.pagination.currentPage"
        :pageSize="props.pagination.pageSize"
        @pageChange="handlePageChange"
    />
  </div>
</template>
