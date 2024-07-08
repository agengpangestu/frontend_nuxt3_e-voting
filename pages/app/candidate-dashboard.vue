<script setup>
// import day from '~/plugins/day';
import { useNuxtApp } from "#app";
import axios from 'axios';

const { $day } = useNuxtApp();

function truncated(str, num) {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num - 3) + "...";
};

const paginate = (page) => {
    vm.page = page;
    getCandidates();
};

const deleteCandidate = (candidateID) => {
    vm.loading = true
    axios.delete(`${import.meta.env.VITE_APP_ENV}/candidates/${candidateID}/candidate-delete`)
        .then((result) => {
            vm.loading = false;
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }).catch((err) => {
            vm.loading = false;
            console.log(err);
        });
    vm.loading = true;
};

const vm = reactive({
    listCandidates: [],
    totalItems: null,
    totalPages: null,
    currentPage: null,
    sortByDate: 'desc',
    limit: 8,
    page: 1,
    loading: true
});

const getCandidates = async () => {
    vm.loading = true;
    axios.get(`${import.meta.env.VITE_APP_ENV}/candidates/?page=${vm.page}&limit=${vm.limit}&sortByCreated=${vm.sortByDate}`)
        .then((result) => {
            vm.listCandidates = result.data.data;
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

onMounted(() => {
    getCandidates();
});
</script>

<template>
    <div class="space-y-4">
        <div class="max-w-full p-4 mx-auto bg-white border border-gray-200 rounded-[10px] shadow-lg">
            <header class="flex justify-between px-5 py-4 border-b border-gray-100">
                <h2 class="font-semibold text-[18px] text-gray-800">Daftar Kandidat</h2>
                <h2 class="font-medium text-center text-[18px] text-white">
                    <nuxt-link class="p-1 px-4 bg-green-500 rounded" to="/app/candidate-create/candidate">
                        Buat Kandidat
                    </nuxt-link>
                </h2>
            </header>
            <div class="p-3">
                <div class="overflow-x-auto">
                    <table class="w-full table-auto">
                        <thead class="font-semibold text-gray-400 uppercase text-[16px] bg-gray-50">
                            <tr>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Nama Kandidat</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Group / Jabatan</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Tingkat</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Jadwal</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Detil</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Foto</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-center">Aksi</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="!vm.loading" class="text-[16px] divide-y divide-gray-100">
                            <tr v-for="(item, i) in vm.listCandidates" :key="`${i}`">
                                <td class="p-2 whitespace-nowrap">
                                    <div class="font-medium text-gray-800">{{ item.candidateName }}</div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="font-medium text-gray-800">{{ item.group }} / {{ item.candidateRole }}
                                    </div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">{{ item.level }}</div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">
                                        {{ truncated(item.Election.electionName, 15) }}
                                    </div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="font-medium text-left text-green-500">Lihat</div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="font-medium text-left">
                                        <img :src="item.candidateAvatar"
                                            class="w-[100px] h-[100px] object-center object-cover"
                                            alt="pict-candidate" />
                                    </div>
                                </td>
                                <td class="p-2 text-center whitespace-nowrap">
                                    <div
                                        class="flex flex-col items-center justify-center space-y-2 text-lg font-medium text-center text-white">
                                        <nuxt-link :to="`/app/candidate-create/edit-candidate-${item.candidateID}`">
                                            <button class="p-1 w-[110px] bg-blue-500 rounded">
                                                <h6 v-if="!vm.loading">Edit</h6>
                                                <h6 v-else>Loading</h6>
                                            </button>
                                        </nuxt-link>
                                        <button @click="deleteCandidate(item.candidateID)"
                                            class="p-1 w-[110px] bg-red-500 rounded">
                                            <h6 v-if="!vm.loading">Delete</h6>
                                            <h6 v-else>Loading</h6>
                                        </button>
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

            <div class="flex justify-center mt-5" v-if="vm.listCandidates.length">
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
            </div> -->
        <!-- </div> -->
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