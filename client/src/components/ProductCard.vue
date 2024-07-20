<script setup lang="ts">
import { SfLink, SfButton, SfIconShoppingCart } from '@storefront-ui/vue';
import {computed, defineProps, ref} from 'vue';
import {errorImage} from "@/utils/image.util.ts";
import {UPLOAD_PATH} from "../../config/global.ts";
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
      <router-link :to="'/products/' + product.slug">
        <div class="relative">
          <img
              :src="UPLOAD_PATH + '/' + product.imageName"
              @error="errorImage"
              :alt="product.description"
              class="block object-cover h-auto rounded-md aspect-square"
          />
          <SfButton variant="primary" size="sm" class="bottom-0 right-0 absolute !py-0 !px-1 text-xs rounded-sm opacity-70">{{product.productCategory.name}}</SfButton>
        </div>
      </router-link>
        <div class="p-4 border-t border-neutral-200">
          <router-link :to="'/products/' + product.slug">

            <div class="flex flex-wrap">
                 <SfLink variant="secondary" class="no-underline"> {{product.name}} </SfLink>
              <small class>{{product.brand}}</small>
            </div>
          </router-link>
          <span class="block pb-2 font-bold typography-text-lg">{{discountedPrice}}€</span>

        <template v-if="product.stock > 0">
          <SfButton size="sm">
            <template #prefix>
              <SfIconShoppingCart size="sm" />
            </template>
            Ajouter au panier
          </SfButton>
        </template>
        <span v-else class="font-medium text-negative-700"> Produit épuisé</span>

      </div>
    </div>
  </template>

