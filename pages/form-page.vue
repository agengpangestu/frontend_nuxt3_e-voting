<script setup>
import axios from 'axios';
import Cookie from 'js-cookie';

definePageMeta({
    middleware: ['not-auth-vote']
});

const successNotif = (value) => {
    useNuxtApp().$toast.info(value);
};
const errorNotif = (err) => {
    useNuxtApp().$toast.warn(err);
};
const formData = reactive({
    identityNumber: '',
    fullName: '',
    identityPicture: null,
    loading: false,
});

const submitForm = () => {
    let body = new FormData();
    body.append('identityNumber', formData.identityNumber);
    body.append('fullName', formData.fullName);
    body.append('identityPicture', formData.identityPicture);

    formData.loading = true;

    axios.post(`${import.meta.env.VITE_APP_ENV}/registration-user/post`, body,
        {
            headers: { "Content-Type": "multipart/form-data" }
        }
    )
        .then((result) => {
            formData.loading = false;
            const user_pemilih = result?.data?.data[0],
                token = result.data?.token;
            console.log(token);

            Cookie.set('user_pemilih.id', user_pemilih.id);
            Cookie.set('user_pemilih.name', user_pemilih.nama_pemilih);
            Cookie.set('user_pemilih.token', token)
            successNotif(result.data?.message);

            setTimeout(() => {
                navigateTo('/vote-page')
            }, 3000);
        }).catch((err) => {
            formData.loading = false;
            console.log(err);
            errorNotif(err?.response?.data?.message);
        });

    formData.loading = true;
};

</script>
<template>

    <div class="flex items-center justify-center w-full h-screen p-10">
        <div class="w-auto h-auto space-y-5 bg-white">
            <div>
                <h1 class="text-[22px]">E-Voting</h1>
            </div>
            <div class="bg-white drop-shadow w-[450px] h-[500px] p-10 space-y-10 rounded">
                <div class="flex justify-center font-bold text-[22px]">
                    <h2>Formulir Pendaftaran Pemilihan</h2>
                </div>
                <form @submit.prevent="submitForm">
                    <div class="space-y-4">
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="identityNumber">Nomor Identitas</label>
                            <input placeholder="Nomor Identitas"
                                class="w-full py-1 pl-2 rounded remove-arrow outline outline-1"
                                v-model="formData.identityNumber" type="number" min="0" name="identityNumber"
                                id="identityNumber">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="fullname">Nama Lengkap</label>
                            <input placeholder="Nama Lengkap" class="w-full py-1 pl-2 rounded outline outline-1"
                                v-model="formData.fullName" type="text" name="fullname" id="fullname">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="uploadCard">Upload Kartu Identitas</label>
                            <div class="relative inline-block">
                                <input class="
                                    w-[210px] 
                                    text-[16px] 
                                    file:absolute file:right-0 file:bg-blue-500 
                                    file:text-white file:border-none
                                    file:py-1 file:px-3 file:rounded-full
                                    file:shadow-md file:shadow-blue-500/25" type="file" name="uploadCard"
                                    id="uploadCard" @change="e => formData.identityPicture = e.target.files[0]">
                            </div>
                        </div>

                        <div class="flex justify-center pt-8">
                            <nuxt-link to="">
                                <button v-if="!formData.loading"
                                    class="p-2 w-[350px] text-white bg-blue-500 rounded-md text-[20px]">Login</button>
                                <button v-else
                                    class="p-2 w-[350px] text-white bg-blue-500 rounded-md text-[20px]">Loading</button>
                            </nuxt-link>
                        </div>
                    </div>
                </form>
            </div>
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