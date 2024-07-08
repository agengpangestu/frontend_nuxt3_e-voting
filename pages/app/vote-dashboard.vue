<script setup>
// import day from '~/plugins/day';
import { useNuxtApp } from "#app";
import axios from 'axios';
import Cookie from 'js-cookie';

const { $day } = useNuxtApp();

const resultVotePaginate = (page) => {
    resultVote.page = page;
    resultVotes();
};
const paginate = (page) => {
    vm.page = page;
    fetchVotes();
};

const selectedElection = (election) => {
    schedule.selected = election;
    resultVotes();
}

const schedule = reactive({
    list: [],
    load: false,
    menu: false,
    selected: null
});
const resultVote = reactive({
    list: [],
    page: 1,
    limit: 10,
    totalItems: null,
    totalPages: null,
    currentPage: null,
    loading: true
});
const vm = reactive({
    listVotes: [],
    totalItems: null,
    totalPages: null,
    currentPage: null,
    sortByDate: 'desc',
    limit: 15,
    page: 1,
    loading: true
});

const fetchVotes = () => {
    vm.loading = true;
    axios.get(`${import.meta.env.VITE_APP_ENV}/votes/?page=${vm.page}&limit=${vm.limit}`)
        .then((result) => {
            vm.listVotes = result.data.data;
            // console.log(vm.listVotes);
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
const resultVotes = () => {

    resultVote.loading = true;
    axios.get(`
    ${import.meta.env.VITE_APP_ENV}/result-vote/result-new?page=${resultVote.page}&limit=${resultVote.limit}&createdAt=desc&electionID=${schedule.selected?.electionID ?? ''}
    `)
        .then((result) => {
            resultVote.list = result.data.data;
            console.log(result.data);
            resultVote.totalItems = result.data.countElection;
            resultVote.totalPages = result.data.totalPagesElection;
            resultVote.currentPage = result.data.currentPage;
            resultVote.loading = false;
        }).catch((err) => {
            console.log(err.response);
            resultVote.loading = false
        });
    resultVote.loading = true;
};
const fetchSchedule = () => {
    axios.get(`${import.meta.env.VITE_APP_ENV}/schedules`)
        .then((result) => {
            schedule.list = result.data.data;
        }).catch((err) => {
            console.log(err);
        });
};

onMounted(() => {
    fetchVotes();
    resultVotes();
    fetchSchedule();
});
</script>

<template>
    <div class="space-y-4">
        <div class="max-w-full p-4 mx-auto bg-white border border-gray-200 rounded-[10px] shadow-lg">
            <header class="flex justify-between px-5 py-4 border-b border-gray-100">
                <h2 class="font-semibold text-[18px] text-gray-800">Daftar Vote</h2>

            </header>
            <div class="p-3">
                <div class="overflow-x-auto">
                    <table class="w-full table-auto">
                        <thead class="font-semibold text-gray-400 uppercase text-[16px] bg-gray-50">
                            <tr>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Kandidat</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Jabatan</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Pemilih</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Jadwal</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Tanggal Melakukan Voting</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="!vm.loading" class="text-[16px] divide-y divide-gray-100">
                            <tr v-if="vm.listVotes.length" v-for="(item, i) in vm.listVotes" :key="`${i}`">
                                <td class="p-2 whitespace-nowrap">
                                    <div class="font-medium text-gray-800">
                                        {{
                            (item.ketua?.candidateName === item.wakilKetua?.candidateName)
                                ?
                                item.ketua?.candidateName :
                                item.ketua?.candidateName + ' - ' + item.wakilKetua?.candidateName
                        }}
                                    </div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="font-medium text-gray-800">
                                        {{ `${(item.ketua?.candidateRole !== item.wakilKetua?.candidateRole)
                            ? (item.ketua?.candidateRole ? 'Ketua' : '') + " - " +
                            (item.wakilKetua?.candidateRole ? 'Wakil Ketua' : '')
                            : (item.ketua?.candidateRole ? 'Ketua' : '')} ` }}
                                    </div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">{{ item.User?.fullName }}</div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">{{ item.Election_Schedul?.electionName }}</div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">
                                        {{ $day(item.createdAt).locale('id').format('DD MMMM YYYY H:mm') }}
                                    </div>
                                </td>
                            </tr>
                            <tr v-else>
                                <td colspan="5" class="p-5 text-center text-[20px] font-semibold">
                                    <div>Tidak ada data</div>
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

            <div class="flex justify-center mt-5" v-if="vm.listVotes.length">
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

        <div class="max-w-full p-4 mx-auto bg-white border border-gray-200 rounded-[10px] shadow-lg">
            <header class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 class="font-semibold text-[18px] text-gray-800">Hasil Voting</h2>
                <SelectComp v-model="schedule.menu" full>
                    <div class="py-2 pl-3 pr-2 w-[350px] border border-gray-400 rounded-[8px] cursor-pointer flex items-center bg-white"
                        @click="schedule.menu = !schedule.menu" role="activator">
                        <p class="text-[15px] flex-1 font-medium ">
                            {{ schedule.selected?.electionName ?? "Pilih Jadwal" }}
                        </p>
                        <mdicon name="chevron-down"
                            :class="`transition-all delay-1 ${schedule.menu ? 'rotate-180' : 'rotate-0'}`" />
                    </div>

                    <template v-slot:item>
                        <div class="max-h-[250px] overflow-y-auto styled-scroll" v-if="schedule.list.length">
                            <div class="hover:bg-gray-100 p-2 font-medium rounded-[8px] text-[15px] cursor-pointer"
                                v-for="(item, i) in schedule.list" :key="`category-${i}`"
                                @click="selectedElection(item)">
                                {{ item.electionName }}
                            </div>
                            <div class="flex justify-center py-1" v-if="schedule.next && !schedule.load">
                            </div>
                        </div>
                        <p class="text-sm" v-else>...</p>
                        <p v-if="schedule.load" class="text-xs text-center">
                            Sedang memuat data...
                        </p>
                    </template>
                </SelectComp>
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
                                    <div class="font-semibold text-left">Jabatan</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Grup</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Jadwal</div>
                                </th>
                                <th class="p-2 whitespace-nowrap">
                                    <div class="font-semibold text-left">Jumlah Voting</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="!vm.loading" class="text-[16px] divide-y divide-gray-100">
                            <tr v-for="(item, i) in resultVote.list" :key="`${i}`">
                                <td class="p-2 whitespace-nowrap">
                                    <div class="font-medium text-gray-800">
                                        {{ item.ketua }} - {{ item.wakil_ketua }}
                                    </div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="font-medium text-gray-800">
                                        {{ item.role_ketua ? 'Ketua' : '' }} - {{ item.role_wakil_ketua ? 'Wakil Ketua' : '' }}
                                    </div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">{{ item.group }}</div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">
                                        {{ item.schedule }}
                                    </div>
                                </td>
                                <td class="p-2 whitespace-nowrap">
                                    <div class="text-left">
                                        {{ item.count_result_vote }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- <div class="flex justify-center mt-5" v-if="resultVote.list.length">
                <vue-awesome-paginate :totalItems="resultVote.totalItems" v-model="resultVote.currentPage"
                    @click="resultVotePaginate" :items-per-page="resultVote.limit" :max-pages-shown="3"
                    paginate-buttons-class="btn" active-page-class="btn-active" back-button-class="back-btn"
                    next-button-class="next-btn">
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