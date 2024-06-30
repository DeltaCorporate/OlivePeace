<template>
  <SfButton
      :class="[buttonClass,size, 'rounded-full']"
      @click="handleClick"
      :disabled="loading"
      :size="size"
  >
    <SfLoaderCircular v-if="loading" size="sm" />
    <template v-else>
      <component :is="icon" class="w-5 h-5" />
      <span v-if="!onlyLogo && label">{{ label }}</span>
    </template>
  </SfButton>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { SfButton, SfLoaderCircular } from '@storefront-ui/vue';
import {routes} from "vue-router/auto-routes";
import {useRouter} from "vue-router";

const router = useRouter();
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  icon: {
    type: Object,
    required: true,
  },
  buttonClass: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  onlyLogo: {
    type: Boolean,
    default: false,
  },
  route: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'sm',
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  if (!props.route) emit('click');
  else router.push(props.route);
};
</script>
