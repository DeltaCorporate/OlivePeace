<script lang="ts" setup>
import {previousRoute} from '@/router/index.ts';
import {ChevronLeft} from 'lucide-vue-next';
</script>
<template>
  <router-link :to="previousRoute" class="flex items-center gap-2 text-neutral-500">
    <span class="flex hover:animate-shake"><ChevronLeft />Retour</span>
  </router-link>
</template>
