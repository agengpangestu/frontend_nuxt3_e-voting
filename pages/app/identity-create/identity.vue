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
    fullName: '',
    noAnggota: null,
    createdBy: null,
    loading: false
});


const postData = () => {
    let body = new FormData();

    const userId = Cookie.get('name_user.id');

    body.append('fullName', formData.fullName);
    body.append('NoAnggota', parseInt(formData.noAnggota));
    body.append('createdBy', parseInt(userId));

    formData.loading = true;

    axios.post(`${import.meta.env.VITE_APP_ENV}/identity-verif/post-no_anggota`, body
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

});

</script>
<template>
    <div class="p-10">
        <div class="h-auto p-5 space-y-5 bg-white rounded-md shadow-md drop-shadow min-w-max">
            <div class="px-5">
                <h1 class="text-[22px]">Identitas Pemilih</h1>
            </div>
            <form @submit.prevent="postData">
                <div class="flex justify-center space-x-5">
                    <div class="space-y-4">
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="nama_pemilih">Nama Pemilih</label>
                            <input placeholder="Nama Pemilih" class="w-[350px] outline outline-1 rounded pl-2 py-1"
                                v-model="formData.fullName" type="text" name="nama_pemilih" id="nama_pemilih">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="noAnggota">Nomor Anggota</label>
                            <input placeholder="Nomor Anggota"
                                class="w-[350px] remove-arrow outline outline-1 rounded pl-2 py-1"
                                v-model="formData.noAnggota" type="number" min="0" name="noAnggota" id="noAnggota">
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
<style>
.remove-arrow::-webkit-inner-spin-button,
.remove-arrow::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.remove-arrow {
    -appearance: textfield;
}
</style>