<script>
export default {
  props: {
    header: {
      type: String,
    },
    value: { type: String },
    row: {
      required: false,
      type: Object,
    },
  },
};
</script>

<template>
  <div>
    <slot />
    <slot name="body" :row="row" />
  </div>
</template>
