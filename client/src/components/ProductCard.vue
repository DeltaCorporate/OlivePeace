<script setup lang="ts">
import { SfLink, SfButton, SfIconShoppingCart } from '@storefront-ui/vue';
import {defineProps, ref} from 'vue';
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const product = ref(props.product);
</script>
  <template>
    <div class="border border-neutral-200 rounded-md hover:shadow-lg max-w-[200px]">
      <div class="relative">
        <SfLink :href="'/products/'+product.slug" class="block">
          <img
              src="https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/sneakers.png"
              :alt="product.description"
              class="block object-cover h-auto rounded-md aspect-square"
              width="300"
              height="300"
          />
        </SfLink>
      </div>
      <div class="p-4 border-t border-neutral-200">
        <div class="flex flex-wrap">
          <SfLink href="#" variant="secondary" class="no-underline"> {{product.name}} </SfLink>
          <small>{{product.brand}}</small>
        </div>

        <span class="block pb-2 font-bold typography-text-lg">{{product.price}}</span>
        <SfButton size="sm">
          <template #prefix>
            <SfIconShoppingCart size="sm" />
          </template>
          Ajouter au panier
        </SfButton>
      </div>
    </div>
  </template>

