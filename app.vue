<script setup lang="ts">
import useThemeColor from "~/composable/useThemeColor";

const { isDark } = useThemeColor();
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>

  <UButton
    class="fixed bottom-4 right-4 z-10"
    :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
    variant="subtle"
    @click="isDark = !isDark"
  />
</template>
