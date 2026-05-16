<script setup lang="ts">
import HeroBannerCard from '../../components/settings/homepage/HeroBannerCard.vue'
import RunningTextCard from '../../components/settings/homepage/RunningTextCard.vue'
import CollectionCard from '../../components/settings/homepage/CollectionCard.vue'
import SecondCollectionCard from '../../components/settings/homepage/SecondCollectionCard.vue'
import FeaturedProductCard from '../../components/settings/homepage/FeaturedProductCard.vue'

useHead({
  title: 'Homepage Settings • Dashboard'
})
</script>

<template>
  <client-only>
    <div class="max-w-6xl mx-auto space-y-6">

      <HeroBannerCard />

      <RunningTextCard />

      <CollectionCard />

      <SecondCollectionCard />
      
      <FeaturedProductCard />

    </div>
  </client-only>
</template>