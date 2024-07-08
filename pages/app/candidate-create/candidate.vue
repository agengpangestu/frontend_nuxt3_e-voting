<script setup>
import axios from 'axios';
import Cookie from 'js-cookie';

import SelectComp from '~/components/SelectComp.vue';

const successNotif = (value) => {
    useNuxtApp().$toast.info(value);
};
const errorNotif = (err) => {
    useNuxtApp().$toast.warn(err);
};

const formData = reactive({
    candidateName: '',
    candidateVisi: '',
    candidateMisi: '',
    candidateAvatar: null,
    candidateRole: '',
    ketua: null,
    wakil_ketua: null,
    group: '',
    electionID: null,
    level: '',
    createdBy: null,
    loading: false
});
const RoleCandidate = reactive({
    list: [
        { id: 1, name: "KETUA", },
        { id: 2, name: "WAKIL_KETUA", },
    ],
    menu: false,
    load: false,
    selected: null,
});
const Level = reactive({
    list: [{ name: "ORGANISASI" }],
    menu: false,
    load: false,
    selected: null
});
const Schedule = reactive({
    list: [],
    menu: false,
    load: false,
    selected: null
});


const selectRoleCandidate = (item) => {
    RoleCandidate.selected = item;
};
const selectedLevel = (item) => {
    Level.selected = item;
};
const selectSchedule = (item) => {
    Schedule.selected = item;
    fetchSchedule(item);
};

const fetchSchedule = () => {
    axios.get(`${import.meta.env.VITE_APP_ENV}/schedules`)
        .then((result) => {
            Schedule.list = result.data.data;
        }).catch((err) => {
            console.log(err);
        });
};

const postData = () => {
    let body = new FormData();

    const userId = Cookie.get('name_user.id');

    body.append('candidateName', formData.candidateName);
    body.append('candidateVisi', formData.candidateVisi);
    body.append('candidateMisi', formData.candidateMisi);
    body.append('group', formData.group);
    body.append('candidateAvatar', formData.candidateAvatar);
    body.append('candidateRole', RoleCandidate.selected?.name);
    body.append('electionID', Schedule.selected?.electionID);
    body.append('level', Level.selected?.name);
    body.append('createdBy', parseInt(userId));

    // if (RoleCandidate.selected?.name === 'KETUA')
    //     body.append('ketuaID', parseInt(RoleCandidate.selected?.id))
    // if (RoleCandidate.selected?.name === 'WAKIL_KETUA')
    //     body.append('wakilKetuaID', parseInt(RoleCandidate.selected?.id))

    formData.loading = true;

    axios.post(`${import.meta.env.VITE_APP_ENV}/candidates/post`, body
        , {
            headers: { "Content-Type": "multipart/form-data" }
        }
    )
        .then((result) => {
            console.log(result);
            successNotif(result?.data?.message);
            formData.loading = false
        }).catch((err) => {
            console.log(err.response.data);
            errorNotif(err.response.data.message);
            formData.loading = false
        });
    formData.loading = true
};

onMounted(() => {
    fetchSchedule();
});

