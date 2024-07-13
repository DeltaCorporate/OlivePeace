<script setup lang="ts">
  import { SfButton } from '@storefront-ui/vue';
</script>
<template>
  <footer class="bg-gray-100 py-6">
    <div class="container mx-auto px-4">
      <div class="flex justify-center space-x-6">
        <SfButton variant="tertiary" class="text-sm" as="router-link" to="/mentions-legales">
          Mentions légales
        </SfButton>
        <SfButton variant="tertiary" class="text-sm" as="router-link" to="/politique-confidentialite">
          Politique de confidentialité
        </SfButton>
        <SfButton variant="tertiary" class="text-sm" as="router-link" to="/cgu-cgv">
          CGU & CGV
        </SfButton>
      </div>
    </div>
  </footer>
</template>

