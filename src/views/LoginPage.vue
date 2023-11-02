<script>
import VTextInput from '../components/Form/VTextInput.vue';
import VButton from '../components/VButton.vue';
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';

export default {
  components: {
    VTextInput,
    VButton,
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      userStore: useUserStore(),
      formData: {
        email: null,
        password: null,
      },
    };
  },
  methods: {
    async login() {
      try {
        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/login`,
          data: this.formData,
        });

        if (response.data.status === 'error') {
          useNotifyStore().add(response.data.status, response.data.message);
          return;
        }

        this.userStore.loadData();
        this.$router.push({ path: '/pipelines' });
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.data.message || 'Error loading data!');
      }
    },
  },
};
</script>

<template>
  <div class="login_holder">
    <div class="login_form">
      <h1>Fusion Hub</h1>
      <p>Signin to your Account</p>
      <VTextInput
        v-model:data="formData.email"
        name="email"
        placeholder="Email"
        :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput
        v-model:data="formData.password"
        name="password"
        placeholder="Password"
        type="password"
        :icon="['fas', 'key']"
      />
      <VButton
        :icon="['fas', 'fa-right-to-bracket']"
        @on-click="login()"
      >
        Login
      </VButton>
    </div>
  </div>
</template>

<style>
.login_holder {
    display: flex;
    background-image: url('./src/assets/img/background.jpg');
    height: 100vh;
    position: absolute;
    width: 100vw;
    left: 0;
    top: 0;
}

.login_holder h1 {
  margin: 0;
}

.login_image {
  width: 70%;
  height: 100vh;
  background-color: #fcfaf6;
  display: flex;
  justify-items: center;
  align-items: center;
  justify-content: center;
}
.login_form {
  display: flex;
  align-items: stretch;
  flex-flow: column;
  justify-content: center;
  background-color: #3870ba91;
  color: white;
  width: 20%;
  height: 100vh;
  padding: 0 20px;
}
</style>