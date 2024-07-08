<script setup>
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import Cookie from 'js-cookie';

import SelectComp from '~/components/SelectComp.vue';

const route = useRoute();
const electionID = ref(parseInt(route.params.id));

const successNotif = (value) => {
    useNuxtApp().$toast.info(value);
};
const errorNotif = (err) => {
    useNuxtApp().$toast.warn(err);
};

const formData = reactive({
    electionName: '',
    electionDesc: '',
    status: '',
    createdBy: null,
    startedAt: null,
    endedAt: null,
    loading: false
});
const Status = reactive({
    list: [
        { name: "ACTIVE", },
        { name: "CLOSED", },
    ],
    menu: false,
    load: false,
    selected: null,
});


const selectStatus = (item) => {
    Status.selected = item;
};

const fetchData = () => {
    axios.get(`${import.meta.env.VITE_APP_ENV}/schedules/${electionID.value}/schedule`)
        .then((result) => {
            console.log(result);
            let rawData = result.data.data;
            formData.electionName = rawData.electionName;
            formData.electionDesc = rawData.electionDesc;
            formData.startedAt = rawData.startedAt;
            formData.endedAt = rawData.endedAt;
            Status.selected = rawData.status;
        }).catch((err) => {
            console.log(err);
        });
};
const postData = () => {
    let body = new FormData();

    const userId = Cookie.get('name_user.id');

    body.append('electionName', formData.electionName);
    body.append('electionDesc', formData.electionDesc);
    body.append('status', Status.selected?.name || Status.selected);
    body.append('createdBy', parseInt(userId));
    body.append('startedAt', new Date(formData.startedAt).toISOString());
    body.append('endedAt', new Date(formData.endedAt).toISOString());

    formData.loading = true;

    axios.patch(`${import.meta.env.VITE_APP_ENV}/schedules/${electionID.value}/schedule-update`, body
        , {
            headers: { "Content-Type": "application/json" }
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
    fetchData();
});

</script>
<template>
    <div class="p-10">
        <div class="h-auto p-5 space-y-5 bg-white rounded-md shadow-md drop-shadow min-w-max">
            <div class="px-5">
                <h1 class="text-[22px]">Jadwal</h1>
            </div>
            <form @submit.prevent="postData">
                <div class="flex justify-center space-x-5">
                    <div class="space-y-4">
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="nama">Nama Jadwal</label>
                            <input placeholder="Nama Jadwal" class="w-[350px] outline outline-1 rounded pl-2 py-1"
                                v-model="formData.electionName" type="text" name="nama" id="nama">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="deskripsi">Deskripsi</label>
                            <input placeholder="Deskripsi" class="w-[350px] outline outline-1 rounded pl-2 py-1"
                                v-model="formData.electionDesc" type="text" name="deskripsi" id="deskripsi">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="mulai">Tanggal Mulai</label>
                            <VueDatePicker v-model="formData.startedAt"></VueDatePicker>
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="berakhir">Tanggal Berakhir</label>
                            <VueDatePicker v-model="formData.endedAt"></VueDatePicker>
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="status">Status</label>
                            <SelectComp v-model="Status.menu" full>
                                <div class="py-2 pl-3 pr-2 w-[350px] border rounded-[8px] outline outline-1 cursor-pointer flex items-center bg-white"
                                    @click="Status.menu = !Status.menu" role="activator">
                                    <p class="text-[15px] flex-1 font-medium text-grey1">
                                        {{ Status.selected?.name ?? Status.selected ?? "Pilih Status" }}
                                    </p>
                                    <mdicon name="chevron-down" :class="`transition-all delay-1 ${Status.menu ? 'rotate-180' : 'rotate-0'
                }`" />
                                </div>

                                <template v-slot:item>
                                    <div class="max-h-[250px] overflow-y-auto styled-scroll" v-if="Status.list.length">
                                        <div class="hover:bg-gray-100 p-2 font-medium rounded-[8px] text-[15px] text-grey1 cursor-pointer"
                                            v-for="(item, i) in Status.list" :key="`category-${i}`"
                                            @click="selectStatus(item)">
                                            {{ item.name }}
                                        </div>
                                        <div class="flex justify-center py-1" v-if="Status.next && !Status.load">
                                        </div>
                                    </div>
                                    <p class="text-sm" v-else>...</p>
                                    <p v-if="Status.load" class="text-xs text-center">
                                        Sedang memuat data...
                                    </p>
                                </template>
                            </SelectComp>
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
