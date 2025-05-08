<script setup>
import Navbar from '@/components/Navbar.view.vue'
</script>

<template>
  <RouterView />
  <Navbar v-if="$route.meta.showNav" />
</template>
