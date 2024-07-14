<script setup lang="ts">
import { SfLink, SfButton, SfIconShoppingCart } from '@storefront-ui/vue';
import {computed, defineProps, ref} from 'vue';
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const product = ref(props.product);

const discountedPrice = computed(() => {
  const price = parseFloat(product.value.discountedPrice);
  return price.toFixed(2);
});
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
        <SfButton variant="primary" size="sm" class="bottom-0 right-0 absolute !py-0 !px-1 text-xs rounded-sm opacity-70">{{product.productCategory.name}}</SfButton>
      </div>
      <div class="p-4 border-t border-neutral-200">
        <div class="flex flex-wrap">
          <SfLink href="#" variant="secondary" class="no-underline"> {{product.name}} </SfLink>
          <small>{{product.brand}}</small>
        </div>

        <span class="block pb-2 font-bold typography-text-lg">{{discountedPrice}}€</span>
        <SfButton size="sm">
          <template #prefix>
            <SfIconShoppingCart size="sm" />
          </template>
          Ajouter au panier
        </SfButton>
      </div>
    </div>
  </template>

