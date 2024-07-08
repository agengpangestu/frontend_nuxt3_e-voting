<script setup>
import { useNuxtApp } from "#app";
import axios from 'axios';

const { $day } = useNuxtApp();

const paginate = (page) => {
    vm.page = page;
    getSchedule();
};

const vm = reactive({
    listJadwal: [],
    totalItems: null,
    totalPages: null,
    currentPage: null,
    sortByDate: 'desc',
    limit: 8,
    page: 1,
    loading: true
});

const deleteSchedule = (electionID) => {
    vm.loading = true;
    axios.delete(`${import.meta.env.VITE_APP_ENV}/schedules/${electionID}/schedule-delete`)
        .then((result) => {
            setTimeout(() => {
                vm.loading = false;
                window.location.reload();
            }, 1000);
        }).catch((err) => {
            vm.loading = false;
            console.log(err);
        });
    vm.loading = true
};
const getSchedule = async () => {
    vm.loading = true;
    axios.get(`${import.meta.env.VITE_APP_ENV}/schedules/?sortByCreated=${vm.sortByDate}`)
        .then((result) => {
            vm.listJadwal = result.data.data;
            vm.totalItems = result.data.countPages;
            vm.totalPages = result.data.totalPages;
            vm.currentPage = result.data.currentPage;
            vm.loading = false;
        }).catch((err) => {
            console.log(err);
            vm.loading = false;
        })
    vm.loading = true;
};

const updateStatus = () => {
    const intervalWithSec = setInterval(getSchedule, 60000); // 1 minutes
    onBeforeUnmount(() => {
        clearInterval(intervalWithSec);
    });
};

onMounted(() => {
    getSchedule();
    updateStatus();
});
</script>

<template>
    <div class="space-y-4">
        <div class="max-w-full p-4 mx-auto bg-white border border-gray-200 rounded-[10px] shadow-lg">
            <header class="flex justify-between px-5 py-4 border-b border-gray-100">
                <h2 class="font-semibold text-[18px] text-gray-800">Daftar Jadwal</h2>
                <h2 class="font-medium text-center text-[18px] text-white">
                    <nuxt-link class="p-1 px-4 bg-green-500 rounded" to="/app/schedule-create/schedule">
                        Buat Jadwal
                    </nuxt-link>
                </h2>
            </header>
            <div class="p-3">
                <div class="overflow-x-auto">
                    <table class="w-full table-auto">
                        <thead class="font-semibold text-gray-400 uppercase text-[16px] bg-gray-50">
                            <tr>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Nama Jadwal</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Status</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Mulai</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Berakhir</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-center">Aksi</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="!vm.loading" class="text-[16px] divide-y divide-gray-100">
                            <tr v-for="(item, i) in vm.listJadwal" :key="`${i}`">
                                <td class="p-2 whitespace-nowrap">
                                    <div class="font-medium text-gray-800">{{ item.electionName }}</div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">{{ item.status }}</div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">{{
                            $day(item.startedAt).locale('id').format('DD MMMM YYYY H:mm') }}
                                    </div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">{{
                            $day(item.endedAt).locale('id').format('DD MMMM YYYY H:mm') }}
                                    </div>
                                </td>
                                <td class="p-2 text-center whitespace-nowrap">
                                    <div
                                        class="flex justify-center space-x-5 text-lg font-medium text-center text-white">
                                        <nuxt-link :to="`/app/schedule-create/edit-schedule-${item.electionID}`">
                                            <button class="p-1 px-4 bg-blue-500 rounded">Edit</button>
                                        </nuxt-link>
                                        <button @click="deleteSchedule(item.electionID)"
                                            class="p-1 px-4 bg-red-500 rounded">Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="5" class="p-5 text-center text-[20px] font-semibold">
                                    <div class="flex items-center justify-center gap-2">
                                        <span>
                                            loading
                                        </span>
                                        <span class="loader">
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Create pagination in backend -->
            <div class="flex justify-center mt-5" v-if="vm.listJadwal.length">
                <vue-awesome-paginate :totalItems="vm.totalItems" v-model="vm.currentPage" @click="paginate"
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

        <!-- <div class="max-w-full p-4 mx-auto bg-white border border-gray-200 rounded-[10px] shadow-lg">
            <header class="px-5 py-4 border-b border-gray-100">
                <h2 class="font-semibold text-gray-800">Daftar Pemilih</h2>
            </header>
            <div class="p-3">
                <div class="overflow-x-auto">
                    <table class="w-full table-auto">
                        <thead class="font-semibold text-gray-400 uppercase text-[16px] bg-gray-50">
                            <tr>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Nama</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Username</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Detil</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-center">Aksi</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="!vm.loading" class="text-[16px] divide-y divide-gray-100">
                            <tr v-for="(item, i) in userPemilih.listCandidates" :key="`${i}`">
                                <td class="p-2 whitespace-nowrap">
                                    <div class="font-medium text-gray-800">{{ item.fullName }}</div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">{{ item.username }}</div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="font-medium text-left text-green-500">Lihat</div>
                                </td>
                                <td class="p-2 text-center whitespace-nowrap">
                                    <div class="flex justify-center space-x-5 text-lg text-center">
                                        <button>Edit</button>
                                        <button>Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="flex justify-center mt-5" v-if="vm.listCandidates.length">
                <vue-awesome-paginate :totalItems="vm.countPages" v-model="vm.currentPage" @click="paginate"
                    :items-per-page="vm.totalPages" :max-pages-shown="3" paginate-buttons-class="btn"
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
        </div> -->
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

.loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>