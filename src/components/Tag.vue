<template>
<span :class="`tag ` + type">{{ value }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    }
  },
});
</script>


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
.tag.running {
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
.tag.failure {
  background-color: #fc1521;
}
.tag.inactive,
.tag.canceled,
.tag.User,
.tag.pending,
.tag.skipped,
.tag.created {
  background-color: gray;
}
</style>