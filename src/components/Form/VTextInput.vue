<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    data: {
      type: String,
      default: '',
    },
    icon: {
      type: Array,
      default: () => ['fas', 'users'],
    },
    type: {
      type: String,
      default: 'text',
    },
    tooltipText: {
      type: String,
      default: null,
    },
    tooltipPos: {
      type: String,
      default: 'Left',
    },
  },
  emits: ['update:data'],
};
</script>

<template>
  <div
    class="input-holder"
    :tooltip-text="tooltipText"
    :tooltip-position="tooltipPos"
  >
    <input
      :id="name"
      :type="type"
      :name="name"
      placeholder=" "
      :value="data"
      @input="$emit('update:data', $event.target.value)"
    >
    <label :for="name">{{ placeholder }}</label>
    <font-awesome-icon
      v-if="icon"
      :icon="icon"
    />
  </div>
</template>

<style>
.input-holder {
  background-color: var(--main-color-hover);
  color: white;
  border-radius: 5px;
  position: relative;
  display: flex;
  border: solid 1px transparent;
  align-items: center;
  flex-flow: row-reverse;
  margin-bottom: 10px;
  min-width: 250px;
  justify-content: flex-end;
}

.input-holder svg {
  font-size: 13px;
}

.input-holder:last-child {
  margin-bottom: 0;
}

.input-holder label {
  position: absolute;
  left: 0;
  width: calc(100% - 33px);
  padding-left: 33px;
  z-index: 2;
}

.input-holder input {
  background-color: inherit;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  width: 100%;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.input-holder input,
.input-holder svg,
.input-holder label {
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: text;
}

.input-holder svg {
  padding-left: 10px;
}

.input-holder svg {
  width: 20px;
}

.input-holder label,
.input-holder svg {
  opacity: 0.6;
  transition: opacity 100ms ease-in-out;
}

.input-holder input:focus + label,
.input-holder input:not(:placeholder-shown) + label  {
  display: none;
}

.input-holder input:focus + label + svg,
.input-holder input:not(:placeholder-shown) + label + svg {
  opacity: 1;
}
</style>
