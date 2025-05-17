<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import * as EmailValidator from 'email-validator';
import * as opaque from "@serenity-kit/opaque";
import gsap from 'gsap';
import { Toaster, toast } from 'vue-sonner';

const router = useRouter();
const page                 = ref('welcome');
const username 	           = ref('');
const email                = ref('');
const password             = ref('');
const confirmPassword      = ref('');
const usernameError        = ref('');
const emailError           = ref('');
const passwordError        = ref('');
const confirmPasswordError = ref('');
const showPassword         = ref(false);
const isSubmitting         = ref(false);

const validateUsername = () => {
	if (username.value.length < 3 || username.value.length > 40) usernameError.value = 'Username must be between 3 and 40 characters.';
	else if (!/^[a-zA-Z0-9_.-]+$/.test(username.value)) usernameError.value = 'Username can only contain letters, numbers, and underscores.';
	else usernameError.value = '';
}

const validateEmail = () => {
	if (!email.value) emailError.value = 'Email is required.';
	else if (!EmailValidator.validate(email.value)) emailError.value = 'Invalid email address.';
	else emailError.value = '';
}

const validatePassword = () => {
	if (password.value.length < 8 || password.value.length > 256) passwordError.value = 'Password must be between 8 and 256 characters.';
	else if (!/[A-Z]/.test(password.value)) passwordError.value = 'Password must contain at least one uppercase letter.';
	else if (!/[a-z]/.test(password.value)) passwordError.value = 'Password must contain at least one lowercase letter.';
	else if (!/[0-9]/.test(password.value)) passwordError.value = 'Password must contain at least one number.';
	else if (!/[a-zA-Z0-9]/.test(password.value)) passwordError.value = 'Password must contain at least one special character.';
	else passwordError.value = '';
}

const validateConfirmPassword = () => {
	if (confirmPassword.value !== password.value) confirmPasswordError.value = 'Passwords do not match.';
	else confirmPasswordError.value = '';
}

const onRegister = async () => {
	isSubmitting.value = true;
	const loadingToastRef = toast.loading('Registering your account...');
	if (usernameError.value || emailError.value || passwordError.value || confirmPasswordError.value) {
		isSubmitting.value = false;
		toast.error('Please fix the errors before submitting.');
		toast.dismiss(loadingToastRef);
		return;
	}
	validateUsername() && validateEmail() && validatePassword() && validateConfirmPassword();
	if (usernameError.value || emailError.value || passwordError.value || confirmPasswordError.value) {
		isSubmitting.value = false;
		toast.error('Please fix the errors before submitting.');
		toast.dismiss(loadingToastRef);
		return;
	}

	const { clientRegistrationState, registrationRequest } = opaque.client.startRegistration({ password: password.value });
	let response, token, registrationResponse;
	try {
		response = await fetch('/api/register/handshake', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username.value, registrationRequest }),
		});
		({ token, registrationResponse } = await response.json());
		if (!response.ok) {
			throw new Error('Network response was not ok ' + response.statusText);
		}
		const { registrationRecord } = opaque.client.finishRegistration({ clientRegistrationState, registrationResponse, password: password.value });
		response = await fetch('/api/register/verify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: email.value, token, registrationRecord }),
		});
		await response.json();
		if (!response.ok) {
			throw new Error('Network response was not ok ' + response.statusText);
		}
		page.value = 'signup-complete';
		username.value = '';
		email.value = '';
		password.value = '';
		confirmPassword.value = '';
		toast.success('Registration successful! Please check your email.', { id: loadingToastRef });
	} catch (error) {
		console.error('Error during registration:', error);
		toast.error('Registration failed. Please try again.');
	} finally {
		isSubmitting.value = false;
		toast.dismiss(loadingToastRef);
	}
}

