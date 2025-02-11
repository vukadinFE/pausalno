<script setup lang="ts">
import type GenerateForm from "./GenerateForm.vue";

const open = defineModel<boolean>();

const genForm = useTemplateRef<InstanceType<typeof GenerateForm>>("form");
const submitting = ref(false);

const onSubmit = async () => {
  submitting.value = true;
  await genForm.value?.submit();
  submitting.value = false;
};
</script>

<template>
  <UModal
    v-model:open="open"
    title="Неопходни подаци"
    description="Попуни формулар и генериши IPS кодове за сваки месец."
    :close="{
      color: 'primary',
    }"
    :ui="{ footer: 'justify-end' }"
  >
    <slot />

    <template #body>
      <GenerateForm ref="form" hide-button />
    </template>
    <template #footer>
      <UButton variant="subtle" color="neutral" @click="open = false">
        Откажи
      </UButton>
      <UButton
        variant="subtle"
        color="primary"
        @click="onSubmit"
        trailing-icon="i-lucide-qr-code"
        :loading="submitting"
      >
        Генериши
      </UButton>
    </template>
  </UModal>
</template>
