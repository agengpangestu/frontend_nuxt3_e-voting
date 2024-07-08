<script setup>
import axios from 'axios';
import Cookie from 'js-cookie';

definePageMeta({
    middleware: ['auth-vote']
});

const successNotif = (value) => {
    useNuxtApp().$toast.info(value);
};
const errorNotif = (err) => {
    useNuxtApp().$toast.warn(err);
};

const loading = ref(true);

const vm = reactive({
    candidate: [],
    loading: true,
    election: null,
    status: null,
    ketuaID: null,
    wakil_ketuaID: null,
    ifVoted: false,
    electionID: null,
    userID: null,
});

const voteClicked = (data) => {
    console.log(data);
    vm.userID = Cookie.get('user_pemilih.id');
    // vm.candidateID = data.DATA[0].candidateID;
    vm.electionID = data.DATA[0].electionID;
    vm.ketuaID = data.DATA[0].candidateID;

    if (data.DATA[1])
        vm.wakil_ketuaID = data.DATA[1]?.candidateID

    if (!data.DATA[1])
        vm.wakil_ketuaID = data.DATA[0]?.candidateID
    // console.log(data.DATA[0]);
    return
};

const votedCandidate = () => {

    let body = new FormData();
    // body.append('userID', parseInt(vm.userID));
    // body.append('candidateID', vm.candidateID);
    body.append('electionID', vm.electionID);
    body.append('userID', vm.userID);
    body.append('electionID', vm.electionID);
    body.append('ketuaID', vm.ketuaID);
    body.append('wakilKetuaID', vm.wakil_ketuaID);

    // console.log(vm.ketuaID, vm.wakil_ketuaID);

    loading.value = true

    axios.post(`${import.meta.env.VITE_APP_ENV}/votes/post`, body,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookie.get('user_pemilih.token')}`
            }
        }
    )
        .then((result) => {
            loading.value = false;
            console.log(result);
            successNotif(result.data?.message)
            Cookie.remove('user_pemilih.id');
            Cookie.remove('user_pemilih.name');
            Cookie.remove('user_pemilih.token');

            setTimeout(() => {
                navigateTo('/greeting-page')
            }, 5000);
        }).catch((err) => {
            loading.value = false;
            console.error(err);

            if (err.response?.data?.message === 'Unauthorized' || err.response.status === 401)
                errorNotif(err.response?.data?.message
                    ? 'Masa aktif token sudah habis, anda tidak bisa memilih' : err.response?.data?.message
                )

            errorNotif(err.response?.data?.message)
        });

    loading.value = true;
};
// const fetchScheduleAndCandidate = async () => {

//     try {
//         const data = await axios.get(`${import.meta.env.VITE_APP_ENV}/schedules/?status=${vm.status = 'ACTIVE'}`)
//         const electionID = data.data.data[0].electionID;
//         vm.election = electionID;
//     } catch (err) {
//         console.log(err);
//     }
// };
const fetchCandidate = async () => {
    vm.loading = true;

    try {
        const data = await axios.get(`${import.meta.env.VITE_APP_ENV}/schedules/?status=${vm.status = 'ACTIVE'}`);

        if (!data.data.data.length) {
            errorNotif('Tidak ada pemilihan');
        }
        else {
            const electionID = data.data.data[0].electionID;
            vm.election = electionID;

            const candidate = await axios.get(`${import.meta.env.VITE_APP_ENV}/candidates/group/?electionID=${electionID}`)
            vm.candidate = candidate.data.data;
            console.log(vm.candidate);

            vm.loading = false;
        }
    } catch (err) {
        console.log(err);
        vm.loading = false
    }
    vm.loading = true
};

onMounted(() => {
    fetchCandidate();
});
</script>
<template>
    <div class="flex items-center justify-center w-full h-auto p-10 bg-white">
        <div class="space-y-5">
            <div>
                <h1 class="text-[22px]">E-Voting</h1>
            </div>
            <div class="w-[800px] h-auto p-10 space-y-10 bg-white rounded drop-shadow">
                <div class="flex justify-center font-bold text-[22px]">
                    <h2>Calon Kandidat</h2>
                </div>
                <form @submit.prevent="votedCandidate()">
                    <div class="space-y-4">
                        <div v-if="Object.keys(vm.candidate).length" :class="`
                            flex 
                            ${Object.keys(vm.candidate).length > 1 ? 'flex-col space-y-20' : 'space-x-20'} 
                            justify-center items-center 
                            text-[18px]`">
                            <div v-for="(item, i) in vm.candidate" :key="i">
                                <div class="flex flex-col space-y-5">
                                    <p>Kandidat {{ i }}</p>
                                    <div :class="`
                                        flex ${item.length > 1 ? 'flex-col' : ''} 
                                        items-center justify-center`">
                                        <div :class="` `" v-for="candidate in item.DATA" :key="candidate.candidateID">
                                            <div class="flex flex-col items-center space-y-5 mx-14">
                                                <!-- <p>{{ candidate.candidateName }}</p> -->
                                                <img class="w-[150px] h-[150px] object-center object-cover"
                                                    :src="candidate.candidateAvatar" alt="" srcset="">
                                                <span>
                                                    {{ candidate.candidateRole === 'KETUA' ? 'Ketua' : 'Wakil Ketua' }}
                                                    -
                                                    {{ candidate.candidateName }}
                                                </span>
                                                <span>{{ candidate.group }}</span>
                                                <div class="space-y-5">
                                                    <span class="grid place-items-center space-y-2.5">
                                                        <label class="font-bold text-[18px]" for="visi">Visi</label>
                                                        <p id="visi" class="text-[18px]">
                                                            {{ candidate.candidateVisi || 'Tidak ada Visi' }}
                                                        </p>
                                                    </span>
                                                    <span class="grid place-items-center space-y-2.5">
                                                        <label class="font-bold text-[18px]" for="misi">Misi</label>
                                                        <p id="misi" class="text-[18px]">
                                                            {{ candidate.candidateMisi || 'Tidak ada Misi' }}
                                                        </p>
                                                    </span>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="grid pt-10 place-items-center">
                                        <button @click="voteClicked(item)"
                                            class="p-1 px-5 text-white bg-blue-500 text-[18px] rounded">
                                            <h6 v-if="loading">Vote</h6>
                                            <h6 v-else>Loading</h6>
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div v-else class="flex justify-center pt-8">
                            <h1 class="text-[20px]">Tidak ada pemilihan</h1>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