const onLogin = async () => {
	isSubmitting.value = true;
	const loadingToastId = toast.loading('Signing you in...');
	try {
		const { clientLoginState, startLoginRequest } = opaque.client.startLogin({ password: password.value });
		let response = await fetch('/api/login/handshake', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username.value, startLoginRequest }),
		});
		if (!response.ok) {
			throw new Error('Network response was not ok ' + response.statusText);
		};
		const { loginResponse, token } = await response.json();
		
		const loginResult = opaque.client.finishLogin({
			clientLoginState,
			loginResponse,
			password: password.value,
		});
		if (!loginResult) {
			toast.error('Login failed. Please check your credentials.');
			throw new Error("Login failed");
		}
		const { finishLoginRequest, sessionKey } = loginResult;
		response = await fetch('/api/login/verify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token, finishLoginRequest, sessionKey }),
		});
		if (!response.ok) {
			throw new Error('Network response was not ok ' + response.statusText);
		}
		toast.dismiss(loadingToastId);
		router.push({ name: 'inbox' });
	} catch (error) {
		console.error('Error during login:', error);
		toast.error('Login failed. Please check your credentials.');
	} finally {
		isSubmitting.value = false;
		toast.dismiss(loadingToastId);
		username.value = '';
		password.value = '';
	};
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
				<button class="text-sm lg:text-base inline-block py-3 px-8 bg-gray-800 text-white rounded-full font-semibold transition duration-200 hover:shadow-xl hover:scale-105 focus:outline-none select-none" @click="page = 'signin'">Sign in</button>
			</div>

			<div v-else-if="page === 'signup'">
				<h1 class="text-3xl lg:text-4xl font-extrabold mb-4 py-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Sign up</h1>
				<form class="flex flex-col gap-4" @submit.prevent="onRegister()">
					<div class="flex flex-col gap-4 *:flex *:flex-col *:gap-2 *:relative">
						<div>
							<input
								class="peer px-3 pt-6 pb-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-400 duration-200"
								v-model="username"
								type="text"
								id="username"
								@blur="validateUsername"
								placeholder=" "
								minlength="3"
								maxlength="40"
								autocomplete="username"
								pattern="^[a-zA-Z0-9_]+$"
								required
							/>
							<label class="absolute left-3 top-2 text-neutral-500 text-sm transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm font-semibold select-none" for="username">Username</label>
							<span v-if="usernameError" class="text-red-400 text-xs mt-1">{{ usernameError }}</span>
						</div>
						<div>
							<input
								class="peer px-3 pt-6 pb-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-400 duration-200"
								v-model="email"
								type="email"
								id="email"
								@blur="validateEmail"
								placeholder=" "
								maxlength="255"
								autocomplete="email"
								required
							/> 
							<label class="absolute left-3 top-2 text-neutral-500 text-sm transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm font-semibold select-none" for="email">Email</label>
							<span v-if="emailError" class="text-red-400 text-xs mt-1">{{ emailError }}</span>
						</div>
						<div>
							<div class="flex items-center relative">
								<input
									class="peer w-full pr-12 px-3 pt-6 pb-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-400 duration-200"
									v-model="password"
									:type="showPassword ? 'text' : 'password'"
									id="password"
									@blur="validatePassword"
									placeholder=" "
									minlength="8"
									maxlength="256"
									autocomplete="new-password"
									required
								/>
								<label class="absolute left-3 top-2 text-neutral-500 text-sm transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm font-semibold select-none" for="password">Password</label>
								<span class="material-symbols-outlined text-gray-500 text-sm absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" @click="showPassword = !showPassword">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
							</div>
							<span v-if="passwordError" class="text-red-400 text-xs mt-1">{{ passwordError }}</span>
						</div>
						<div>
							<input
								class="peer px-3 pt-6 pb-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-400 duration-200"
								v-model="confirmPassword"
								:type="showPassword ? 'text' : 'password'"
								id="confirm-password"
								@blur="validateConfirmPassword"
								placeholder=" "
								minlength="8"
								maxlength="256"
								autocomplete="new-password"
								required
							/>
							<label class="absolute left-3 top-2 text-neutral-500 text-sm transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm font-semibold select-none" for="confirm-password">Confirm Password</label>
							<span v-if="confirmPasswordError" class="text-red-400 text-xs mt-1">{{ confirmPasswordError }}</span>
						</div>
					</div>
					<div class="flex items-center justify-between mt-4 mb-6">
						<a class="text-sm text-gray-500 hover:text-gray-700 font-semibold" @click="page = 'signin'">Already have an account?</a>
						<button class="text-sm lg:text-base inline-block py-3 px-8 bg-gray-800 text-white rounded-full font-semibold transition duration-200 hover:shadow-xl hover:scale-105 focus:outline-none select-none" type="submit" :disabled="isSubmitting">Sign up</button>
					</div>
				</form>
			</div>

			<div v-else-if="page === 'signin'">
				<h1 class="text-3xl lg:text-4xl font-extrabold mb-4 py-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Sign in</h1>
				<form class="flex flex-col gap-4" @submit.prevent="onLogin()">
					<div class="flex flex-col gap-4 *:flex *:flex-col *:gap-2 *:relative">
						<div>
							<input
								class="peer px-3 pt-6 pb-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-400 duration-200"
								v-model="username"
								type="text"
								id="username"
								placeholder=" "
								minlength="3"
								maxlength="40"
								autocomplete="username"
								pattern="^[a-zA-Z0-9_]+$"
								required
							/>
							<label class="absolute left-3 top-2 text-neutral-500 text-sm transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm font-semibold select-none" for="username">Username</label>
						</div>
						<div>
							<div class="flex items-center relative">
								<input
									class="peer w-full pr-12 px-3 pt-6 pb-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-400 duration-200"
									v-model="password"
									:type="showPassword ? 'text' : 'password'"
									id="password"
									placeholder=" "
									minlength="8"
									maxlength="256"
									autocomplete="new-password"
									required
								/>
								<label class="absolute left-3 top-2 text-neutral-500 text-sm transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm font-semibold select-none" for="password">Password</label>
								<span class="material-symbols-outlined text-gray-500 text-sm absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" @click="showPassword = !showPassword">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-between mt-4 mb-6">
						<a class="text-sm text-gray-500 hover:text-gray-700 font-semibold" @click="page = 'signup'">Don't have an account?</a>
						<button class="text-sm lg:text-base inline-block py-3 px-8 bg-gray-800 text-white rounded-full font-semibold transition duration-200 hover:shadow-xl hover:scale-105 focus:outline-none select-none" type="submit">Sign up</button>
					</div>
				</form>
			</div>

			<div v-else-if="page === 'signup-complete'">
				<h1 class="text-3xl lg:text-4xl font-extrabold mb-4 py-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Sign up complete</h1>
				<p class="lg:text-lg text-gray-700 mb-10">An email has been sent to your email address. Please check your inbox to complete the registration process.</p>
				<button class="text-sm lg:text-base inline-block py-3 px-8 bg-gray-800 text-white rounded-full font-semibold transition duration-200 hover:shadow-xl hover:scale-105 focus:outline-none select-none" @click="page = 'signin'">Sign in</button>
			</div>

    </div>
    <Toaster position="top-right" />
  </div>
</template>
