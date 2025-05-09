<script setup>
import { onMounted, nextTick, ref } from 'vue';
import gsap from 'gsap';

const page                 = ref('signup');
const username 	           = ref('');
const email                = ref('');
const password             = ref('');
const confirmPassword      = ref('');
const usernameError        = ref('');
const emailError           = ref('');
const passwordError        = ref('');
const confirmPasswordError = ref('');
const passwordStrength     = ref('');

const showPassword = ref(false);


const onRegister = () => {

}


onMounted(async () => {
	await nextTick();
	const card = document.getElementById('auth-card');

	gsap.from(card, {
			opacity: 0,
			y: 50,
			duration: 1.5,
			ease: 'power2.inOut',
	})
});
</script>

<template>
  <div class="w-full h-screen px-4 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200">
    <div class="w-full max-w-lg px-8 py-8 lg:px-10 lg:py-10 rounded-3xl bg-white shadow-2xl text-center backdrop-blur-2xl transition-all duration-500" id="auth-card">
			<span class="material-symbols-outlined text-4xl absolute left-4 top-8 select-none cursor-pointer" v-if="page !== 'welcome'" @click="page = 'welcome'">chevron_left</span>
      <img class="w-18 h-18 lg:w-24 lg:h-24 mx-auto mb-6 drop-shadow-lg select-none pointer-events-none" src="@/assets/whisper.svg" alt="Whisper Logo" />
			<div v-if="page === 'welcome'">
				<h1 class="text-3xl lg:text-4xl font-extrabold mb-4 py-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Welcome to Haven</h1>
				<p class="lg:text-lg text-gray-700 mb-10">A safe, simple, and modern messaging experience.</p>
				<button class="text-sm lg:text-base inline-block py-3 px-8 bg-gray-800 text-white rounded-full font-semibold transition duration-200 hover:shadow-xl hover:scale-105 focus:outline-none select-none" @click="page = 'signup'">Setup your account</button>
				<div class="flex items-center my-4">
				  <div class="flex-grow h-px bg-gray-300"></div>
				  <span class="mx-3 text-gray-400 font-semibold select-none">or</span>
				  <div class="flex-grow h-px bg-gray-300"></div>
				</div>
				<button class="text-sm lg:text-base inline-block py-3 px-8 bg-gray-800 text-white rounded-full font-semibold transition duration-200 hover:shadow-xl hover:scale-105 focus:outline-none select-none" @click="page = 'login'">Login</button>
			</div>

			<div v-else-if="page === 'signup'">
				<h1 class="text-3xl lg:text-4xl font-extrabold mb-4 py-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Sign up</h1>
				<form class="flex flex-col gap-4" @submit.prevent="onRegister()">
					<div class="flex flex-col gap-4 *:flex *:flex-col *:gap-2">
						<div>
							<label class="w-full text-left text-gray-700 font-semibold" for="username">Username</label>
							<input class="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400" v-model="username" type="text" id="username" placeholder="Enter your username" minlength="3" maxlength="40" autocomplete="username" required />
						</div>
						<div>
							<label class="w-full text-left text-gray-700 font-semibold" for="email">Email</label>
							<input class="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400" v-model="email" type="email" id="email" placeholder="Enter your email" maxlength="255" autocomplete="email" required /> 
						</div>
						<div>
							<label class="text-left text-gray-700 font-semibold" for="password">Password</label>
							<div class="flex items-center relative">
								<input class="w-full border-2 border-gray-300 rounded-lg p-3 pr-12 focus:outline-none focus:border-blue-400" v-model="password" :type="showPassword ? 'text' : 'password'" id="password" placeholder="Enter your password" minlength="8" maxlength="256" autocomplete="new-password" required />
								<span class="material-symbols-outlined text-gray-500 text-sm absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" @click="showPassword = !showPassword">{{ showPassword ? 'visibility' : 'visibility_off' }}</span>
							</div>
						</div>
						<div>
							<label class="w-full text-left text-gray-700 font-semibold" for="confirm-password">Confirm Password</label>
							<input class="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400" v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" id="confirm-password" placeholder="Re-enter your password" minlength="8" maxlength="256" autocomplete="new-password" required />
						</div>
					</div>
					<div class="flex items-center justify-between mt-4 mb-6">
						<a class="text-sm text-gray-500 hover:text-gray-700 font-semibold" @click="page = 'login'">Already have an account?</a>
						<button class="text-sm lg:text-base inline-block py-3 px-8 bg-gray-800 text-white rounded-full font-semibold transition duration-200 hover:shadow-xl hover:scale-105 focus:outline-none select-none" type="submit">Sign up</button>
					</div>
				</form>
			</div>

			<div v-else-if="page === 'login'">
			</div>

    </div>
  </div>
</template>

<script setup>
</script>
