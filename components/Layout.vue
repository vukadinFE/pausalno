<script setup lang="ts">
import type { HTMLAttributes } from "vue";

type Props = {
  wrapperClass?: HTMLAttributes["class"];
};

defineProps<Props>();
</script>

<template>
  <UApp>
    <Header />
    <div :class="wrapperClass">
      <slot />
    </div>
    <Footer />
  </UApp>
</template>
