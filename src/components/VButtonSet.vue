<script>
export default {};
</script>

<template>
  <div class="btn-set-holder">
    <slot />
  </div>
</template>

<style>
.btn-set-holder {
  display: flex;
}

.btn-set-holder .btn-holder:first-child button {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.btn-set-holder .btn-holder:last-child button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.btn-set-holder .btn-holder:not(:last-child):not(:first-child) button {
  border-radius: 0;
}

.btn-set-holder .btn-holder:only-child button {
  border-radius: var(--border-radius);
}

.btn-set-holder .btn-holder:not(:last-child) button {
  position: relative;
}

.btn-set-holder.flex-end {
  justify-content: flex-end;
}
</style>
