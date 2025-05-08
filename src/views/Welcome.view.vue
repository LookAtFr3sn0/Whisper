<script setup>
import { onMounted, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import gsap from 'gsap';

onMounted(() => {
    const welcome = document.getElementById('welcome');

    gsap.from(welcome, {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: 'power2.inOut',
    })
});
</script>

<template>
  <div class="w-full h-screen px-4 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200">
    <div class="w-full max-w-lg px-8 py-8 lg:px-10 lg:py-10 rounded-3xl bg-white shadow-2xl text-center backdrop-blur-2xl" id="welcome">
      <img class="w-18 h-18 lg:w-24 lg:h-24 mx-auto mb-6 drop-shadow-lg select-none pointer-events-none" src="@/assets/whisper.svg" alt="Whisper Logo" />
      <h1 class="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Welcome to Haven</h1>
      <p class="lg:text-lg text-gray-700 mb-10">A safe, simple, and modern messaging experience.</p>
      <RouterLink class="text-sm lg:text-base inline-block py-3 px-8 bg-gray-800 text-white rounded-full font-semibold transition duration-200 hover:shadow-xl hover:scale-105 focus:outline-none select-none" to="/setup">Setup your account</RouterLink>
			<p class="text-sm lg:text-base mt-4 text-gray-500">Already have an account? <RouterLink class="text-blue-500 hover:underline" to="/login">Login</RouterLink></p>

    </div>
  </div>
</template>

<script setup>
</script>
