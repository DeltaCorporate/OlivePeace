
<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue';
import {SfButton, SfLink} from '@storefront-ui/vue';
import Banner from '@/components/ui/Banner.vue';
import ProductCard from '@/components/ProductCard.vue';
import CategoryCard from '@/components/CategoryCard.vue';
import ReviewCard from '@/components/ui/ReviewCard.vue';
import { getProducts } from '@/api/product.api';
import { getProductCategories } from '@/api/product-category.api';
import {useClientLayoutStore} from "@/stores/client-layout.store.ts";
import {getUsers} from "@/api/admin/user.api.ts";

const clientLayoutStore = useClientLayoutStore();
clientLayoutStore.pageTitle = 'Bienvenue chez OlivePeace'
clientLayoutStore.setIsCustomTitle(true);
const latestProducts = ref([]);
const featuredCategories = ref([]);
const customerReviews = ref([
  { id: 1, name: 'Sophie L.', rating: 5, comment: "L'huile d'olive est délicieuse, je recommande !" },
  { id: 2, name: 'Thomas M.', rating: 4, comment: "Excellent service client et produits de qualité." },
  { id: 3, name: 'Marie P.', rating: 5, comment: "J'adore la variété des produits proposés." },
]);

onMounted(async () => {
    const productsResponse = await getProducts('f_stock=ord:ASC&limit=10');
    if(productsResponse.isSuccess)
      latestProducts.value = productsResponse.data;

    const categoriesResponse = await getProductCategories('limit=5');
    if(categoriesResponse.isSuccess)
      featuredCategories.value = categoriesResponse.data;

});

onUnmounted(() => {
  clientLayoutStore.setIsCustomTitle(false);
});
</script>
<template>
  <div class="home w-full">
    <!-- Banner principal -->
    <Banner
        title="Bienvenue chez OlivePeace"
        description="Découvrez notre sélection de vetements innovants et de qualité."
        :image="{ mobile: '/public/banner-mobile.webp', desktop: '/public/banner-desktop.webp' }"
        buttonText="Découvrir"
        @click="$router.push('/products')"
    />
    <div class="flex flex-col items-center w-full">
      <div class="w-3/4">
        <!-- Derniers produits -->
        <section class="latest-products my-10">
          <h2 class="text-3xl font-bold text-center mb-6">Nos derniers produits</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <ProductCard v-for="product in latestProducts" :key="product._id" :product="product" />
          </div>
          <div class="text-center mt-6">
            <SfLink class="cursor-pointer no-underline" @click="$router.push('/products')">Voir tous les produits</SfLink>
          </div>
        </section>

        <!-- Catégories de produits -->
        <section class="product-categories my-10">
          <h2 class="text-3xl font-bold text-center mb-6">Nos catégories</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <CategoryCard v-for="category in featuredCategories" :key="category._id" :category="category" />
          </div>
          <div class="text-center mt-6">
            <SfLink class="no-underline cursor-pointer" @click="$router.push('/product_categories')">Voir toutes les catégories</SfLink>
          </div>
        </section>

        <!-- Avis clients -->
        <section class="customer-reviews bg-gray-100 py-10">
          <h2 class="text-3xl font-bold text-center mb-6">Ce que disent nos clients</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            <ReviewCard v-for="review in customerReviews" :key="review.id" :review="review" />
          </div>
        </section>

      </div>


    </div>

  </div>
</template>
