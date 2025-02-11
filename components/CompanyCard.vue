<script setup lang="ts">
import { UBadge } from "#components";
import { format, getMonth } from "date-fns";
import { sr } from "date-fns/locale";
import useLocalForage from "~/composable/useLocalForage";
import { type TState, type TData } from "~/types/data";

type Props = {
  item: TData;
};

const props = defineProps<Props>();

const month = getMonth(new Date());

const localforage = useLocalForage();

const state = ref<TState>();
const loading = ref(false);

const getData = async () => {
  loading.value = true;
  const key = stateStorage(props.item.firma, month);
  const data = await localforage.getItem<TState>(key);
  state.value = data ?? undefined;
  loading.value = false;
};

getData();

const monthState = computed(() => {
  if (!state.value) return "error";
  if (Object.values(state.value).every((value) => value === true))
    return "success";
  if (Object.values(state.value).every((value) => value === false))
    return "error";
  return "warning";
});

defineEmits(["delete"]);

const deleteModal = ref(false);
</script>

<template>
  <CompanyDeleteModal
    v-model="deleteModal"
    :name="item.firma"
    @delete="$emit('delete')"
  />
  <UCard
    class="dark:ring-gray-800 dark:bg-gray-900 min-h-[250px]"
    :key="item.firma"
    :ui="{ footer: 'flex justify-end' }"
  >
    <template #header>
      <div class="flex justify-between items-center gap-3">
        <p
          class="text-base truncate font-semibold leading-6 text-gray-900 dark:text-white"
        >
          {{ item.firma }}
        </p>
        <div>
          <UDropdownMenu
            :items="[
              {
                label: 'Обриши',
                icon: 'i-lucide-trash-2',
                color: 'error',
                onSelect: () => (deleteModal = true),
              },
            ]"
            :content="{ side: 'bottom', align: 'end' }"
            size="sm"
            class="!min-w-auto"
            :ui="{
              content: 'min-w-0',
            }"
          >
            <UButton
              icon="i-lucide-ellipsis"
              variant="outline"
              color="neutral"
            />
          </UDropdownMenu>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
      <div
        class="text-sm text-[var(--ui-text-muted)] whitespace-nowrap capitalize"
      >
        {{ format(new Date(), "LLLL", { locale: sr }) }}
      </div>
      <div class="text-sm text-[var(--ui-text-muted)] whitespace-nowrap">
        <UBadge variant="subtle" :color="monthState">
          <template v-if="loading">Учитавање...</template>
          <template v-else-if="monthState === 'error'">Није плаћено</template>
          <template v-else-if="monthState === 'success'">Плаћено</template>
          <template v-else-if="monthState === 'warning'"
            >Делимично плаћено</template
          >
        </UBadge>
      </div>

      <div class="py-2 text-sm text-[var(--ui-text-muted)] whitespace-nowrap">
        Укупни порез
      </div>
      <div class="py-2 text-sm text-[var(--ui-text-muted)] whitespace-nowrap">
        <UBadge variant="subtle" color="neutral"
          >{{ getTotal(item.osnovica) }} РСД</UBadge
        >
      </div>
    </div>

    <template #footer>
      <UButton variant="soft" :to="`/company/${companyName(item.firma)}`">
        Отвори
      </UButton>
    </template>
  </UCard>
</template>

<style scoped>
:deep(thead) {
  display: none;
}
</style>
