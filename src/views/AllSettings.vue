<script>
import { useVuelidate } from '@vuelidate/core';
import { helpers, numeric, required, requiredIf, url } from '@vuelidate/validators';
import VButton from '../components/VButton.vue';
import VTab from '../components/VTab.vue';
import VTabView from '../components/VTabView.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import { useNotifyStore } from '../stores/notifications';

export default {
  components: {
    VButton,
    VTab,
    VTabView,
    VTextInput,
    VDropdown,
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
        type: undefined,
        admin_users: '',
        properties: {
          cas_server_url: undefined,
          cas_version: undefined,
          cas_verify_ssl: false,
          aad_tenant_id: undefined,
          aad_client_id: undefined,
          aad_client_secret: undefined,
          aad_scope: undefined,
        },
      },
      aad_scopes: [{
        id: 'OpenID Connect',
        value: 'https://graph.microsoft.com/.default',
      }],
    };
  },
  validations() {
    return {
      formData: {
        type: {
          required: helpers.withMessage('Type field cannot be empty.', required),
        },
        properties: {
          cas_server_url: {
            requiredIftype: helpers.withMessage('Server URL field cannot be empty.', requiredIf(this.formData.type === 'CAS')),
            url,
          },
          cas_version: {
            requiredIftype: helpers.withMessage('Version field cannot be empty.', requiredIf(this.formData.type === 'CAS')),
            numeric,
          },
          cas_verify_ssl: {
            required: helpers.withMessage('Verify SSL field cannot be empty.', requiredIf(this.formData.type === 'CAS')),
          },
          aad_tenant_id: {
            requiredIftype: helpers.withMessage('Tennant Name field cannot be empty.', requiredIf(this.formData.type === 'Azure AD')),
          },
          aad_client_id: {
            requiredIftype: helpers.withMessage('Client ID cannot be empty.', requiredIf(this.formData.type === 'Azure AD')),
          },
          aad_client_secret: {
            requiredIftype: helpers.withMessage('Client Secret field cannot be empty.', requiredIf(this.formData.type === 'Azure AD')),
          },
          aad_scope: {
            requiredIftype: helpers.withMessage('Scope field cannot be empty.', requiredIf(this.formData.type === 'Azure AD')),
          },
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
          url: `${this.backendUrl}/auth_method`,
        });

        Object.assign(this.formData, response.data.data);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false;
    },
    async sendData() {
      try {
        this.isBtnLoading = true;
        this.isLoading = false;
        const isValid = await this.v$.$validate();

        if (isValid === false) {
          this.v$.formData.$errors.forEach((e) => {
            useNotifyStore().add('error', e.$message);
          });
          this.isBtnLoading = false;
          this.isLoading = false;
          return;
        }

        if (this.formData.type !== 'Local' && !Array.isArray(this.formData.admin_users))
          this.formData.admin_users = this.formData.admin_users.split(',');

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/auth_method`,
          data: this.formData,
        });

        if (this.formData.type !== 'Local')
          this.formData.admin_users = this.formData.admin_users.join(',');

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        console.log(error);
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false;
      this.isBtnLoading = false;
    },
  },
};
</script>

<template>
  <VTabView>
    <template #Authentication>
      <VTab header="Authentication" :icon="['fas', 'fa-right-to-bracket']" :is-loading="isLoading">
        <div class="settings-holder">
          <VDropdown
            v-model:data="formData.type" name="type" placeholder="Authentication Type" :icon="['fas', 'flag']"
            :options="['Local', 'CAS', 'Azure AD']"
          />
          <template v-if="formData.type === 'CAS'">
            <VTextInput
              v-model:data="formData.properties.cas_server_url" type="text" name="cas_server_url" placeholder="Server URL"
              :icon="['fas', 'fa-user-tag']"
            />
            <VDropdown
              v-model:data="formData.properties.cas_version" name="cas_version" placeholder="Version" :icon="['fas', 'flag']"
              :options="[3, 2]"
            />
            <VDropdown
              v-model:data="formData.properties.cas_verify_ssl" name="cas_verify_ssl" placeholder="Verify SSL" :icon="['fas', 'flag']"
              :options="[true, false]"
            />
            <VTextInput
              v-model:data="formData.admin_users" type="text" name="cas_admin_users" placeholder="Admin users split by comma"
              :icon="['fas', 'fa-user-tag']"
            />
          </template>
          <template v-else-if="formData.type === 'Azure AD'">
            <VTextInput
              v-model:data="formData.properties.aad_tenant_id" type="text" name="aad_tenant_id" placeholder="Tennant ID"
              :icon="['fas', 'fa-user-tag']"
            />
            <VTextInput
              v-model:data="formData.properties.aad_client_id" type="text" name="aad_client_id" placeholder="Client ID"
              :icon="['fas', 'fa-user-tag']"
            />
            <VTextInput
              v-model:data="formData.properties.aad_client_secret" type="text" name="aad_client_secret" placeholder="Client Secret"
              :icon="['fas', 'fa-user-tag']"
            />
            <VTextInput
              v-model:data="formData.admin_users" type="text" name="aad_admin_users" placeholder="Admin users split by comma"
              :icon="['fas', 'fa-user-tag']"
            />
            <VDropdown
              v-model:data="formData.properties.aad_scope" name="aad_scope" placeholder="Scope" :icon="['fas', 'flag']" :options="aad_scopes" option-label="id" option-value="value" :is-multyselect="true"
            />
          </template>
          <VButton :icon="['fas', 'save']" :is-loading="isBtnLoading" @on-click="sendData">
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
