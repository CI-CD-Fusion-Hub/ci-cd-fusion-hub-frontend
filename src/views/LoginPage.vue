<script>
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import VTextInput from '../components/Form/VTextInput.vue';
import VButton from '../components/VButton.vue';
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';

export default {
  components: {
    VTextInput,
    VButton,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      backendUrl: import.meta.env.VITE_backendUrl,
      isBtnLoading: false,
      userStore: useUserStore(),
      formData: {
        email: null,
        password: null,
      },
    };
  },
  validations() {
    return {
      formData: {
        email: {
          required: helpers.withMessage('Email field cannot be empty.', required),
          email: helpers.withMessage('Email field is not a valid email address.', email),
        },
        password: {
          required: helpers.withMessage('Password field cannot be empty.', required),
        },
      },
    };
  },
  // async created() {
  //   this.checkAuthMethod();
  // },
  methods: {
    async login() {
      try {
        this.isBtnLoading = true;
        const isValid = await this.v$.$validate();

        if (!isValid) {
          this.v$.formData.$errors.forEach((e) => {
            useNotifyStore().add('error', e.$message);
          });
          this.isBtnLoading = false;
          return;
        }

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/login`,
          data: this.formData,
        });

        if (response.data.status === 'error') {
          useNotifyStore().add(response.data.status, response.data.message);
          this.isBtnLoading = false;
          return;
        }

        this.userStore.loadData();
        this.$router.push({ path: '/pipelines' });
        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.data.message || 'Error loading data!');
      }

      this.isBtnLoading = false;
    },
    async checkAuthMethod() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/login/method`,
          data: this.formData,
        });

        if (!response.data.data)
          window.location.href = `${this.backendUrl}/login`;
      }
      catch (error) {
        console.log("Unable to get authentication method.")
      }
    },
  },
};
</script>

<template>
  <div class="login_holder">
    <div class="login_form">
      <div class="logo_holder"></div>
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
        :is-loading="isBtnLoading"
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
  background-image: url(background.png);
  height: 100vh;
  position: absolute;
  width: 100vw;
  background-size: cover;
}

.logo_holder {
  width: 100px;
  background-image: url(logo.png);
  background-size: contain;
  height: 83px;
  margin: 0 auto 10px auto;
}

.logo_holder img{
  width: 100px;
  margin-bottom: 10px;
}

.login_holder h1 {
  margin: 0;
  text-align: center;
  font-family: monospace;
  font-size: 30px;
}

.login_image {
  width: 70%;
  height: 100vh;
  background-color: #f3fffe;
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
  background-color: #0a2d5cde;
  color: white;
  width: 20%;
  min-height: 350px;
  padding: 0 30px;
}

.input-holder {
  border: solid 1px white;
  overflow: hidden;
  min-width: auto;
}

.login_form .btn-holder > button {
  border: solid 1px #f3fffe;
}
</style>
