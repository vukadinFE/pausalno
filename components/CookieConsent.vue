<script setup lang="ts">
import VueCookieComply from "@ipaat/vue3-tailwind3-cookie-comply";

const cookieConsent = useScriptTriggerConsent();

const isAccepted = ref(true);
const onAccept = () => {
  cookieConsent.accept();
};

onMounted(() => {
  isAccepted.value = !!localStorage.getItem("cookie-comply");
});
</script>

<template>
  <ClientOnly>
    <VueCookieComply
      v-if="!isAccepted"
      @on-accept-all="onAccept"
      bannerTitle="Колачићи"
      bannerDescription="Ова страница користи колачиће како би вам пружила најбоље искуство. Наставком коришћења сајта, слажете се са коришћењем колачића."
      class="z-50"
    >
      <template v-slot:banner-actions="{ onAccept }">
        <UButton v-on:click="onAccept">Затвори</UButton>
      </template>
    </VueCookieComply>
  </ClientOnly>
</template>

<style>
aside {
  z-index: 9999;
}
</style>
