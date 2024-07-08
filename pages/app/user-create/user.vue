<script setup>
import axios from 'axios';


const successNotif = (value) => {
    useNuxtApp().$toast.info(value);
};
const errorNotif = (err) => {
    useNuxtApp().$toast.warn(err);
};

const selectedRole = (role) => {
    Role.selected = role;
};

const formData = reactive({
    username: '',
    password: '',
    email: '',
    role: '',
    fullName: '',
    age: null,
    identityNumber: null,
    uploadIdentity: null,
    loading: false
});
const Role = reactive({
    list: [{ name: "ADMIN" }, { name: "PEMILIH" }],
    menu: false,
    load: false,
    selected: null,
});

const postData = () => {
    let body = new FormData();
    body.append('username', formData.username);
    body.append('password', formData.password);
    body.append('email', formData.email);
    body.append('role', Role.selected?.name);
    body.append('fullName', formData.fullName);
    body.append('age', formData.age);
    body.append('identityNumber', formData.identityNumber);
    body.append('identityPicture', formData.uploadIdentity);

    formData.loading = true;

    axios.post(`${import.meta.env.VITE_APP_ENV}/users/post`, body, {
        headers: { "Content-Type": "multipart/form-data" }
    })
        .then((result) => {
            formData.loading = false;
            successNotif(result.data?.message);
        }).catch((err) => {
            console.log(err.response.data);
            formData.loading = false;
            errorNotif(err?.response?.data?.message);
        });
    formData.loading = true;
};

</script>
<template>
    <div class="p-10">
        <div class="h-auto p-5 bg-white rounded-md shadow-md drop-shadow min-w-max">
            <div class="px-5">
                <h1 class="text-[22px]">User</h1>
            </div>
            <form @submit.prevent="postData">
                <div class="flex justify-center space-x-5">
                    <div class="space-y-4">
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="username">Username</label>
                            <input placeholder="Username"
                                class="w-[350px] remove-arrow outline outline-1 rounded pl-2 py-1"
                                v-model="formData.username" type="text" name="username" id="username">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="password">Password</label>
                            <input placeholder="Password"
                                class="w-[350px] remove-arrow outline outline-1 rounded pl-2 py-1"
                                v-model="formData.password" type="password" name="password" id="password">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="email">Email</label>
                            <input placeholder="Email"
                                class="w-[350px] remove-arrow outline outline-1 rounded pl-2 py-1"
                                v-model="formData.email" type="text" name="email" id="email">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="role">Role</label>
                            <SelectComp v-model="Role.menu" full>
                                <div class="py-2 pl-3 pr-2 w-[350px] border rounded-[8px] outline outline-1 cursor-pointer flex items-center bg-white"
                                    @click="Role.menu = !Role.menu" role="activator">
                                    <p class="text-[15px] flex-1 font-medium text-grey1">
                                        {{ Role.selected?.name ?? "Pilih Role" }}
                                    </p>
                                    <mdicon name="chevron-down" :class="`transition-all delay-1 ${Role.menu ? 'rotate-180' : 'rotate-0'
                }`" />
                                </div>

                                <template v-slot:item>
                                    <div class="max-h-[250px] overflow-y-auto styled-scroll" v-if="Role.list.length">
                                        <div class="hover:bg-gray-100 p-2 font-medium rounded-[8px] text-[15px] text-grey1 cursor-pointer"
                                            v-for="(item, i) in Role.list" :key="`category-${i}`"
                                            @click="selectedRole(item)">
                                            {{ item.name }}
                                        </div>
                                        <div class="flex justify-center py-1" v-if="Role.next && !Role.load">
                                        </div>
                                    </div>
                                    <p class="text-sm" v-else>...</p>
                                    <p v-if="Role.load" class="text-xs text-center">
                                        Sedang memuat data...
                                    </p>
                                </template>
                            </SelectComp>
                        </div>

                    </div>
                    <div class="space-y-4">
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="identityNumber">Nomor Identitas</label>
                            <input placeholder="Nomor Identitas"
                                class="w-[350px] remove-arrow outline outline-1 rounded pl-2 py-1"
                                v-model="formData.identityNumber" type="number" min="0" name="identityNumber"
                                id="identityNumber">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="fullname">Nama Lengkap</label>
                            <input placeholder="Nama Lengkap" class="w-[350px] outline outline-1 rounded pl-2 py-1"
                                v-model="formData.fullName" type="text" name="fullname" id="fullname">
                        </div>
                        <div class="flex flex-col space-y-2 text-[18px]">
                            <label for="umur">Umur</label>
                            <input placeholder="Umur" class="w-[350px] remove-arrow outline outline-1 rounded pl-2 py-1"
                                v-model="formData.age" type="number" min="0" name="umur" id="umur">
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
                                    id="uploadCard" @change="e => formData.uploadIdentity = e.target.files[0]">
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