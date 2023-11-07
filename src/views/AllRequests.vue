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
import { useVuelidate } from '@vuelidate/core'
import { required, email, url, requiredIf, helpers } from '@vuelidate/validators'

export default {
  setup () {
    return { v$: useVuelidate() }
  },
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
        message: undefined,
        status: undefined,
      },
    };
  },
  validations () {
    return {
      formData: {
        id: { required },
        status: { 
          required: helpers.withMessage('Status field cannot be empty.', required)
        },
      }
    }
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
    async updateData() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;
        const isValid = await this.v$.$validate()

        if (isValid === false) {
          this.v$.formData.$errors.forEach((e) => {
            useNotifyStore().add('error', e.$message);
          })
          this.isBtnLoading = false;
          this.isLoading = false;
          return
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
      <VColumn header="User" value="email" />
      <VColumn header="Request Access" value="request_access" />
      <VColumn header="Message" value="message" />
      <VColumn header="Status" value="status">
        <template #body="{ row }">
          <VTag v-if="row" :value="row.status" :type="row.status" />
        </template>
      </VColumn>
      <VColumn header="Actions" value="actions">
        <template #body="{ row }">
          <VButtonSet v-if="row">
            <VButton :icon="['fas', 'pen-to-square']" tooltip-text="Edit" @on-click="showEditModal(row)" />
            <VButton
              :icon="['fas', 'trash']" :is-loading="isBtnLoading" tooltip-text="Remove"
              @on-click="deleteData(row)"
            />
          </VButtonSet>
        </template>
      </VColumn>
    </VTable>

    <VModal v-model:isActive="isEditModalVissible">
      <VDropdown
        v-model:data="formData.status" name="status" placeholder="Status" :icon="['fas', 'flag']"
        :options="['pending', 'rejected', 'inprogress', 'provided']"
      />
      <VTextInput
        v-model:data="formData.first_name" type="text" name="message" placeholder="Message"
        :icon="['fas', 'fa-file-pen']"
      />

      <VButton :icon="['fas', 'floppy-disk']" :is-loading="isBtnLoading" @on-click="updateData">
        Save
      </VButton>
    </VModal>
  </div>
</template>
