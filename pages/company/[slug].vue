<script setup lang="ts">
import { format, getMonth } from "date-fns";
import { sr } from "date-fns/locale/sr";
import { useDataStore } from "~/store/useDataStore";
import useLocalForage from "~/composable/useLocalForage";
import type { TState } from "~/types/data";
import type { NavigationMenuItem } from "@nuxt/ui";

const router = useRouter();

const route = useRoute();

const slug = computed(() => route.params.slug as string);

useSeoMeta({
  title: `${slug.value} - IPS за паушалце`,
  description: "Плати паушални порез за сваки месец у години",
  ogImage: "https://pausalno.rs/ips-za-pausalce.png",
});

const dataStore = useDataStore(slug.value)();

watch(
  dataStore,
  (dataStore) => {
    if (!dataStore.fetching && dataStore.error) {
      router.push("/");
    }
  },
  { immediate: true }
);

const currentMonth = getMonth(new Date());

const localforage = useLocalForage();

const getMonthClass = async (month: number) => {
  const key = stateStorage(slug.value, month);
  const data = await localforage.getItem<TState>(key);
  if (data && Object.values(data).every((value) => value === true)) {
    return "text-green-500";
  }

  if (month < currentMonth) {
    if (Object.values(data || {}).every((value) => value === false)) {
      return "text-red-500";
    }
  }
  if (month <= currentMonth) {
    if (!Object.values(data || {}).every((value) => value === true)) {
      return "text-yellow-500";
    }
  }
};

const fetchMonths = async (a: number) => {
  return await Promise.all(
    Array.from({ length: 12 }).map(async (_, index) => {
      const monthName = format(new Date(2022, index, 1), "LLLL", {
        locale: sr,
      });

      return {
        label: `${monthName}`,
        class: `capitalize cursor-pointer ${await getMonthClass(index)}`,
        active: index === a,

        onSelect: () => {
          active.value = index;
        },
      };
    })
  );
};

const active = ref(currentMonth);

const items = ref<NavigationMenuItem[]>([]);

watch(
  active,
  async (a) => {
    items.value = await fetchMonths(a);
  },
  { immediate: true }
);

const onUpdate = async () => {
  items.value = await fetchMonths(active.value);
};

const navItems = computed(() => [
  {
    label: "Месеци",
    icon: "i-lucide-calendar-arrow-down",
    open: true,
    children: items.value,
  },
]);
</script>

<template>
  <div class="mt-16">
    <UContainer class="text-gray-600 dark:text-gray-300 w-full">
      <div class="md:grid grid-cols-[auto_1fr] gap-4">
        <UNavigationMenu
          orientation="vertical"
          :items="navItems"
          class="md:data-[orientation=vertical]:w-48 mb-5"
          color="secondary"
          highlight
        />
        <div>
          <DisplayMonth :month="active" @updated="onUpdate" />
          <UAlert
            class="mt-4"
            variant="subtle"
            color="warning"
            title="Упозорење!"
            description="Приликом скенирања проверите да ли су сви подаци тачни. Уколико сте унели нетачне податке сами сносите одговорност."
            icon="i-lucide-triangle-alert"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>
