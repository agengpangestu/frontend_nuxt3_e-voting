<script setup>
import axios from 'axios';

const { $authentication } = useNuxtApp();

definePageMeta({
    middleware: ['not-authentication']
});

const errorNotif = (err) => {
    useNuxtApp().$toast.warn(err);
};

const formData = reactive({
    username: '',
    password: '',
    loading: false,
});

const logedIn = async () => {
    const body = new FormData();
    body.append('username', formData.username);
    body.append('password', formData.password);

    formData.loading = true;

    await $authentication.loggedIn(body);   
    if ($authentication.isAuthenticate()) return navigateTo('/app');

    formData.loading = false;
};

</script>

<template>
    <div class="flex items-center justify-center w-screen h-screen p-10 bg-white">
        <div class="bg-white shadow-md drop-shadow w-[500px] p-5 h-[400px] rounded">
            <form @submit.prevent="logedIn">

                <div class="flex justify-center">
                    <h1 class="text-[24px]">Log in ke Dashboard E-Voting</h1>
                </div>
                <div class="flex flex-col items-center mt-5 space-y-5">
                    <div class="flex flex-col space-y-2 text-[18px]">
                        <label for="username">Username</label>
                        <input placeholder="Username" class="w-[350px] outline outline-1 rounded pl-2 py-1"
                            v-model="formData.username" type="text" name="username" id="username">
                    </div>
                    <div class="flex flex-col space-y-2 text-[18px]">
                        <label for="password">Password</label>
                        <input placeholder="Password" class="w-[350px] outline outline-1 rounded pl-2 py-1"
                            v-model="formData.password" type="text" name="password" id="password">
                    </div>
                    <div class="flex justify-center pt-8">
                        <button v-if="!formData.loading"
                            class="p-2 w-[350px] text-white bg-blue-500 rounded-md text-[20px]">Login</button>
                        <button v-else
                            class="p-2 w-[350px] text-white bg-blue-500 rounded-md text-[20px]">Loading</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>