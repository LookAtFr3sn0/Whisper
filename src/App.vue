<script setup>
import Navbar from '@/components/Navbar.component.vue'
</script>

<template>
  <RouterView />
  <Navbar v-if="$route.meta.showNav" />
</template>
