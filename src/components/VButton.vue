<script>
export default {
  props: {
    icon: {
      type: Array,
      default: () => [],
    },
    data: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    linkTo: {
      type: Object,
      default: () => ({}),
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isTooltipActive: {
      type: Boolean,
      default: null,
    },
    tooltipText: {
      type: String,
      default: null,
    },
    tooltipPos: {
      type: String,
      default: 'Top',
    },
  },
  emits: ['onClick'],
  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },
};
</script>

<template>
  <div :class="`btn-holder ${isActive ? 'active' : ''}`">
    <router-link
      v-if="Object.keys(linkTo).length > 0"
      :to="linkTo"
    >
      <button
        :tooltip-text="tooltipText"
        :tooltip-position="tooltipPos"
        @click="onClick"
      >
        <font-awesome-icon
          v-if="icon.length > 0 && !isLoading"
          :icon="icon"
        />
        <font-awesome-icon
          v-else-if="icon.length > 0 && isLoading"
          :icon="['fas', 'spinner']"
          spin
        />
        <span v-if="$slots.default"><slot /></span>
      </button>
    </router-link>
    <button
      v-else
      :tooltip-text="tooltipText"
      :tooltip-position="tooltipPos"
      @click="onClick"
    >
      <font-awesome-icon
        v-if="icon.length > 0 && !isLoading"
        :icon="icon"
      />
      <font-awesome-icon
        v-else-if="icon.length > 0 && isLoading"
        :icon="['fas', 'spinner']"
        spin
      />
      <span v-if="$slots.default"><slot /></span>
    </button>
  </div>
</template>

<style>
.btn-holder {
  display: flex;
  flex-flow: row-reverse;
}

.btn-holder button {
  background-color: var(--main-color);
  border: none;
  color: white;
  padding: 10px 10px 7px 10px;
  border-radius: var(--border-radius);
  cursor: pointer;
  display: flex;
  gap: 10px;
  align-items: center;
  transition: all 300ms ease-in-out;
  justify-content: center;
}
.btn-holder button:hover,
.btn-holder.active button {
  background-color: var(--main-color-hover);
}
</style>
