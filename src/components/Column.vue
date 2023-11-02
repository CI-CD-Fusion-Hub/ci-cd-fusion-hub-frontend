<template>
<td>
  <slot  />
</td>
</template>

<script>
export default {
  props: {
    header: String,
    value: String,
  },
};
</script>
