<script>
import { useNotifyStore } from '../stores/notifications';
import VButton from './VButton.vue';

export default {
  components: {
    VButton,
  },
  data() {
    return {
      all_notifications: useNotifyStore().notifications,
      status_icon: {
        error: ['fas', 'xmark'],
        success: ['fas', 'check'],
      },
    };
  },
  methods: {
    remove_notification(index) {
      this.all_notifications.splice(index, 1);
    },
  },
};
</script>

<template>
  <div>
    <div
      v-if="all_notifications.length > 0"
      class="notifications"
    >
      <div
        v-for="(notification, index) in all_notifications"
        :key="index"
        :class="`notification ${notification.status}`"
      >
        <font-awesome-icon :icon="status_icon[notification.status]" />
        <div>
          {{ notification.message }}
        </div>
        <VButton
          :icon="['fas', 'xmark']"
          class="btn-notification"
          @on-click="remove_notification(index)"
        />
      </div>
    </div>
  </div>
</template>

<style>
/* Add styles for notifications */
.notifications {
  position: fixed;
  top: 15px;
  right: 23px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.notification {
  padding: 15px;
  border-radius: var(--border-radius);
  max-width: 300px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 15px;
  line-height: 17px;
  position: relative;
  font-family: monospace;
}

.notification .btn-notification {
  position: absolute;
  top: -14px;
  right: -10px;
  border-radius: 50%;
  font-size: 13px;
}

.notification button {
  border-radius: 50%;
  font-size: 13px;
  padding: 0px;
  width: 27px;
  height: 27px;
  gap: 0;
  display: block;
}

.notification > svg {
  font-size: 20px;
}

.notification.success {
  background-color: #4caf50;
  color: #fff;
}

.notification.error {
  background-color: #f44336;
  color: #fff;
}
</style>
