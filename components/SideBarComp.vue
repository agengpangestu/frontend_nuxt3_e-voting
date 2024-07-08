<script setup>
import Cookie from 'js-cookie';

const { $authentication } = useNuxtApp();

const name = ref(Cookie.get('name_user.name')),
    role = ref(Cookie.get('name_user.role'));

const logOut = () => {
    $authentication.logOut();
};
let buttons = [
    // { name: "Menu", link: "/app/menu/list-menu", },
    // { name: "Kategori", link: "/app/category/list-category", },
    // { name: "Article", link: "/app/article/list-article", icon: icon1 },
    { name: "User", link: "/app/user-dashboard", },
    { name: "Kandidat", link: "/app/candidate-dashboard", },
    { name: "Jadwal", link: "/app/jadwal-dashboard", },
    { name: "Vote", link: "/app/vote-dashboard", },
    { name: "Identitas", link: "/app/identity-dashboard", },
    // { name: "User", link: "/app/promo/list-user", icon: icon5 },
];
</script>
<template>
    <div class="w-[180px] h-auto fixed z-20 inset-y-2.5 left-2 bg-white drop-shadow rounded-[10px]">
        <div class="flex justify-center p-5">
            <h1 class="text-[18px]">
                Halo, {{ role === "ADMIN" ? 'Admin' : role }} {{ name }}
            </h1>
        </div>
        <div class="flex flex-col left-5 top-5 gap-5 py-5 px-2.5 font-medium font-poppins">
            <div class="flex flex-col gap-2.5">
                <div v-for="(item, i) in buttons" :key="`${i}`">
                    <nuxt-link :to="item.link">
                        <div class="relative flex">
                            <!-- <img :src="item.icon" class="absolute left-2 top-2" width="25" alt="icon-dashboard"> -->
                            <button
                                :class="`left-10 w-full h-[40px] text-start rounded-[8px] text-black focus:bg-gray4 focus:ease-in-out duration-300 delay-200`">
                                <p class="ml-10">
                                    {{ item.name }}
                                </p>
                            </button>
                        </div>
                    </nuxt-link>
                </div>
            </div>
            <nuxt-link class="mt-5" to="">
                <button @click="logOut"
                    class="p-1.5 focus:text-white text-black rounded-[8px] hover:bg-red-600 hover:text-white ease-in-out duration-300">
                    <div class="flex items-center space-x-2">
                        <!-- <img :src="icon3" width="25" alt="icon-logout"> -->
                        <h1 class="text-start">
                            Logout
                        </h1>
                    </div>
                </button>
            </nuxt-link>
        </div>
    </div>
</template>
