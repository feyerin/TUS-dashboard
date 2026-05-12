<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'

import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const linkUrl = ref('')

const editor = useEditor({
  content: props.modelValue || '<p></p>',
  extensions: [
    // ❌ disable list dari StarterKit biar tidak conflict
    StarterKit.configure({
      bulletList: false,
      orderedList: false,
      listItem: false
    }),

    // ✅ manual list extensions (FIX bullet & numbering)
    BulletList.configure({
      HTMLAttributes: {
        class: 'list-disc ml-5'
      }
    }),

    OrderedList.configure({
      HTMLAttributes: {
        class: 'list-decimal ml-5'
      }
    }),

    ListItem,

    Underline,

    Link.configure({
      openOnClick: false
    })
  ],

  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

// =====================
// SYNC v-model → editor
// =====================
watch(
  () => props.modelValue,
  (val) => {
    if (!editor.value) return

    const isSame = editor.value.getHTML() === val
    if (!isSame) {
      editor.value.commands.setContent(val || '<p></p>', {})
    }
  }
)

// =====================
// CLEANUP
// =====================
onBeforeUnmount(() => {
  editor.value?.destroy()
})

// =====================
// LINK
// =====================
const setLink = () => {
  if (!linkUrl.value) return

  editor.value
    ?.chain()
    .focus()
    .setLink({ href: linkUrl.value })
    .run()

  linkUrl.value = ''
}

// =====================
// CLEAR
// =====================
const clear = () => {
  editor.value?.chain().focus().clearContent().run()
}
</script>

<template>
  <div class="border rounded-lg overflow-hidden">

    <!-- TOOLBAR -->
    <div class="flex flex-wrap gap-2 p-2 border-b bg-gray-50">

      <!-- HEADING -->
      <a-select
        size="small"
        style="width: 120px"
        default-value="p"
        @change="(val) => {
          if (!editor) return
          if (val === 'p') editor.chain().focus().setParagraph().run()
          if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run()
          if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run()
          if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run()
        }"
      >
        <a-select-option value="p">Paragraph</a-select-option>
        <a-select-option value="h1">H1</a-select-option>
        <a-select-option value="h2">H2</a-select-option>
        <a-select-option value="h3">H3</a-select-option>
      </a-select>

      <!-- FORMAT -->
      <a-button
        size="small"
        :type="editor?.isActive('bold') ? 'primary' : 'default'"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        B
      </a-button>

      <a-button
        size="small"
        :type="editor?.isActive('italic') ? 'primary' : 'default'"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        I
      </a-button>

      <a-button
        size="small"
        :type="editor?.isActive('underline') ? 'primary' : 'default'"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        U
      </a-button>

      <!-- LIST -->
      <a-button
        size="small"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        • List
      </a-button>

      <a-button
        size="small"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        1. List
      </a-button>

      <!-- LINK -->
      <div class="flex gap-1">
        <a-input
          v-model:value="linkUrl"
          size="small"
          placeholder="https://"
          style="width: 140px"
        />
        <a-button size="small" @click="setLink">Add</a-button>
      </div>

      <a-button
        size="small"
        @click="editor?.chain().focus().unsetLink().run()"
      >
        Unlink
      </a-button>

      <a-button
        size="small"
        @click="clear"
      >
        Clear
      </a-button>

    </div>

    <!-- EDITOR -->
    <EditorContent
      :editor="editor"
      class="p-3 min-h-[200px] max-h-[300px] overflow-y-auto focus:outline-none"
    />

  </div>
</template>

<style scoped>
:deep(.ProseMirror:focus) {
  outline: none;
}
</style>