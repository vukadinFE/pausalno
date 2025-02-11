<script setup lang="ts">
import useQRCodeLink from "~/composable/useQRCodeLink";
import { FeeType } from "~/types/enums";

type Props = {
  type: FeeType;
  month: number;
  loading: boolean;
};

const props = defineProps<Props>();

const { month, type } = toRefs(props);
const typeTitles = new Map([
  [FeeType.AKONTACIJA_POREZA, "Порез"],
  [FeeType.ZDRAVSTVO, "Здравство"],
  [FeeType.PIO, "ПИО"],
  [FeeType.NEZAPOSLENOST, "Незапосленост"],
]);

const isolated = defineModel<FeeType>("isolated");
const state = defineModel<boolean>();

const route = useRoute();

const slug = computed(() => route.params.slug as string);

const link = useQRCodeLink(slug, type, month);

const toggleIsolated = () => {
  isolated.value = isolated.value === type.value ? undefined : type.value;
};

const isIsolated = computed(() => isolated.value === type.value);

const toggleState = () => {
  state.value = !state.value;
  if (isolated.value) {
    isolated.value = undefined;
  }
};
</script>

<template>
  <UCard>
    <template #header>
      <p class="font-bold truncate text-center uppercase text-sm">
        {{ typeTitles.get(type) }}
      </p>
    </template>
    <div class="flex items-center justify-center">
      <USkeleton
        v-if="loading"
        class="w-full aspect-square rounded-2xl max-w-[200px]"
      />
      <div
        v-else-if="state && !isIsolated"
        class="grid grid-cols-1 grid-rows-1 w-full max-w-[200px] aspect-square rounded-2xl items-center justify-center text-primary text-center"
      >
        <div
          class="col-start-1 col-end-2 row-start-1 row-end-2 self-center justify-center"
        >
          <UIcon name="i-lucide-scan" size="120" />
        </div>
        <div
          class="col-start-1 col-end-2 row-start-1 row-end-2 self-center justify-center"
        >
          <UIcon
            name="i-lucide-circle-check"
            size="64"
            class="col-start-1 col-end-2 row-start-1 row-end-2 self-center justify-center"
          />
        </div>
      </div>

      <div
        v-else-if="link"
        :class="{ 'blur-xl': isolated && isolated !== type }"
      >
        <QRCode :data="link" class="max-w-full" />
      </div>
      <USkeleton
        v-else
        class="w-full aspect-square rounded-2xl max-w-[200px]"
      />
    </div>

    <template #footer>
      <div class="flex items-start justify-center gap-2">
        <UTooltip text="Изолуј QR код ради лакшег скенирања">
          <UButton
            @click="toggleIsolated"
            variant="subtle"
            :color="isIsolated ? 'primary' : 'neutral'"
            :trailing-icon="isIsolated ? 'i-lucide-scan-line' : 'i-lucide-scan'"
          />
        </UTooltip>

        <UTooltip text="Обележи рачун као плаћен">
          <UButton
            @click="toggleState"
            variant="subtle"
            :color="state ? 'primary' : 'neutral'"
            icon="i-lucide-circle-check"
          />
        </UTooltip>
      </div>
    </template>
  </UCard>
</template>
