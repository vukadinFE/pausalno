<script setup lang="ts">
type Props = {
  name: string;
};
defineProps<Props>();
const open = defineModel<boolean>();

defineEmits(["delete"]);
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Обриши фирму: ${name}`"
    description="Да ли сте сигурни да желите да обришете фирму?"
    :close="{
      color: 'primary',
    }"
    :ui="{ footer: 'justify-end' }"
  >
    <slot />

    <template #footer>
      <UButton variant="subtle" color="neutral" @click="open = false">
        Откажи
      </UButton>
      <UButton variant="subtle" color="error" @click="$emit('delete')">
        Обриши
      </UButton>
    </template>
  </UModal>
</template>
