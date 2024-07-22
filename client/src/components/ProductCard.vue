<script setup lang="ts">
import { SfLink, SfButton, SfIconShoppingCart } from '@storefront-ui/vue';
import {computed, defineProps, ref} from 'vue';
import {errorImage} from "@/utils/image.util.ts";
import {UPLOAD_PATH} from "../../config/global.ts";
import {toFrenchPrice} from "@/utils/divers.util.ts";
import { useStore } from 'vuex';
import {addToCart} from "@/api/cart.api";

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const store = useStore();
const product = ref(props.product);

const formattedPrice = computed(() => {
  if (!product.value) return '';
  return toFrenchPrice(product.value.price);
});

const discountedPrice = computed(() => {
  if (!product.value || !product.value.discountedPrice) return '';
  return toFrenchPrice(product.value.discountedPrice);
});

const isInStock = computed(() => {
  if (!product.value) return false;
  return product.value.stock > 0;
});

const addToCart2 = async (product: any) => {
  try {
    await store.dispatch('cart/addToCart', { productId: product._id, quantity: 1 });
    alert('Produit ajouté au panier');
  } catch (err) {
    console.error(err)
    alert('Erreur lors de l\'ajout au panier');
  }
};

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
              width="300"
              height="300"
          />
          <SfButton variant="primary" size="sm" class="bottom-0 right-0 absolute !py-0 !px-1 text-xs rounded-sm opacity-70">{{product.productCategory.name}}</SfButton>
        </div>
      </router-link>
        <div class="p-4 border-t border-neutral-200">
          <router-link :to="'/products/' + product.slug">
            <div class="flex flex-col flex-wrap">
                 <SfLink variant="secondary" class="no-underline"> {{product.name}} </SfLink>
              <small>{{product.brand}}</small>
            </div>
          </router-link>
          <div class="flex py-3">
              <span v-if="product.price === product.discountedPrice">
                <span class="font-bold text-primary-700 text-xl">{{ formattedPrice }}</span>
              </span>
            <span v-else class="flex gap-x-3">
                <span class="font-bold text-primary-700 text-xl">{{ discountedPrice }}</span>
                <span class="font-bold text-primary-300 text-md line-through">{{ formattedPrice }}</span>
              </span>

          </div>

        <template v-if="product.stock > 0">
          <SfButton size="sm" @click="addToCart(product)">
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

