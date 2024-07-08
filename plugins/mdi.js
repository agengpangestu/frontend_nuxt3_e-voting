import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';

const icons = { icons: mdijs }

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(mdiVue, icons);
});