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
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<template>
  <div :class="tab - holder">
    <div v-if="isLoading" class="loader">
      <font-awesome-icon :icon="['fas', 'spinner']" spin />
    </div>
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

.tabs .loader {
  border-radius: 0 var(--border-radius) var(--border-radius) var(--border-radius);
}
</style>
