<script>
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required, requiredIf, sameAs } from '@vuelidate/validators';
import VTable from '../components/VTable.vue';
import VButton from '../components/VButton.vue';
import VButtonSet from '../components/VButtonSet.vue';
import VModal from '../components/VModal.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import VTag from '../components/VTag.vue';
import VColumn from '../components/VColumn.vue';
import { useNotifyStore } from '../stores/notifications';
import { useUserStore } from '../stores/user';

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
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      isLoading: true,
      isAddModalVissible: false,
      isEditModalVissible: false,
      isBtnLoading: false,
      backendUrl: import.meta.env.VITE_backendUrl,
      tableData: [],
      formData: {
        id: undefined,
        first_name: undefined,
        last_name: undefined,
        email: undefined,
        password: undefined,
        confirm_password: undefined,
        status: undefined,
        access_level: undefined,
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
          required: helpers.withMessage('Email field cannot be empty.', required),
          email: helpers.withMessage('Please, use valid email.', email),
        },
        password: {
          requiredIfid: helpers.withMessage('Password field cannot be empty.', requiredIf(!this.formData.id && this.isLocalAuth)),
        },
        confirm_password: {
          sameAsPassword: helpers.withMessage('Confirm Password must be equal to the Password value.', sameAs(this.formData.password)),
          requiredIfid: helpers.withMessage('Confirm Password field cannot be empty.', requiredIf(this.formData.password && this.isLocalAuth)),
        },
        status: {
          requiredIfid: helpers.withMessage('Status field cannot be empty.', requiredIf(this.formData.id)),
        },
        access_level: {
          required: helpers.withMessage('Access Level field cannot be empty.', required),
        },
      },
    };
  },
  computed: {
    isLocalAuth() {
      return useUserStore().authMethod === 'Local';
    },
  },
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/users`,
        });

        this.tableData = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false;
    },
    clearForm() {
      Object.keys(this.formData).forEach(key => (this.formData[key] = undefined));
    },
    showAddModal() {
      this.clearForm();
      this.formData.status = '';
      this.formData.access_level = '';
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
        const isValid = await this.v$.$validate();

        if (!isValid) {
          this.v$.formData.$errors.forEach((e) => {
            useNotifyStore().add('error', e.$message);
          });
          this.isLoading = false;
          this.isBtnLoading = false;
          return;
        }

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/users`,
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
        const isValid = await this.v$.$validate();

        if (!isValid) {
          this.v$.formData.$errors.forEach((e) => {
            useNotifyStore().add('error', e.$message);
          });
          this.isLoading = false;
          this.isBtnLoading = false;
          return;
        }

        const response = await this.axios({
          method: 'put',
          url: `${this.backendUrl}/users/${this.formData.id}`,
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
    async deleteData(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: 'delete',
          url: `${this.backendUrl}/users/${id}`,
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
    <VTable :table-data="tableData" :show-row-index="true" :is-loading="isLoading">
      <VColumn header="First Name" value="first_name" />
      <VColumn header="Last Name" value="last_name" />
      <VColumn header="Email" value="email" />
      <VColumn header="Access Level" value="access_level">
        <template #body="{ row }">
          <VTag :value="row.access_level" :type="row.access_level" />
        </template>
      </VColumn>
      <VColumn header="Status" value="status">
        <template #body="{ row }">
          <VTag v-if="row" :value="row.status" :type="row.status" />
        </template>
      </VColumn>
      <VColumn header="Actions" value="actions">
        <template #body="{ row }">
          <VButtonSet v-if="row">
            <VButton
              :icon="['fas', 'eye']" :link-to="{ name: 'SingleUser', params: { user_id: row.id } }"
              tooltip-text="View"
            />
            <VButton :icon="['fas', 'pen-to-square']" tooltip-text="Edit" @on-click="showEditModal(row)" />
            <VButton
              :icon="['fas', 'trash']" :is-loading="isBtnLoading" tooltip-text="Remove"
              @on-click="deleteData(row.id)"
            />
          </VButtonSet>
        </template>
      </VColumn>
    </VTable>
    <VButton :icon="['fas', 'plus']" @on-click="showAddModal">
      Add New
    </VButton>

    <VModal v-model:isActive="isAddModalVissible">
      <VTextInput
        v-model:data="formData.first_name" name="first_name" placeholder="First Name"
        :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput
        v-model:data="formData.last_name" name="last_name" placeholder="Last name"
        :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput v-model:data="formData.email" name="email" placeholder="Email" :icon="['fas', 'fa-at']" />
      <VTextInput v-if="isLocalAuth" v-model:data="formData.password" type="password" name="password" placeholder="******" :icon="['fas', 'fa-key']" />
      <VTextInput
        v-if="isLocalAuth"
        v-model:data="formData.confirm_password" type="password" name="confirm_password" placeholder="******"
        :icon="['fas', 'fa-key']"
      />
      <VDropdown
        v-model:data="formData.access_level" name="account_level" placeholder="Account Level"
        :icon="['fas', 'user-tag']" :options="['User', 'Admin']"
      />
      <VDropdown
        v-model:data="formData.status" name="status" placeholder="Status" :icon="['fas', 'flag']"
        :options="['active', 'inactive']"
      />
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addData">
        Add
      </VButton>
    </VModal>
    <VModal v-model:isActive="isEditModalVissible">
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
        v-if="isLocalAuth"
        v-model:data="formData.password" type="password" name="password" placeholder="******"
        :icon="['fas', 'fa-key']"
      />
      <VTextInput
        v-if="isLocalAuth"
        v-model:data="formData.confirm_password" type="password" name="confirm_password" placeholder="******"
        :icon="['fas', 'fa-key']"
      />
      <VDropdown
        v-model:data="formData.access_level" name="account_level" placeholder="Account Level"
        :icon="['fas', 'user-tag']" :options="['User', 'Admin']"
      />
      <VDropdown
        v-model:data="formData.status" name="status" placeholder="Status" :icon="['fas', 'flag']"
        :options="['active', 'inactive']"
      />
      <VButton :icon="['fas', 'floppy-disk']" :is-loading="isBtnLoading" @on-click="updateData">
        Save
      </VButton>
    </VModal>
  </div>
</template>
