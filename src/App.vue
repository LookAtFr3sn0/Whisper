<script setup>
import Navbar from '@/components/Navbar.view.vue'
</script>

<template>
  <main>
    <RouterView />
  </main>
  <Navbar v-if="$route.meta.showNav" />
</template>
