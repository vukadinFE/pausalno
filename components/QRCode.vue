<script lang="ts" setup>
import QRCodeStyling, { type Options } from "qr-code-styling";
import useThemeColor from "~/composable/useThemeColor";

type Props = {
  data: string;
  logoUrl?: string;
  color?: string;
};

const props = defineProps<Props>();

const data = toRef(props, "data");
const logoUrl = toRef(props, "logoUrl");
const color = toRef(props, "color");

const qrCodeRef = useTemplateRef("qr-code");

const { isDark } = useThemeColor();

const codeColor = computed(
  () => color.value || (isDark.value ? "#d1d5dc" : "#1e2939")
);

const options = computed<Options>(() => ({
  width: 200,
  height: 200,
  type: "svg",
  data: data.value,
  image: logoUrl.value || (isDark.value ? "/logo-white.svg" : "/logo.svg"),
  imageOptions: {
    crossOrigin: "anonymous",
    hideBackgroundDots: true,
    margin: 2,
  },
  dotsOptions: {
    color: codeColor.value,
    type: "rounded",
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: codeColor.value,
  },
  cornersDotOptions: {
    type: "dot",
    color: codeColor.value,
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
  <div class="qr-code text-gr" ref="qr-code"></div>
</template>

<style>
.qr-code svg {
  max-width: 100%;
  height: auto;
}
</style>
