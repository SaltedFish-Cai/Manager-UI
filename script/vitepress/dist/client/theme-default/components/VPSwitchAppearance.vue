<script lang="ts" setup>
import { inBrowser } from "vitepress";
import { inject, computed, nextTick } from "vue";
import { useData } from "../composables/data";
import VPSwitch from "./VPSwitch.vue";
import VPIconMoon from "./icons/VPIconMoon.vue";
import VPIconSun from "./icons/VPIconSun.vue";

const { isDark, theme, themeColor } = useData();

const enableTransitions = () =>
  "startViewTransition" in document && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

function updateMetaThemeColor() {
  if (inBrowser) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')!;
    metaThemeColor.setAttribute("content", isDark.value ? "#1b1b1f" : "#ffffff");
    const _window: any = typeof window == "undefined" ? global : window;
    _window.setManagerTheme(themeColor.value, isDark.value);
  }
}

const toggleAppearance = inject("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    updateMetaThemeColor();
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`
  ];

  // @ts-ignore
  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    updateMetaThemeColor();
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`
    }
  );
});

const switchTitle = computed(() => {
  const value = isDark.value ? theme.value.lightModeSwitchTitle || "切换至浅色" : theme.value.darkModeSwitchTitle || "切换至深色";
  return value;
});
</script>

<template>
  <VPSwitch :title="switchTitle" class="VPSwitchAppearance" :aria-checked="isDark" @click="toggleAppearance">
    <VPIconSun class="sun" />
    <VPIconMoon class="moon" />
  </VPSwitch>
</template>

<style scoped>
.sun {
  opacity: 1;
}

.moon {
  opacity: 0;
}

.dark .sun {
  opacity: 0;
}

.dark .moon {
  opacity: 1;
}

.dark .VPSwitchAppearance :deep(.check) {
  /*rtl:ignore*/
  transform: translateX(18px);
}
</style>