</script>
<template>
    <div class="p-10">
        <div class="h-auto p-5 space-y-5 bg-white rounded-md shadow-md drop-shadow min-w-max">
            <div class="px-5">
                <h1 class="text-[22px]">Kandidat</h1>
            </div>
            <form @submit.prevent="postData">
                <div class="flex justify-center space-x-5">
                    <div class="space-y-4">
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="nama">Nama Kandidat</label>
                            <input placeholder="Nama Kandidat" class="w-[350px] outline outline-1 rounded pl-2 py-1"
                                v-model="formData.candidateName" type="text" name="nama" id="nama">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="visi">Visi</label>
                            <input placeholder="Visi" class="w-[350px] outline outline-1 rounded pl-2 py-1"
                                v-model="formData.candidateVisi" type="text" name="visi" id="visi">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="misi">Misi</label>
                            <input placeholder="Misi" class="w-[350px] outline outline-1 rounded pl-2 py-1"
                                v-model="formData.candidateMisi" type="text" name="misi" id="misi">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="group">Group</label>
                            <input placeholder="Group" class="w-[350px] outline outline-1 rounded pl-2 py-1"
                                v-model="formData.group" type="text" name="group" id="group">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="role">Role</label>
                            <SelectComp v-model="RoleCandidate.menu" full>
                                <div class="py-2 pl-3 pr-2 w-[350px] border rounded-[8px] outline outline-1 cursor-pointer flex items-center bg-white"
                                    @click="RoleCandidate.menu = !RoleCandidate.menu" role="activator">
                                    <p class="text-[15px] flex-1 font-medium text-grey1">
                                        {{ RoleCandidate.selected?.name ?? "Pilih Role" }}
                                    </p>
                                    <mdicon name="chevron-down" :class="`transition-all delay-1 ${RoleCandidate.menu ? 'rotate-180' : 'rotate-0'
                }`" />
                                </div>

                                <template v-slot:item>
                                    <div class="max-h-[250px] overflow-y-auto styled-scroll"
                                        v-if="RoleCandidate.list.length">
                                        <div class="hover:bg-gray-100 p-2 font-medium rounded-[8px] text-[15px] text-grey1 cursor-pointer"
                                            v-for="(item, i) in RoleCandidate.list" :key="`category-${i}`"
                                            @click="selectRoleCandidate(item)">
                                            {{ item.name }}
                                        </div>
                                        <div class="flex justify-center py-1"
                                            v-if="RoleCandidate.next && !RoleCandidate.load">
                                        </div>
                                    </div>
                                    <p class="text-sm" v-else>...</p>
                                    <p v-if="RoleCandidate.load" class="text-xs text-center">
                                        Sedang memuat data...
                                    </p>
                                </template>
                            </SelectComp>
                        </div>

                    </div>
                    <div class="space-y-4">
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="vote-ketua">Vote Ketua</label>
                            <SelectComp v-model="RoleCandidate.menu" full>
                                <div class="py-2 pl-3 pr-2 w-[350px] border rounded-[8px] outline outline-1 border-gray cursor-pointer flex items-center bg-white"
                                    @click="RoleCandidate.menu = !RoleCandidate.menu" role="activator">
                                    <p class="text-[15px] flex-1 font-medium text-grey1">
                                        {{ RoleCandidate.selected?.name ?? "Pilih Opsi" }}
                                    </p>
                                    <mdicon name="chevron-down" :class="`transition-all delay-1 ${RoleCandidate.menu ? 'rotate-180' : 'rotate-0'
                }`" />
                                </div>

                                <template v-slot:item>
                                    <div class="max-h-[250px] overflow-y-auto styled-scroll"
                                        v-if="RoleCandidate.list.length">
                                        <div class="hover:bg-gray-100 p-2 font-medium rounded-[8px] text-[15px] text-grey1 cursor-pointer"
                                            v-for="(item, i) in RoleCandidate.list" :key="`category-${i}`"
                                            @click="selectRoleCandidate(item)">
                                            {{ item.name }}
                                        </div>
                                        <div class="flex justify-center py-1"
                                            v-if="RoleCandidate.next && !Schedule.load">
                                        </div>
                                    </div>
                                    <p class="text-sm" v-else>...</p>
                                    <p v-if="RoleCandidate.load" class="text-xs text-center">
                                        Sedang memuat data...
                                    </p>
                                </template>
                            </SelectComp>
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="jadwal">Jadwal</label>
                            <SelectComp v-model="Schedule.menu" full>
                                <div class="py-2 pl-3 pr-2 w-[350px] border rounded-[8px] outline outline-1 border-gray cursor-pointer flex items-center bg-white"
                                    @click="Schedule.menu = !Schedule.menu" role="activator">
                                    <p class="text-[15px] flex-1 font-medium text-grey1">
                                        {{ Schedule.selected?.electionName ?? "Pilih Jadwal" }}
                                    </p>
                                    <mdicon name="chevron-down" :class="`transition-all delay-1 ${Schedule.menu ? 'rotate-180' : 'rotate-0'
                }`" />
                                </div>

                                <template v-slot:item>
                                    <div class="max-h-[250px] overflow-y-auto styled-scroll"
                                        v-if="Schedule.list.length">
                                        <div class="hover:bg-gray-100 p-2 font-medium rounded-[8px] text-[15px] text-grey1 cursor-pointer"
                                            v-for="(item, i) in Schedule.list" :key="`category-${i}`"
                                            @click="selectSchedule(item)">
                                            {{ item.electionName }}
                                        </div>
                                        <div class="flex justify-center py-1" v-if="Schedule.next && !Schedule.load">
                                        </div>
                                    </div>
                                    <p class="text-sm" v-else>...</p>
                                    <p v-if="Schedule.load" class="text-xs text-center">
                                        Sedang memuat data...
                                    </p>
                                </template>
                            </SelectComp>
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="level">Level</label>
                            <SelectComp v-model="Level.menu" full>
                                <div class="py-2 pl-3 pr-2 w-[350px] border rounded-[8px] outline outline-1 border-gray cursor-pointer flex items-center bg-white"
                                    @click="Level.menu = !Level.menu" role="activator">
                                    <p class="text-[15px] flex-1 font-medium text-grey1">
                                        {{ Level.selected?.name ?? "Pilih Level" }}
                                    </p>
                                    <mdicon name="chevron-down" :class="`transition-all delay-1 ${Level.menu ? 'rotate-180' : 'rotate-0'
                }`" />
                                </div>

                                <template v-slot:item>
                                    <div class="max-h-[250px] overflow-y-auto styled-scroll" v-if="Level.list.length">
                                        <div class="hover:bg-gray-100 p-2 font-medium rounded-[8px] text-[15px] text-grey1 cursor-pointer"
                                            v-for="(item, i) in Level.list" :key="`category-${i}`"
                                            @click="selectedLevel(item)">
                                            {{ item.name }}
                                        </div>
                                        <div class="flex justify-center py-1" v-if="Level.next && !Level.load">
                                        </div>
                                    </div>
                                    <p class="text-sm" v-else>...</p>
                                    <p v-if="Level.load" class="text-xs text-center">
                                        Sedang memuat data...
                                    </p>
                                </template>
                            </SelectComp>
                        </div>
                        <div class="flex flex-col pt-5 space-y-2 text-[18px]">
                            <label for="uploadCardKandidat">Foto Kandidat</label>
                            <div class="relative inline-block cursor-pointer">
                                <input class="
                                    w-[210px] cursor-pointer
                                    text-[16px] 
                                    file:absolute file:right-0 file:bg-blue-500 file:cursor-pointer
                                    file:text-white file:border-none
                                    file:py-1 file:px-3 file:rounded-full
                                    file:shadow-md file:shadow-blue-500/25" type="file" name="uploadCardKandidat"
                                    id="uploadCardKandidat" @change="e => formData.candidateAvatar = e.target.files[0]">
                            </div>
                        </div>
                    </div>

                </div>
                <div class="flex justify-center pt-8">
                    <button v-if="!formData.loading" type="submit" class="bg-blue-500 text-white px-3 py-1.5 rounded">
                        <h4 class="font-medium">Submit</h4>
                    </button>
                    <button v-else type="submit" class="bg-blue-500 text-white px-3 py-1.5 rounded">
                        <h4 class="font-medium">Loading</h4>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
