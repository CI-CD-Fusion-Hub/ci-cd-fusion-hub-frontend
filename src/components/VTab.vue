<script>
export default {
  props: {
    header: {
      type: String,
      default: '',
      required: true,
    },
    icons: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<template>
  <div :class="tab - holder">
    <slot />
  </div>
</template>

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
