<script>
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required, requiredIf, sameAs } from '@vuelidate/validators';
import VButton from '../components/VButton.vue';
import VTab from '../components/VTab.vue';
import VTabView from '../components/VTabView.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import { useNotifyStore } from '../stores/notifications';

export default {
  components: {
    VButton,
    VTab,
    VTabView,
    VTextInput,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      isLoading: true,
      isBtnLoading: false,
      backendUrl: import.meta.env.VITE_backendUrl,
      formData: {
        id: undefined,
        first_name: undefined,
        last_name: undefined,
        email: undefined,
        password: undefined,
        confirm_password: undefined,
      },
    };
  },
  validations() {
    return {
      formData: {
        first_name: {
          required: helpers.withMessage('First Name field cannot be empty.', required),
        },
        last_name: {
          required: helpers.withMessage('Last Name field cannot be empty.', required),
        },
        email: {
          email: helpers.withMessage('Please, use valid email.', email),
          required: helpers.withMessage('Email field cannot be empty.', required),
        },
        confirm_password: {
          sameAsPassword: helpers.withMessage('Confirm Password must be equal to the Password value.', sameAs(this.formData.password)),
          required: helpers.withMessage('Confirm Password field cannot be empty.', requiredIf(this.formData.password)),
        },
      },
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/user`,
        });

        this.formData = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false;
    },
    async updateData() {
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
          method: 'put',
          url: `${this.backendUrl}/user/profile`,
          data: this.formData,
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }
      this.isEditModalVissible = false;
      this.isBtnLoading = false;
    },
  },
};
</script>

<template>
  <VTabView>
    <template #User>
      <VTab header="User" :icon="['fas', 'user-gear']" :is-loading="isLoading">
        <div class="settings-holder">
          <VTextInput
            v-model:data="formData.first_name" type="text" name="first_name" placeholder="First Name"
            :icon="['fas', 'fa-user-tag']"
          />
          <VTextInput
            v-model:data="formData.last_name" type="text" name="last_name" placeholder="Last name"
            :icon="['fas', 'fa-user-tag']"
          />
          <VTextInput v-model:data="formData.email" type="text" name="email" placeholder="Email" :icon="['fas', 'fa-at']" />
          <VTextInput
            v-model:data="formData.password" type="password" name="password" placeholder="******"
            :icon="['fas', 'fa-key']"
          />
          <VTextInput
            v-model:data="formData.confirm_password" type="password" name="confirm_password" placeholder="******"
            :icon="['fas', 'fa-key']"
          />
          <VButton :icon="['fas', 'save']" :is-loading="isBtnLoading" @on-click="updateData">
            Save
          </VButton>
        </div>
      </VTab>
    </template>
  </VTabView>
</template>

<style>
.settings-holder {
  background-color: white;
  padding: 20px;
  border-radius: 0 var(--border-radius) var(--border-radius) var(--border-radius);
}
</style>
