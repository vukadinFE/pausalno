<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import useLocalForage from "~/composable/useLocalForage";
import { DATA_PATH } from "~/consts";
import type { TData } from "~/types/data";

const localforage = useLocalForage();

const { data } = useAsyncData(
  async () => {
    const companies: TData[] = [];
    await localforage.iterate((value, key) => {
      if (key.startsWith(DATA_PATH)) {
        companies.push(value as TData);
      }
    });
    return companies;
  },
  { server: false }
);
const generateModalOpen = ref(false);

const items = computed<NavigationMenuItem[] | NavigationMenuItem[][]>(() => {
  const companies: NavigationMenuItem = data.value?.length
    ? {
        label: "Моје фирме",
        icon: "i-lucide-factory",
        to: "/company",
      }
    : {
        label: "Додај фирму",
        icon: "i-lucide-blocks",
        onSelect: () => {
          generateModalOpen.value = true;
        },
      };

  return [
    [],
    [
      companies,
      {
        label: "Донације",
        icon: "i-lucide-hand-heart",
        to: "/donations",
        class: "text-pink-500",
        slot: "highlighted",
        active: true,
      },
      {
        label: "",
        icon: "i-simple-icons-github",
        to: "https://github.com/vukadinFE/pausalno",
        target: "_blank",
      },
    ],
  ];
});
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-(--ui-bg)/90 backdrop-blur supports-[backdrop-filter]:bg-(--ui-bg)/90 h-(--header-height)"
  >
    <UContainer>
      <div class="flex items-center py-4">
        <NuxtLink to="/">
          <img src="/logo-white.svg" class="w-[100px] h-auto block" alt="" />
        </NuxtLink>
        <UNavigationMenu :items="items" class="w-full">
          <template #highlighted-label="{ item }">
            <span class="hidden md:inline">
              {{ item.label }}
            </span>
          </template>
          <template #highlighted-leading>
            <UIcon name="i-lucide-hand-heart" size="20" class="ml-1 md:ml-0" />
          </template>
        </UNavigationMenu>
        <GenerateModal v-model="generateModalOpen" />
      </div>
    </UContainer>
  </header>
</template>

<style>
:root {
  --header-height: 80px;
}
</style>

<style scoped>
:deep(nav ul) {
  gap: 8px;
}
</style>
