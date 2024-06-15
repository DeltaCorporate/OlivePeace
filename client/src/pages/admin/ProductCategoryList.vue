<script setup>
import {getProductCategories} from "@/api/admin/product-category.api.ts";
import Filter from "@/utils/filter.util.ts";

let testFilter = new Filter()

let data = await getProductCategories(testFilter);
</script>
<template>

</template>
<style scoped> </style>