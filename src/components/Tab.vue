<template>
  <div :class="tab-holder">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    header: {
      type: String,
      default: '',
      required: true
    },
    icons: {
      type: Array,
      default: []
    }
  }
});
</script>


<style>
.tabs {
  position: relative;
  min-height: 200px;
}

.tabs table {
  border-top-left-radius: 0;
}
.tab-holder {
  display: none;
}
.tab-holder.active {
  display: inherit;
}
</style>