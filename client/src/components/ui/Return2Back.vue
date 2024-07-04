<script lang="ts" setup>
import {ChevronLeft} from 'lucide-vue-next';
import {useRouter} from "vue-router";
const router = useRouter();



</script>
<template>
  <div @click="router.back()" class="flex items-center gap-2 cursor-pointer text-neutral-50">
    <span class="flex hover:animate-shake"><ChevronLeft />Retour</span>
  </div>
</template>
