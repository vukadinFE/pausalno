<script setup lang="ts">
import GenerateForm from "~/components/GenerateForm.vue";
</script>

<template>
  <div
    class="relative min-h-[100dvh] flex items-center justify-center overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('/landing-pattern-square.svg')] before:bg-no-repeat before:w-full before:h-full before:-z-[1] before:transform before:bg-bottom before:-translate-x-1/2 dark:before:bg-[url('/landing-pattern-square-dark.svg')]"
  >
    <UContainer>
      <div class="mt-5 text-center mx-auto">
        <h1
          class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl"
        >
          Олакшај себи плаћање <br />
          <span class="text-primary">паушалног пореза</span> 🚀
        </h1>
      </div>

      <p
        class="mt-6 text-lg tracking-tight text-center text-gray-600 dark:text-gray-300"
      >
        Плаћаш паушално порез?<br />
        Овде можеш генерисати IPS кодове за сваки месец у години.
      </p>

      <UModal
        title="Неопходни подаци"
        description="Попуни формулар и генериши IPS кодове за сваки месец."
        :close="{
          color: 'primary',
          class: 'cursor-pointer',
        }"
      >
        <div class="mt-8 gap-3 flex justify-center">
          <UButton
            size="xl"
            class="py-2.5 px-3.5 cursor-pointer"
            trailing-icon="i-lucide-qr-code"
          >
            Генериши
          </UButton>
        </div>

        <template #body>
          <GenerateForm />
        </template>
      </UModal>
    </UContainer>
  </div>
</template>
