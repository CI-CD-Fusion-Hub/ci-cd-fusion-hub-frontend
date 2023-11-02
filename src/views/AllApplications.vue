<script>
import VTable from '../components/VTable.vue';
import VButton from '../components/VButton.vue';
import VButtonSet from '../components/VButtonSet.vue';
import VModal from '../components/VModal.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import VTag from '../components/VTag.vue';
import VColumn from '../components/VColumn.vue';
import { useNotifyStore } from '../stores/notifications';

export default {
  components: {
    VTable,
    VButton,
    VButtonSet,
    VModal,
    VTextInput,
    VDropdown,
    VTag,
    VColumn,
  },
  data() {
    return {
      isLoading: true,
      isAddModalVissible: false,
      isEditModalVissible: false,
      isBtnLoading: false,
      isBtnVerifyLoading: false,
      backendUrl: import.meta.env.VITE_backendUrl,
      tableData: [],
      formData: {
        id: null,
        name: null,
        auth_user: null,
        auth_pass: null,
        base_url: null,
        type: null,
        status: null,
        regex_pattern: null,
      },
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/applications`,
        );

        this.tableData = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false;
    },
    clearForm() {
      Object.keys(this.formData).forEach(key => (this.formData[key] = ''));
    },
    showAddModal() {
      this.clearForm();
      this.isAddModalVissible = true;
    },
    showEditModal(data) {
      this.clearForm();
      Object.assign(this.formData, data);
      this.isEditModalVissible = true;
    },
    async addData() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/applications`,
          data: this.formData,
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isAddModalVissible = false;
      this.isBtnLoading = false;
      await this.loadData();
    },
    async updateData() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: 'put',
          url: `${this.backendUrl}/applications/${this.formData.id}`,
          data: this.formData,
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      await this.loadData();
      this.isEditModalVissible = false;
      this.isBtnLoading = false;
    },
    async verifyData() {
      try {
        this.isBtnVerifyLoading = true;

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/applications/verify`,
          data: this.formData,
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isBtnVerifyLoading = false;
    },
    async deleteData(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: 'delete',
          url: `${this.backendUrl}/applications/${id}`,
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      await this.loadData();
    },
  },
};
</script>

<template>
  <div>
    <VTable v-if="tableData" :table-data="tableData" :show-row-index="true" :is-loading="isLoading">
      <VColumn header="Name" value="name" />
      <VColumn header="Filter By (Regex)" value="regex_pattern" />
      <VColumn header="Auth User" value="auth_user" />
      <VColumn header="API Url" value="base_url" />
      <VColumn header="Type" value="type" />
      <VColumn header="Created Date" value="created_ts" />
      <VColumn header="Status" value="status">
        <template #body="{ row }">
          <VTag :value="row.status" :type="row.status" />
        </template>
      </VColumn>
      <VColumn header="Actions" value="actions">
        <template #body="{ row }">
          <VButtonSet>
            <VButton :icon="['fas', 'pen-to-square']" tooltip-text="Edit" @on-click="showEditModal(row)" />
            <VButton
              :icon="['fas', 'trash']" :is-loading="isBtnLoading" tooltip-text="Remove"
              @on-click="deleteData(row.id)"
            />
          </VButtonSet>
        </template>
      </VColumn>
    </VTable>
    <VButton :icon="['fas', 'plus']" class="flex-end" @on-click="showAddModal">
      Add New
    </VButton>

    <VModal v-model:isActive="isAddModalVissible">
      <VTextInput v-model:data="formData.name" name="name" placeholder="Name" :icon="['fas', 'fa-user-tag']" />
      <VDropdown
        v-model:data="formData.type" name="type" placeholder="Application" :icon="['fas', 'flag']"
        :options="['Jenkins', 'GitLab', 'GitHub', 'AzureDevOps']"
      />
      <VTextInput
        v-model:data="formData.regex_pattern" name="regex_pattern" placeholder="Filter By (Regex)"
        :icon="['fas', 'fa-filter']"
      />
      <VTextInput
        v-if="formData.type === 'Jenkins'" v-model:data="formData.auth_user" name="auth_user"
        placeholder="Authentication User" :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput
        v-model:data="formData.auth_pass" type="auth_pass" name="auth_pass" placeholder="Token/Password"
        :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput
        v-model:data="formData.base_url" name="base_url" type="url" placeholder="API Url"
        :icon="['fas', 'fa-user-tag']"
      />
      <VButtonSet class="flex-end">
        <VButton :icon="['fas', 'check']" :is-loading="isBtnVerifyLoading" @on-click="verifyData">
          Verify
        </VButton>
        <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addData">
          Add
        </VButton>
      </VButtonSet>
    </VModal>
    <VModal v-model:isActive="isEditModalVissible">
      <VTextInput v-model:data="formData.name" name="name" placeholder="Name" :icon="['fas', 'fa-user-tag']" />
      <VTextInput
        v-model:data="formData.regex_pattern" name="regex_pattern" placeholder="Filter By (Regex)"
        :icon="['fas', 'fa-filter']"
      />
      <VTextInput
        v-if="formData.type === 'jenkins'" v-model:data="formData.auth_user" name="auth_user"
        placeholder="Authentication User" :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput
        v-model:data="formData.auth_pass" type="auth_pass" name="auth_pass" placeholder="Token/Password"
        :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput v-model:data="formData.base_url" name="base_url" placeholder="API Url" :icon="['fas', 'fa-user-tag']" />
      <VDropdown
        v-model:data="formData.status" name="status" placeholder="Status" :icon="['fas', 'flag']"
        :options="['active', 'inactive']"
      />
      <VButtonSet class="flex-end">
        <VButton :icon="['fas', 'check']" :is-loading="isBtnVerifyLoading" @on-click="verifyData">
          Verify
        </VButton>
        <VButton :icon="['fas', 'save']" :is-loading="isBtnLoading" @on-click="updateData">
          Save
        </VButton>
      </VButtonSet>
    </VModal>
  </div>
</template>
