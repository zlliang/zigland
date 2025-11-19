<script setup lang="ts">
import { ref, nextTick } from "vue"
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui"
import { useUrlSearchParams } from "@vueuse/core"
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string"

import CodeEditor from "@/components/vue/CodeEditor.vue"

import client from "@/api/client"

import snippet from "@/examples/async_io.zig?raw"

const model = defineModel<string>({ default: snippet })

const urlParams = useUrlSearchParams()

if (typeof urlParams.code === "string") {
  model.value = decompressFromEncodedURIComponent(urlParams.code)
}

const status = ref<"idle" | "running" | "error">("idle")
const copyLinkStatus = ref<"idle" | "copied">("idle")
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

async function copyLink() {
  const compressed = compressToEncodedURIComponent(model.value || "")
  urlParams.code = compressed

  await nextTick()
  await navigator.clipboard.writeText(location.href)

  copyLinkStatus.value = "copied"
  setTimeout(() => {
    copyLinkStatus.value = "idle"
  }, 2000)
}
</script>

<template>
  <SplitterGroup direction="vertical">
    <SplitterPanel :default-size="70" :min-size="20" class="flex flex-col">
      <div class="flex-1 overflow-auto border-b border-neutral-200 dark:border-neutral-800">
        <CodeEditor v-model="model" />
      </div>
      <div class="shrink-0 flex justify-end items-center gap-4 px-4 h-10 border-b bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
        <button
          v-if="copyLinkStatus === 'idle'"
          class="flex items-center gap-1 h-full text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
          @click="copyLink"
        >
          <span class="icon-[lucide--copy]" />
          <span>Share</span>
        </button>
        <button
          v-if="copyLinkStatus === 'copied'"
          class="flex items-center gap-1 h-full text-green-600 dark:text-green-400"
        >
          <span class="icon-[lucide--copy-check]" />
          <span>Link copied</span>
        </button>
        <button
          v-if="status === 'idle'"
          class="flex items-center gap-1 h-full text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
          @click="run"
        >
          <span class="icon-[lucide--play]" />
          <span>Run</span>
        </button>
        <button
          v-if="status === 'running'"
          class="flex items-center gap-1 h-full text-neutral-500"
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
