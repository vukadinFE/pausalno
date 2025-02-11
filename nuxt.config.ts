// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt", "@vueuse/nuxt"],
  app: {
    head: {
      link: [{ rel: "icon", type: "image/svg", href: "/favicon.svg" }],
    },
  },
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "dark", // Default mode
    fallback: "dark", // Fallback if preference isn't found
    classSuffix: "", // Adds "dark" class to <html>
  },
  ui: {
    colorMode: true,
    theme: {
      colors: [
        "primary",
        "secondary",
        "tertiary",
        "info",
        "success",
        "warning",
        "error",
      ],
    },
  },
});
