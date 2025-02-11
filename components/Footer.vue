<script setup lang="ts">
const contactSubject = "Контакт са сајта";
const contactLink = `mailto:info@pausalno.rs?subject=${contactSubject}`;
</script>

<template>
  <footer class="py-10 text-center">
    <UButton variant="link" :href="contactLink"> info@pausalno.rs </UButton>
  </footer>
</template>
