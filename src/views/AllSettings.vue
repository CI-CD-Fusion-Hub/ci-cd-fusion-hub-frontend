<script>
import VButton from '../components/VButton.vue';
import VTab from '../components/VTab.vue';
import VTabView from '../components/VTabView.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import { useNotifyStore } from '../stores/notifications';
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, url, requiredIf, helpers } from '@vuelidate/validators'

export default {
  setup () {
    return { v$: useVuelidate() }
  },
  components: {
    VButton,
    VTab,
    VTabView,
    VTextInput,
    VDropdown,
  },
  data() {
    return {
      isLoading: true,
      backendUrl: import.meta.env.VITE_backendUrl,
      formData: {
        type: undefined,
        cas_service_url: undefined,
        cas_server_url: undefined,
        cas_version: undefined,
        cas_verify_ssl: undefined,
        adds_tennat_name: undefined,
        adds_client_id: undefined,
        adds_client_secret: undefined
      },
    };
  },
  validations () {
    return {
      formData: {
        type: { 
          required: helpers.withMessage('Type field cannot be empty.', required)
        },
        cas_service_url: {
          requiredIftype: helpers.withMessage('Service URL field cannot be empty.', requiredIf(this.formData.type == 'CAS')),
          url
        },
        cas_server_url: {
          requiredIftype: helpers.withMessage('Server URL field cannot be empty.', requiredIf(this.formData.type == 'CAS')),
          url
        },
        cas_version: {
          requiredIftype: helpers.withMessage('Version field cannot be empty.', requiredIf(this.formData.type == 'CAS')),
          numeric
        },
        cas_verify_ssl: {
          required: helpers.withMessage('Verify SSL field cannot be empty.', requiredIf(this.formData.type == 'CAS'))
        },
        adds_tennat_name: {
          requiredIftype: helpers.withMessage('Tennant Name field cannot be empty.', requiredIf(this.formData.type == 'ADDS'))
        },
        adds_client_id: {
          requiredIftype: helpers.withMessage('Client ID cannot be empty.', requiredIf(this.formData.type == 'ADDS'))
        },
        adds_client_secret: {
          requiredIftype: helpers.withMessage('Client Secret field cannot be empty.', requiredIf(this.formData.type == 'ADDS'))
        }
      }
    }
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
    <template #Authentication>
      <VTab header="Authentication" :icon="['fas', 'fa-right-to-bracket']">
        <div class="settings-holder">
          <VDropdown
            v-model:data="formData.type" name="type" placeholder="Authentication Type" :icon="['fas', 'flag']"
            :options="['Local', 'CAS', 'ADDS']"
          />
          <template v-if="formData.type === 'CAS'">
            <VTextInput
              v-model:data="formData.cas_service_url" type="text" name="cas_service_url" placeholder="Service URL"
              :icon="['fas', 'fa-user-tag']"
            />
            <VTextInput
              v-model:data="formData.cas_server_url" type="text" name="cas_server_url" placeholder="Server URL"
              :icon="['fas', 'fa-user-tag']"
            />
            <VDropdown
              v-model:data="formData.cas_version" name="cas_version" placeholder="Version" :icon="['fas', 'flag']"
              :options="['3', '2']"
            />
            <VDropdown
              v-model:data="formData.cas_verify_ssl" name="cas_verify_ssl" placeholder="Verify SSL" :icon="['fas', 'flag']"
              :options="['true', 'false']"
            />
          </template>
          <template v-else-if="formData.type === 'ADDS'">
            <VTextInput
              v-model:data="formData.adds_tennat_name" type="text" name="adds_tennat_name" placeholder="Tennant Name"
              :icon="['fas', 'fa-user-tag']"
            />
            <VTextInput
              v-model:data="formData.adds_client_id" type="text" name="adds_client_id" placeholder="Client ID"
              :icon="['fas', 'fa-user-tag']"
            />
            <VTextInput
              v-model:data="formData.adds_client_secret" type="text" name="adds_client_secret" placeholder="Client Secret"
              :icon="['fas', 'fa-user-tag']"
            />
          </template>
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
