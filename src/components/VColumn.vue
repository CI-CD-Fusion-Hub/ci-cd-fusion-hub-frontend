<script>
export default {
  props: {
    header: {
      type: String,
      default: '',
    },
  },
};
</script>

<template>
  <td>
    <slot />
  </td>
</template>
