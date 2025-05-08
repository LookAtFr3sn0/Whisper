<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="w-full max-w-lg px-12 py-8 rounded-3xl bg-white shadow-lg text-center">
      <h1 class="text-4xl font-bold mb-4 text-gray-800 leading-tight">Welcome to Haven</h1>
      <p class="text-lg text-gray-600 mb-10">A safe, simple, and modern messaging experience.</p>
      <RouterLink class="inline-block py-3 px-10 bg-gray-800 text-white rounded-full font-semibold transition duration-200 hover:bg-gray-700 focus:outline-none select-none" to="/setup">Get Started</RouterLink>
    </div>
  </div>
</template>

<script setup>
</script>
