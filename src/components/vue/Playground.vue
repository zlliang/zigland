<script setup lang="ts">
import { ref, nextTick } from "vue"
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui"

import CodeEditor from "@/components/vue/CodeEditor.vue"

import client from "@/api/client"

const model = defineModel<string>()

const status = ref<"idle" | "running" | "error">("idle")
const output = ref("")
const outputEl = ref<HTMLElement | null>(null)

function clear() {
  output.value = ""
}

async function run() {
  clear()
  status.value = "running"

  const result = await client.run.mutate({ code: model.value || "" })
  
  for await (const chunk of result) {
    output.value += chunk
    
    await nextTick()
    outputEl.value?.scrollTo({ top: outputEl.value?.scrollHeight })
  }

  status.value = "idle"
}
</script>

<template>
  <SplitterGroup direction="vertical">
    <SplitterPanel :default-size="70" :min-size="20" class="flex flex-col">
      <div class="flex-1 overflow-auto border-b border-neutral-200 dark:border-neutral-700">
        <CodeEditor v-model="model" />
      </div>
      <div class="shrink-0 flex items-center gap-4 px-4 h-8 border-b bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <button
          v-if="status === 'idle'"
          class="flex items-center gap-1 text-amber-600 dark:text-amber-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          @click="run"
        >
          <span class="icon-[lucide--circle-play]" />
          <span>Run</span>
        </button>
        <button
          v-if="status === 'running'"
          class="flex items-center gap-1 text-neutral-500 dark:text-neutral-400"
        >
          <span class="icon-[svg-spinners--3-dots-scale]" />
          <span>Running</span>
        </button>
      </div>
    </SplitterPanel>
    <SplitterResizeHandle />
    <SplitterPanel :min-size="20" class="flex flex-col"> 
      <pre ref="outputEl" class="flex-1 overflow-auto px-4 py-2">{{ output }}</pre>
    </SplitterPanel>
  </SplitterGroup>
</template>
