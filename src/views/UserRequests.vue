<script>
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import VTable from '../components/VTable.vue';
import VButton from '../components/VButton.vue';
import VButtonSet from '../components/VButtonSet.vue';
import VModal from '../components/VModal.vue';
import VDropdown from '../components/Form/VDropdown.vue';
import VTextInput from '../components/Form/VTextInput.vue';
import VTag from '../components/VTag.vue';
import VColumn from '../components/VColumn.vue';
import { useNotifyStore } from '../stores/notifications';

export default {
  components: {
    VTable,
    VButton,
    VButtonSet,
    VModal,
    VDropdown,
    VTextInput,
    VTag,
    VColumn,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      isLoading: true,
      isBtnLoading: false,
      isAddModalVissible: false,
      isEditModalVissible: false,
      backendUrl: import.meta.env.VITE_backendUrl,
      pipelines: [],
      formData: {
        id: undefined,
        pipelines: undefined,
        message: undefined,
      },
    };
  },
  validations() {
    return {
      formData: {
        pipelines: {
          required: helpers.withMessage('Pipelines field cannot be empty.', required),
        },
        message: {
          required: helpers.withMessage('Message field cannot be empty.', required),
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
        const response = await this.axios({
          method: 'get',
          url: `${this.backendUrl}/user/requests`,
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
    async showAddModal() {
      this.clearForm();
      await this.getUnassignedPipelines();
      this.isAddModalVissible = true;
    },
    showEditModal(data) {
      this.clearForm();
      this.getUnassignedPipelines();
      this.formData.id = data.id;
      this.formData.pipelines = data.pipelines.map(item => item.name);
      this.formData.message = data.message;
      this.isEditModalVissible = true;
    },
    async getUnassignedPipelines() {
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/user/unassigned_pipelines`,
        );

        this.pipelines = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }
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
          url: `${this.backendUrl}/user/requests`,
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
          url: `${this.backendUrl}/user/requests/${this.formData.id}`,
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
          url: `${this.backendUrl}/user/requests/${id}`,
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
      <VColumn header="Status" value="status">
        <template #body="{ row }">
          <VTag v-if="row" :value="row.status" :type="row.status" />
        </template>
      </VColumn>
      <VColumn header="Requested pipelines" value="requested_pipelines">
        <template #body="{ row }">
          <VTag v-for="pipeline in row.pipelines" :key="pipeline" :value="pipeline.name" type="pending" />
        </template>
      </VColumn>
      <VColumn header="Message" value="message" />
      <VColumn header="Actions" value="actions">
        <template #body="{ row }">
          <VButtonSet v-if="row.status === 'pending'">
            <VButton :icon="['fas', 'pen-to-square']" tooltip-text="Edit" @on-click="showEditModal(row)" />
            <VButton
              :icon="['fas', 'trash']" :is-loading="isBtnLoading" tooltip-text="Remove"
              @on-click="deleteData(row)"
            />
          </VButtonSet>
        </template>
      </VColumn>
    </VTable>
    <VButton :icon="['fas', 'plus']" class="flex-end" @on-click="showAddModal">
      Add New
    </VButton>

    <VModal v-model:isActive="isAddModalVissible">
      <VDropdown
        v-model:data="formData.pipelines" name="requested_pipelines" placeholder="Pipelines" :icon="['fas', 'sitemap']"
        :options="pipelines" :is-multyselect="true" option-label="name" option-value="id" :is-searchable="true"
      />
      <VTextInput
        v-model:data="formData.message" type="text" name="message" placeholder="Message"
        :icon="['fas', 'fa-file-pen']"
      />
      <VButton v-if="formData.pipelines?.length > 0" :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addData">
        Add
      </VButton>
    </VModal>
    <VModal v-model:isActive="isEditModalVissible">
      <VDropdown
        v-model:data="formData.status" name="status" placeholder="Status" :icon="['fas', 'flag']"
        :options="['pending', 'canceled']"
      />
      <VDropdown
        v-model:data="formData.pipelines" name="requested_pipelines" placeholder="Pipelines" :icon="['fas', 'sitemap']"
        :options="pipelines" :is-multyselect="true" option-label="name" option-value="id" :is-searchable="true"
      />
      <VTextInput
        v-model:data="formData.message" type="text" name="message" placeholder="Message"
        :icon="['fas', 'fa-file-pen']"
      />
      <VButton v-if="formData.pipelines?.length > 0" :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="updateData">
        Add
      </VButton>
    </VModal>
  </div>
</template>
