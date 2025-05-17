<script setup>
import { ref, onMounted } from 'vue';
import { Toaster, toast } from 'vue-sonner';

import timeFromUUID from '@/utils/timeFromUUID.ts';

const isLoading = ref(false);
const chatList = ref([]);
const userImage = ref(null);

const fetchChatList = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('/api/inbox', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 401) {
      window.location.href = '/welcome';
      return;
    }
    const data = await response.json();
    if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
    chatList.value = data;
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching chat list:', error);
    toast.error('Failed to load chat list. Please try again later.');
  }
};

const fetchUserImage = async () => {
  try {
    const response = await fetch('/api/user/image', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 401) {
      window.location.href = '/welcome';
      return;
    }
    const { image } = await response.json();
    if (!response.ok) console.error('Network response was not ok ', response.statusText);
    userImage.value = image;
  } catch (error) {
    console.error('Error fetching user image:', error);
    toast.error('Failed to load user image. Please try again later.');
  }
};

const messageTime = (lastMessageId) => {
  const date = new Date(timeFromUUID(lastMessageId));
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'Just now';
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const jan1 = new Date(now.getFullYear(), 0, 1);
  if (date < jan1) return date.getFullYear();
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

onMounted(() => {
  fetchUserImage();
  fetchChatList();
});
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-blue-200">
    <div class="w-full max-w-2xl h-full overflow-y-clip bg-white shadow-2xl px-6 py-8 flex flex-col gap-6 border border-gray-200 backdrop-blur-md">
      <div class="flex flex-col gap-6" v-if="isLoading">
        <header class="w-full flex items-center justify-between">
          <div class="w-32 h-8 rounded-lg skeleton"></div>
          <div class="w-10 h-10 skeleton rounded-full"></div>
        </header>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-4" v-for="_ in 6">
            <div class="w-14 h-14 skeleton rounded-full"></div>
            <div class="flex-1 flex flex-col gap-2">
              <div class="h-4 w-24 skeleton rounded"></div>
              <div class="h-3 w-40 skeleton rounded"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full h-full flex flex-col gap-6" v-else>
        <header class="w-full h-10 flex items-center justify-between">
          <div class="w-32 h-8 rounded-lg text-2xl font-bold text-gray-800">Chat list</div>
          <div class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 shadow-sm overflow-clip cursor-pointer">
            <img class="w-full h-full rounded-full object-cover" :src="userImage" alt="User Image" v-if="userImage != null" />
            <span class="text-gray-300 material-symbols-outlined !text-[2.4rem]" v-else>account_circle</span>
          </div>
        </header>
        <div class="flex flex-col h-full justify-center gap-4" v-if="!chatList">
          <div class="text-center text-gray-400 italic">No chats available.</div>
        </div>
        <div class="flex flex-col gap-2" v-else>
          <div
            class="flex items-center gap-4 select-none cursor-pointer rounded-xl transition bg-white hover:bg-blue-50 border border-transparent hover:border-blue-200 shadow-sm px-3 py-2 group"
            v-for="chat in chatList"
            :key="chat.id"
          >
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center overflow-clip border border-gray-200 group-hover:border-blue-300 transition">
              <img class="w-14 h-14 rounded-full object-cover" :src="chat.image" alt="Chat Image" v-if="chat.image && !chat.isGroup" />
              <span class="text-gray-300 material-symbols-outlined !text-[4.4rem]" v-else>account_circle</span>
            </div>
            <div class="flex flex-col overflow-hidden">
              <span class="font-semibold text-ellipsis whitespace-nowrap overflow-hidden text-gray-800">{{ chat.title ?? chat.participants.join(', ') }}</span>
              <span class="text-sm text-ellipsis whitespace-nowrap overflow-hidden text-gray-500 transition">{{ chat.lastMessage ? chat.lastMessage: 'No messages yet' }}</span>
            </div>
            <div class="ml-auto min-w-max">
              <span class="text-xs text-gray-400 transition">{{
                chat.lastMessageId ? messageTime(chat.lastMessageId) : messageTime(chat.id)
                }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toaster position="top-right" />
  </div>
</template>
