export default defineNuxtRouteMiddleware((to, from, next) =>    {
    const { $authentication } = useNuxtApp();
    
    if (!$authentication.isAuthenticatePemilih()) return navigateTo('/form-page');
});