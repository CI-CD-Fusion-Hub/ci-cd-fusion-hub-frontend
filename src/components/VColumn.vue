<template>
  <td>
    <slot />
  </td>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      default: ''
    },
  },
}
</script>
