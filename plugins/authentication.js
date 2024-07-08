import axios, { formToJSON } from "axios";
import Cookie from 'js-cookie';

export default defineNuxtPlugin((nuxtApp) => {

    const api = axios.create({
        baseURL: `${import.meta.env.VITE_APP_ENV}`
    });
    const baseURL = `${import.meta.env.VITE_APP_ENV}`;

    const successNotif = (value) => {
        useNuxtApp().$toast.info(value);
    };
    const errorNotif = (err) => {
        useNuxtApp().$toast.warn(err);
    };

    const loggedIn = async (body) => {
        // const { data, pending, error } = await useFetch(`${baseURL}/login/user-login/`, {
        //     method: 'post',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: formToJSON(body),
        //     onRequest({ request, options }) {
        //         // console.log(request);
        //         options.headers = options.headers || '';
        //         // options.headers.authorization = 
        //     },
        //     onRequestError({ request, options, error }) {
        //         // console.log(error);
        //         errorNotif(options)
        //     },
        //     onResponse({ request, response, options }) {
        //         // console.log(response);
        //         successNotif(response._data.message);
        //         options.headers.authorization = response._data.token;
        //         localStorage.setItem('token', response._data.token)
        //     },
        //     onResponseError({ request, response, options }) {
        //         // console.log(response?._data);
        //         // errorNotif(response?._data.message)
        //     }
        // })

        // const response = await fetch(`${baseURL}/login/user-login/`,
        //     {
        //         method: 'POST',
        //         body: JSON.stringify(formToJSON(body)),
        //         headers: { 'Content-Type': 'application/json' }
        //     }
        // );

        // if (!response.ok) {
        //     const err = await response.json();
        //     errorNotif(err.message)
        // }

        // const data = await response.json();
        // const token = data.token;
        // await Cookie.set('token', token);
        // localStorage.setItem('token', token)

        await api.post(`/login/user-login/`,
            formToJSON(body), {
            method: 'POST',
            headers: { "Content-Type": "application/json" }
        })
            .then(async (result) => {
                const user = result?.data?.data;
                const token = result?.data?.token;

                if (token) {
                    api.defaults.headers.common.Authorization = `Bearer ${token}`
                }
                Cookie.set('name_user.id', user.id);
                Cookie.set('name_user.name', user.name);
                Cookie.set('name_user.role', user.role);
                await Cookie.set('token', token);
            }).catch((err) => {
                errorNotif(err?.response?.data?.message)
            });
    };

    const logOut = () => {
        Cookie.remove('name_user.id');
        Cookie.remove('name_user.name');
        Cookie.remove('name_user.role');
        Cookie.remove('token');
        successNotif('Berhasil logout')
        setTimeout(() => {
            navigateTo('/login')
        }, 2500);
        delete api.defaults.headers.common.Authorization;
    };

    const isAuthenticate = () => {
        return !!Cookie.get('token');
    };

    const isAuthenticatePemilih = () => {
        return !!Cookie.get('user_pemilih.token');
    };

    nuxtApp.provide('authentication', {
        loggedIn,
        logOut,
        isAuthenticate,
        isAuthenticatePemilih
    });
});