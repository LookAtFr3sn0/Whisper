<script setup>
import { onMounted, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import gsap from 'gsap';

onMounted(() => {
    const welcome = document.getElementById('welcome');

    gsap.from(welcome, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.inOut',
    })
});
</script>

<template>
  <div class="w-full h-screen px-4 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="w-full max-w-lg px-8 py-8 rounded-3xl bg-white shadow-lg text-center" id="welcome">
      <img class="w-24 h-24 mx-auto mb-6" src="@/assets/whisper.svg" alt="Whisper Logo" />
      <h1 class="text-4xl font-bold mb-4 text-gray-800 leading-tight">Welcome to Haven</h1>
      <p class="text-lg text-gray-600 mb-10">A safe, simple, and modern messaging experience.</p>
      <RouterLink class="inline-block py-3 px-10 bg-gray-800 text-white rounded-full font-semibold transition duration-200 hover:bg-gray-700 focus:outline-none select-none" to="/setup">Get Started</RouterLink>
    </div>
  </div>
</template>

<script setup>
</script>
