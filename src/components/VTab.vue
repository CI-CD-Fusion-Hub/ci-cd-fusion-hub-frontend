<template>
  <div :class="tab-holder">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      default: '',
      required: true
    },
    icons: {
      type: Array,
      default: () => []
    }
  }
};
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