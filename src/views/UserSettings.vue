<script>
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
  data() {
    return {
      isLoading: true,
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
  },
};
</script>

<template>
  <VTabView>
    <template #User>
      <VTab header="User" :icon="['fas', 'user-gear']">
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
          <VButton :icon="['fas', 'save']">
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
