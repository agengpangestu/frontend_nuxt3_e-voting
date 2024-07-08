export default defineNuxtRouteMiddleware((to, from, next) => {
    const { $authentication } = useNuxtApp();

    if (!$authentication.isAuthenticate()) return navigateTo('/login')
});