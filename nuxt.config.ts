// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/scripts",
    "@nuxthub/core",
  ],
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
  routeRules: {
    "/": {
      prerender: true,
    },
    // "/prijava": {
    //   prerender: true,
    // },
    "/firme": {
      prerender: true,
    },
    "/firme/**": {
      ssr: false,
    },
    // "/preduzetnik": {
    //   ssr: false,
    // },
    "/donacije": {
      prerender: true,
    },
  },
  scripts: {
    registry: {
      googleAnalytics: {
        id: process.env.NUXT_PUBLIC_GA_ID || "",
      },
    },
  },
});
