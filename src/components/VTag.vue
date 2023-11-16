<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    icon: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<template>
  <span :class="`tag ${type}`"><font-awesome-icon v-if="icon.length > 0" :icon="icon" />{{ value }}</span>
</template>

<style>
.tag {
  padding: 3px 10px;
  color: white;
  border-radius: var(--border-radius);
  font-size: 13px;
  display: inline-block;
  margin-bottom: 3px;
  margin-right: 3px;
}
.tag.running,
.tag.in-progress,
.tag.null,
.tag.starting {
  background-color: #eeeb30;
  animation: fade 1.5s infinite;
  opacity: 1;
  color: var(--main-color)
}
@keyframes fade {
  0%,100% { opacity: 0 }
  50% { opacity: 1 }
}

.tag.active,
.tag.success,
.tag.completed {
  background-color: #16ad67;
}
.tag.Admin {
  background-color: #0d54af;
}
.tag.error,
.tag.failed,
.tag.failure,
.tag.rejected,
.tag.startup_failure,
.tag.declined {
  background-color: #fc1521;
}
.tag.inactive,
.tag.canceled,
.tag.cancelled,
.tag.User,
.tag.pending,
.tag.skipped,
.tag.created,
.tag.aborted {
  background-color: gray;
}

.tag.cancelled,
.tag.canceled,
.tag.aborted {
  text-decoration: line-through;
}
</style>
