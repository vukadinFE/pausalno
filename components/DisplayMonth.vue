<script setup lang="ts">
import useLocalForage from "~/composable/useLocalForage";
import { SAVED_STATE_PATH } from "~/consts";
import { FeeType } from "~/types/enums";

type Props = {
  month: number;
};

const props = defineProps<Props>();

const { month } = toRefs(props);

const isolated = ref<FeeType>();

const state = reactive({
  [FeeType.AKONTACIJA_POREZA]: false,
  [FeeType.ZDRAVSTVO]: false,
  [FeeType.PIO]: false,
  [FeeType.NEZAPOSLENOST]: false,
});

const localForage = useLocalForage();

const getForgeState = async () => {
  const saved = await localForage.getItem<typeof state>(
    `${SAVED_STATE_PATH}/${month.value}`
  );
  if (!saved) return;

  if (saved[FeeType.AKONTACIJA_POREZA]) {
    state[FeeType.AKONTACIJA_POREZA] = saved[FeeType.AKONTACIJA_POREZA];
  }
  if (saved[FeeType.ZDRAVSTVO]) {
    state[FeeType.ZDRAVSTVO] = saved[FeeType.ZDRAVSTVO];
  }
  if (saved[FeeType.PIO]) {
    state[FeeType.PIO] = saved[FeeType.PIO];
  }
  if (saved[FeeType.NEZAPOSLENOST]) {
    state[FeeType.NEZAPOSLENOST] = saved[FeeType.NEZAPOSLENOST];
  }
};

const saveForgeState = async (s: typeof state) => {
  await localForage.setItem(`${SAVED_STATE_PATH}/${month.value}`, { ...s });
};

getForgeState();

watch(state, (state) => {
  saveForgeState(state);
});

const allPayed = computed(() =>
  Object.values(state).every((value) => value === true)
);
</script>

<template>
  <div class="grid grid-cols-4 p-3 gap-3">
    <PaymentOrder
      class="flex-[1_1_0]"
      :type="FeeType.AKONTACIJA_POREZA"
      :month="month"
      v-model:isolated="isolated"
      v-model="state[FeeType.AKONTACIJA_POREZA]"
    />
    <PaymentOrder
      class="flex-[1_1_0]"
      :type="FeeType.ZDRAVSTVO"
      :month="month"
      v-model:isolated="isolated"
      v-model="state[FeeType.ZDRAVSTVO]"
    />
    <PaymentOrder
      class="flex-[1_1_0]"
      :type="FeeType.PIO"
      :month="month"
      v-model:isolated="isolated"
      v-model="state[FeeType.PIO]"
    />
    <PaymentOrder
      class="flex-[1_1_0]"
      :type="FeeType.NEZAPOSLENOST"
      :month="month"
      v-model:isolated="isolated"
      v-model="state[FeeType.NEZAPOSLENOST]"
    />
  </div>
</template>
