<script setup lang="ts">
import { UContainer } from "#components";
import localforage from "localforage";
import { DATA_PATH, STATE_PATH } from "~/consts";
import type { TData } from "~/types/data";

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

const items = ref(data.value || []);

watch(data, () => {
  items.value = data.value || [];
});

const onDelete = async (name: string) => {
  items.value = items.value.filter((item) => item.firma !== name);
  await localforage.removeItem(dataStorage(name));

  const keys = await localforage.keys();

  for (let item in keys) {
    const key = keys[item];
    if (key.startsWith(`${STATE_PATH}/${companyName(name)}`)) {
      await localforage.removeItem(key);
    }
  }
};
</script>

<template>
  <section class="mt-20">
    <UContainer>
      <div class="items gap-3">
        <CompanyCard
          v-for="item in items"
          :item="item"
          :key="item.firma"
          @delete="onDelete(item.firma)"
        />

        <UCard
          class="dark:ring-gray-800 dark:bg-gray-900 flex items-center justify-center fency-bg before:bg-cover min-h-[250px]"
        >
          <GenerateModal>
            <UButton> Додај нову фирму </UButton>
          </GenerateModal>
        </UCard>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.items {
  @apply grid self-start;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
}
</style>
