<script setup>
import axios from 'axios';

const { $day } = useNuxtApp();

const paginateIdentity = (page) => {
    vm.page = page;
    fetchIdentity();
};

const deleteIdentity = (identityID) => {
    axios.delete(`${import.meta.env.VITE_APP_ENV}/identity-verif/${identityID}/identity-deleted`)
        .then((result) => {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }).catch((err) => {
            console.log(err);
        });
};

const vm = reactive({
    listIdentity: [],
    totalItems: null,
    totalPages: null,
    currentPage: null,
    sortByDate: 'desc',
    limit: 15,
    page: 1,
    loading: true,

});

const fetchIdentity = async () => {
    vm.loading = true;

    axios.get(`${import.meta.env.VITE_APP_ENV}/identity-verif/?page=${vm.page}&limit=${vm.limit}&sortByCreated=${vm.sortByDate}`)
        .then((result) => {
            vm.loading = false;
            vm.listIdentity = result.data.data;
            vm.totalItems = result.data.countAllPages;
            vm.totalPages = result.data.totalPages;
            vm.currentPage = result.data.currentPage;
        }).catch((err) => {
            console.log(err);
            vm.loading = false;
        })
    vm.loading = true;
};

onMounted(() => {
    fetchIdentity();
});
</script>
<template>
    <div class="space-y-4">
        <div class="max-w-full p-4 mx-auto bg-white border border-gray-200 rounded-[10px] shadow-lg">
            <header class="flex justify-between px-5 py-4 border-b border-gray-100">
                <h2 class="font-semibold text-gray-800 text-[18px]">Daftar Identitas Pemilih</h2>
                <h2 class="font-medium text-center text-[18px] text-white">
                    <nuxt-link class="p-1 px-4 bg-green-500 rounded" to="/app/identity-create/identity">
                        Buat Identitas
                    </nuxt-link>
                </h2>

            </header>
            <div class="p-3">
                <div>
                    <input v-model="vm.search" @keypress="fetchIdentity" type="search">
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full table-auto">
                        <thead class="font-semibold text-gray-400 uppercase text-[16px] bg-gray-50">
                            <tr>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Nomor Identitas</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Nama</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Tanggal dibuat</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-center">Aksi</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="!vm.loading" class="text-[16px] divide-y divide-gray-100">
                            <tr v-for="(item, i) in vm.listIdentity" :key="`${i}`">
                                <td class="p-2 whitespace-nowrap">
                                    <div class="flex items-center text-center">
                                        <div class="font-medium text-gray-800">{{ item.NoAnggota }}</div>
                                    </div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">{{ item.fullName }}</div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">
                                        {{ $day(item.createdAt).locale('id').format('DD MMMM YYYY H:mm') }}
                                    </div>
                                </td>
                                <td class="p-2 text-center whitespace-nowrap">
                                    <div
                                        class="flex justify-center space-x-5 text-lg font-medium text-center text-white">
                                        <button @click="deleteIdentity(item.identityID)"
                                            class="p-1 px-4 bg-red-500 rounded">Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="4" class="p-5 text-center text-[20px] font-semibold">
                                    loading
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="flex justify-center mt-5" v-if="vm.listIdentity.length">
                <vue-awesome-paginate :totalItems="vm.totalItems" v-model="vm.currentPage" @click="paginateIdentity"
                    :items-per-page="vm.limit" :max-pages-shown="3" paginate-buttons-class="btn"
                    active-page-class="btn-active" back-button-class="back-btn" next-button-class="next-btn">
                    <template #prev-button>
                        <span class="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="black" width="12" height="12"
                                transform="rotate(180)" viewBox="0 0 24 24">
                                <path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z" />
                            </svg>
                        </span>
                    </template>
                    <template #next-button>
                        <span class="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="black" width="12" height="12"
                                viewBox="0 0 24 24">
                                <path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z" />
                            </svg>
                        </span>
                    </template></vue-awesome-paginate>
            </div>
        </div>
    </div>
</template>
<style>
.btn {
    font-weight: bold;
    background-color: #e0e0e0;
    height: 30px;
    width: 30px;
    border: none;
    margin-inline: 5px;
    cursor: pointer;
    border-radius: 30%;
}

.back-btn {
    background-color: #e0e0e0;
    border-radius: 50%;
}

.next-btn {
    background-color: #e0e0e0;
    border-radius: 50%;
}

.btn-active {
    color: white;
}
</style>
