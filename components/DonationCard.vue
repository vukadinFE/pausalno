<script setup lang="ts">
import type { Donation } from "~/pages/donations.vue";

const props = defineProps<Donation>();
const amount = ref(200);

type Emits = {
  (event: "showCode", payload: Donation & { amount: number }): void;
};
defineEmits<Emits>();
</script>

<template>
  <UCard class="dark:ring-gray-800 dark:bg-gray-900 text-center">
    <div
      class="min-h-[200px] flex items-center justify-center rounded-lg bg-white"
      :class="logoClass"
    >
      <img :src="logo" class="max-w-full max-h-full block rounded-lg" />
    </div>
    <div class="flex gap-2 flex-wrap my-5 justify-center">
      <UButton
        @click="amount = 200"
        :variant="amount === 200 ? 'solid' : 'subtle'"
        size="sm"
        >200 RSD</UButton
      >
      <UButton
        @click="amount = 500"
        :variant="amount === 500 ? 'solid' : 'subtle'"
        size="sm"
        >500 RSD</UButton
      >
      <UButton
        @click="amount = 1000"
        :variant="amount === 1000 ? 'solid' : 'subtle'"
        size="sm"
        >1000 RSD</UButton
      >
      <UButton
        @click="amount = 2000"
        :variant="amount === 2000 ? 'solid' : 'subtle'"
        size="sm"
        >2000 RSD</UButton
      >
      <UButton
        @click="amount = 5000"
        :variant="amount === 5000 ? 'solid' : 'subtle'"
        size="sm"
        >5000 RSD</UButton
      >
    </div>
    <UInputNumber
      v-model="amount"
      :format-options="{
        style: 'currency',
        currency: 'RSD',
        currencyDisplay: 'code',
        currencySign: 'accounting',
      }"
    />
    <template #footer>
      <UButton @click="$emit('showCode', { ...props, amount })">
        Прикажи QR код
      </UButton>
    </template>
  </UCard>
</template>
