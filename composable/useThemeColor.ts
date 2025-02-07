export default function useThemeColor() {
  const colorMode = useColorMode();
  const isDark = computed({
    get() {
      return colorMode.value === "dark";
    },
    set() {
      colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
    },
  });

  const color = computed(() => {
    if (isDark.value) return "dark";
    return "light";
  });

  return {
    color,
    isDark,
  };
}
