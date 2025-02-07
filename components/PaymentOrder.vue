<script setup lang="ts">
import useQRCodeLink from "~/composable/useQRCodeLink";
import { FeeType } from "~/types/enums";

type Props = {
  type: FeeType;
  month: number;
};

const props = defineProps<Props>();

const { month, type } = toRefs(props);
const typeTitles = new Map([
  [FeeType.AKONTACIJA_POREZA, "Аконтација пореза"],
  [FeeType.ZDRAVSTVO, "Здравство"],
  [FeeType.PIO, "ПИО"],
  [FeeType.NEZAPOSLENOST, "Незапосленост"],
]);

const isolated = defineModel<FeeType>("isolated");
const state = defineModel<boolean>();

const link = useQRCodeLink(type, month);

const toggleIsolated = () => {
  isolated.value = isolated.value === type.value ? undefined : type.value;
};
</script>

<template>
  <UCard>
    <template #header>
      <p class="font-bold text-center uppercase text-sm">
        {{ typeTitles.get(type) }}
      </p>
    </template>
    <div v-if="link" :class="{ 'blur-xl': isolated && isolated !== type }">
      <QRCode
        :data="link"
        class="max-w-full"
        :class="{ 'grayscale-100 contrast-250': state }"
      />
    </div>
    <USkeleton v-else class="w-full aspect-square rounded-2xl" />

    <template #footer>
      <div class="flex flex-col items-start gap-2">
        <UTooltip text="Изолуј QR код ради лакшег скенирања">
          <UButton
            @click="toggleIsolated"
            :variant="isolated === type ? undefined : 'subtle'"
            :trailing-icon="
              isolated === type ? 'i-lucide-droplets' : 'i-lucide-droplet-off'
            "
            >Изолуј</UButton
          >
        </UTooltip>
        <div class="flex items-center gap-2">
          <USwitch v-model="state" />
          <p>Плаћено</p>
        </div>
      </div>
    </template>
  </UCard>
</template>
