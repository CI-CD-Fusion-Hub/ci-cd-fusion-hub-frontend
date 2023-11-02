import { defineStore } from 'pinia';

export const useNotifyStore = defineStore('notifications', {
  state: () => {
    return {
      notifications: [],
    };
  },
  getters: {
    data: state => state.notifications,
  },
  actions: {
    add(status, message) {
      this.notifications.push({ status, message });
    },
  },
});
