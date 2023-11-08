<script>
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import VTable from '../components/VTable.vue';
import VButton from '../components/VButton.vue';
import VButtonSet from '../components/VButtonSet.vue';
import VModal from '../components/VModal.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VColumn from '../components/VColumn.vue';
import { useNotifyStore } from '../stores/notifications';

export default {
  components: {
    VTable,
    VButton,
    VButtonSet,
    VModal,
    VTextInput,
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
        id: null,
        name: null,
        description: null,
      },
    };
  },
  validations() {
    return {
      formData: {
        name: {
          required: helpers.withMessage('Name field cannot be empty.', required),
        },
        description: {
          required: helpers.withMessage('Description field cannot be empty.', required),
        },
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
          `${this.backendUrl}/access_roles`,
        );

        this.tableData = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false;
    },
    clear_form() {
      Object.keys(this.formData).forEach(key => (this.formData[key] = ''));
    },
    showAddModal() {
      this.clear_form();
      this.isAddModalVissible = true;
    },
    showEditModal(data) {
      this.clear_form();
      Object.assign(this.formData, data);
      this.isEditModalVissible = true;
    },
    async addData() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;
        const isValid = await this.v$.$validate();

        if (isValid === false) {
          this.v$.formData.$errors.forEach((e) => {
            useNotifyStore().add('error', e.$message);
          });
          this.isBtnLoading = false;
          this.isLoading = false;
          return;
        }

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/access_roles`,
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

        if (isValid === false) {
          this.v$.formData.$errors.forEach((e) => {
            useNotifyStore().add('error', e.$message);
          });
          this.isBtnLoading = false;
          this.isLoading = false;
          return;
        }

        const response = await this.axios({
          method: 'put',
          url: `${this.backendUrl}/access_roles/${this.formData.id}`,
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
          url: `${this.backendUrl}/access_roles/${id}`,
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
      <VColumn header="Name" value="name" />
      <VColumn header="Description" value="description" />
      <VColumn header="Created Date" value="created_ts" />
      <VColumn header="Actions" value="actions">
        <template #body="{ row }">
          <VButtonSet>
            <VButton
              :icon="['fas', 'eye']" :link-to="{ name: 'SingleRole', params: { roleId: row.id } }"
              tooltip-text="View" tooltip-pos="Top"
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
        v-model:data="formData.name" name="name" placeholder="Name" tooltip-text="Name of the access role."
        tooltip-pos="left" :icon="['fas', 'fa-user-tag']"
      />
      <VTextInput
        v-model:data="formData.description" name="description" placeholder="Description"
        :icon="['fas', 'fa-user-tag']"
      />
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addData">
        Add
      </VButton>
    </VModal>
    <VModal v-model:isActive="isEditModalVissible">
      <VTextInput v-model:data="formData.name" name="name" placeholder="Name" :icon="['fas', 'fa-user-tag']" />
      <VTextInput
        v-model:data="formData.description" name="description" placeholder="Description"
        :icon="['fas', 'fa-user-tag']"
      />
      <VButton :icon="['fas', 'floppy-disk']" :is-loading="isBtnLoading" @on-click="updateData">
        Save
      </VButton>
    </VModal>
  </div>
</template>
