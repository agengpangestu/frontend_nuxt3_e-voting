<script setup>

</script>
<template>
    <div class="flex items-center justify-center w-full h-screen p-10 space-y-5 bg-white">
        <div class="space-y-5">
            <div class="">
                <h1 class="text-[24px]">E-Voting</h1>
            </div>
            <div class="w-auto h-auto p-5 ">
                <div class="flex justify-center h-[200px] w-[500px]">
                    <div class="space-y-4 text-center text-[24px]">
                        <h2>Pilihanmu Disimpan</h2>
                        <p>Terima Kasih telah memilih <br> calon kandidat</p>
                    </div>
                </div>
                <div class="flex items-center justify-center">
                    <nuxt-link to="/result_vote-page">
                        <button class="text-[22px] p-1 px-4 bg-blue-500 rounded text-white">
                            Hasil Voting
                        </button>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </div>
</template>