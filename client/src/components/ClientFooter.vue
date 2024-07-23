<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue';
</script>

<template>
  <footer class="bg-gray-100 py-6">
    <div class="container mx-auto px-4">
      <div class="flex justify-center space-x-6">

        <SfButton variant="tertiary" class="text-sm" as="router-link" to="/cgu-cgv">
          CGU & CGV
        </SfButton>
      </div>
    </div>
  </footer>
</template>

<script>
import CGUModal from './CGUModal.vue';

export default {
  components: {
    LegalMentionsModal,
    PrivacyPolicyModal,
    CGUModal
  },
  methods: {
    showLegalMentionsModal() {
      this.$modal.show('legal-mentions-modal');
    },
    showPrivacyPolicyModal() {
      this.$modal.show('privacy-policy-modal');
    },
    showCGUModal() {
      this.$modal.show('cgu-modal');
    },
  },
};
</script>
