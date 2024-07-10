<script lang="ts" setup>
import {onMounted, reactive} from "vue";
import {getPromotion} from "@/api/admin/promotion.api.ts";

const props = defineProps({
   id: {
     type: Number,
     required: true,
   },
});
const data = reactive({});
const fetchData = async () => {
  const promotion = await getPromotion(props.id);
  data.value = {...promotion.data};
};
onMounted(() => {
  fetchData();
});
</script>

<template>
  {{data}}
</template>
