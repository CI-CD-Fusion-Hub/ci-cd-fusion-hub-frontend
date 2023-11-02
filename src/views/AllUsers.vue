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
    <VTable
      :table-data="tableData"
      :show-row-index="true"
      :is-loading="isLoading"
    >
      <VColumn
        header="First Name"
        value="first_name"
      />
      <VColumn
        header="Last Name"
        value="last_name"
      />
      <VColumn
        header="Email"
        value="email"
      />
      <template #access_level="item">
        <VColumn
          header="Access Level"
          value="access_level"
        >
          <VTag
            :value="item.item.access_level"
            :type="item.item.access_level"
          />
        </VColumn>
      </template>
      <template #status="item">
        <VColumn
          header="Status"
          value="status"
        >
          <VTag
            v-if="item.item"
            :value="item.item.status"
            :type="item.item.status"
          />
        </VColumn>
      </template>
      <template #actions="item">
        <VColumn
          header="Actions"
          value="actions"
        >
          <VButtonSet v-if="item.item">
            <VButton
              :icon="['fas', 'eye']"
              :link-to="{ name: 'SingleUser', params: { user_id: item.item.id } }"
              tooltip-text="View"
            />
            <VButton
              :icon="['fas', 'pen-to-square']"
              tooltip-text="Edit"
              @on-click="showEditModal(item.item)"
            />
            <VButton
              :icon="['fas', 'trash']"
              :is-loading="isBtnLoading"
              tooltip-text="Remove"
              @on-click="requiredConfirmation(() => deleteData(item.item))"
            />
          </VButtonSet>
        </VColumn>
      </template>
    </VTable>
    <VButton
      :icon="['fas', 'plus']"
      @on-click="showAddModal"
    >
      Add New
    </VButton>

    <VModal v-model:isActive="isAddModalVissible">
      <VTextInput
        v-model:data="formData.first_name"
        name="first_name"
        placeholder="Fi  rst Name"
        :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput
        v-model:data="formData.last_name"
        name="last_name"
        placeholder="Last name"
        :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput
        v-model:data="formData.email"
        name="email"
        placeholder="Email"
        :icon="['fas', 'fa-at']"
      />
      <VTextInput
        v-model:data="formData.password"
        name="password"
        placeholder="******"
        :icon="['fas', 'fa-key']"
      />
      <VTextInput
        v-model:data="formData.confirm_password"
        name="confirm_password"
        placeholder="******"
        :icon="['fas', 'fa-key']"
      />
      <VDropdown
        v-model:data="formData.access_level"
        name="account_level"
        placeholder="Account Level"
        :icon="['fas', 'user-tag']"
        :options="['User', 'Admin']"
      />
      <VButton
        :icon="['fas', 'plus']"
        :is-loading="isBtnLoading"
        @on-click="addData"
      >
        Add
      </VButton>
    </VModal>
    <VModal v-model:isActive="isEditModalVissible">
      <VTextInput
        v-model:data="formData.first_name"
        type="text"
        name="first_name"
        placeholder="First Name"
        :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput
        v-model:data="formData.last_name"
        type="text"
        name="last_name"
        placeholder="Last name"
        :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput
        v-model:data="formData.email"
        type="text"
        name="email"
        placeholder="Email"
        :icon="['fas', 'fa-at']"
      />
      <VTextInput
        v-model:data="formData.password"
        type="password"
        name="password"
        placeholder="******"
        :icon="['fas', 'fa-key']"
      />
      <VTextInput
        v-model:data="formData.confirm_password"
        type="password"
        name="confirm_password"
        placeholder="******"
        :icon="['fas', 'fa-key']"
      />
      <VDropdown
        v-model:data="formData.access_level"
        name="account_level"
        placeholder="Account Level"
        :icon="['fas', 'user-tag']"
        :options="['User', 'Admin']"
      />
      <VDropdown
        v-model:data="formData.status"
        name="status"
        placeholder="Status"
        :icon="['fas', 'flag']"
        :options="['active', 'inactive']"
      />
      <VButton
        :icon="['fas', 'floppy-disk']"
        :is-loading="isBtnLoading"
        @on-click="updateData"
      >
        Save
      </VButton>
    </VModal>
  </div>
</template>