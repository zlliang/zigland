<script setup lang="ts">
import { computed } from "vue"
import { usePreferredDark } from "@vueuse/core"
import { Codemirror } from "vue-codemirror"
import { oneDark } from "@codemirror/theme-one-dark"
import { zig } from "codemirror-lang-zig"

const model = defineModel<string>()

const isDark = usePreferredDark()
const extensions = computed(() => isDark.value ? [oneDark, zig()] : [zig()])
</script>

<template>
  <div class="h-full text-sm">
    <Codemirror
      v-model="model"
      placeholder="Code goes here..."
      :extensions="extensions"
      :tab-size="2"
      style="height: 100%;" />
  </div>
</template>

<style>
.cm-scroller {
  font-family: var(--font-mono) !important;
}

.cm-focused {
  outline: none !important;
}
</style>
