<template>
<td>
  <slot />
</td>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    header: String,
    value: String,
  },
})
</script>
