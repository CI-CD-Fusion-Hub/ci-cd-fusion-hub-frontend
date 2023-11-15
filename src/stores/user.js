import { defineStore } from 'pinia';
import axios from '../config/axios';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      status: null,
      accessLevel: null,

    };
  },
  getters: {
    data: state => state,
  },
  actions: {
    async loadData() {
      try {
        const response = await axios({
          method: 'get',
          url: `${import.meta.env.VITE_backendUrl}/user`,
        });

        this.id = response.data.data.id;
        this.firstName = response.data.data.first_name;
        this.lastName = response.data.data.last_name;
        this.email = response.data.data.email;
        this.status = response.data.data.status;
        this.accessLevel = response.data.data.access_level;
        this.authMethod = response.data.data.auth_method;
      }
      catch (error) {

      }
    },
  },
});
