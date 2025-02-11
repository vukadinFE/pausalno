<script setup lang="ts">
import useLocalForage from "~/composable/useLocalForage";
import type { TState } from "~/types/data";
import { FeeType } from "~/types/enums";

type Props = {
  month: number;
};

const props = defineProps<Props>();

const emit = defineEmits(["updated"]);

const { month } = toRefs(props);

const isolated = ref<FeeType>();

const state = reactive<TState>({
  [FeeType.AKONTACIJA_POREZA]: false,
  [FeeType.ZDRAVSTVO]: false,
  [FeeType.PIO]: false,
  [FeeType.NEZAPOSLENOST]: false,
});

const localForage = useLocalForage();

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const storageKey = computed(() => stateStorage(slug.value, month.value));

const loading = ref(false);

const getForgeState = async (storageKey: string) => {
  loading.value = true;
  const saved = await localForage.getItem<TState>(storageKey);
  state[FeeType.AKONTACIJA_POREZA] =
    saved?.[FeeType.AKONTACIJA_POREZA] ?? false;
  state[FeeType.ZDRAVSTVO] = saved?.[FeeType.ZDRAVSTVO] ?? false;
  state[FeeType.PIO] = saved?.[FeeType.PIO] ?? false;
  state[FeeType.NEZAPOSLENOST] = saved?.[FeeType.NEZAPOSLENOST] ?? false;
  loading.value = false;
};

getForgeState(storageKey.value);

watch(storageKey, (storageKey) => {
  getForgeState(storageKey);
});

const saveForgeState = async (s: TState) => {
  await localForage.setItem(storageKey.value, { ...s });
  emit("updated");
};

watch(state, (state) => {
  saveForgeState(state);
});
</script>

<template>
  <div class="items gap-3">
    <PaymentOrder
      :type="FeeType.AKONTACIJA_POREZA"
      :month="month"
      v-model:isolated="isolated"
      v-model="state[FeeType.AKONTACIJA_POREZA]"
      :loading="loading"
    />
    <PaymentOrder
      :type="FeeType.ZDRAVSTVO"
      :month="month"
      v-model:isolated="isolated"
      v-model="state[FeeType.ZDRAVSTVO]"
      :loading="loading"
    />
    <PaymentOrder
      :type="FeeType.PIO"
      :month="month"
      v-model:isolated="isolated"
      v-model="state[FeeType.PIO]"
      :loading="loading"
    />
    <PaymentOrder
      :type="FeeType.NEZAPOSLENOST"
      :month="month"
      v-model:isolated="isolated"
      v-model="state[FeeType.NEZAPOSLENOST]"
      :loading="loading"
    />
  </div>
</template>

<style scoped>
.items {
  @apply grid self-start;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
</style>
