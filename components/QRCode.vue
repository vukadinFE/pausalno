<script lang="ts" setup>
import QRCodeStyling, { type Options } from "qr-code-styling";
import useThemeColor from "~/composable/useThemeColor";

type Props = {
  data: string;
};

const props = defineProps<Props>();

const data = toRef(props, "data");

const qrCodeRef = useTemplateRef("qr-code");

const { isDark } = useThemeColor();

const options = computed<Options>(() => ({
  width: 200,
  height: 200,
  type: "svg",
  data: data.value,
  image: isDark.value ? "/logo-white.svg" : "/logo.svg",
  imageOptions: {
    crossOrigin: "anonymous",
    hideBackgroundDots: true,
  },
  dotsOptions: {
    color: "oklch(0.723 0.219 149.579)",
    type: "rounded",
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "oklch(0.723 0.219 149.579)",
  },
  cornersDotOptions: {
    type: "dot",
    color: "oklch(0.723 0.219 149.579)",
  },
  backgroundOptions: {
    color: "transparent",
  },
}));

const qrCode = ref<QRCodeStyling>();

watch(options, (options) => {
  qrCode.value?.update(options);
});

onMounted(() => {
  const instance = new QRCodeStyling(options.value);
  qrCode.value = instance;
  if (qrCodeRef.value) {
    instance.append(qrCodeRef.value);
  }
});
</script>

<template>
  <div class="qr-code" ref="qr-code"></div>
</template>

<style>
.qr-code svg {
  max-width: 100%;
  height: auto;
}
</style>
