<script setup lang="ts">
import { format, getMonth } from "date-fns";
import { sr } from "date-fns/locale/sr";
import { useDataStore } from "~/store/useDataStore";

const router = useRouter();

const dataStore = useDataStore();

watch(
  dataStore,
  (dataStore) => {
    console.log({ error: dataStore.error });
    if (!dataStore.fetching && dataStore.error) {
      router.push("/");
    }
  },
  { immediate: true }
);

const currentMonth = getMonth(new Date());

const active = ref(currentMonth.toString());

const items = Array.from({ length: 12 }).map((_, index) => {
  const monthName = format(new Date(2022, index, 1), "LLLL", {
    locale: sr,
  });
  return {
    label: `Месец ${monthName}`,
    icon: "i-lucide-calendar-days",
    index,
  };
});
</script>

<template>
  <div class="relative flex items-center justify-center overflow-hidden">
    <UContainer
      class="w-[960px] tracking-tight text-gray-600 dark:text-gray-300"
    >
      <UAccordion :items="items" v-model="active">
        <template #content="{ item }">
          <DisplayMonth :month="item.index" />
        </template>
      </UAccordion>
    </UContainer>
  </div>
</template>
