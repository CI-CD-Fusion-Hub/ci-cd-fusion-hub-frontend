<script>
import VTable from '../components/VTable.vue';
import VButton from '../components/VButton.vue';
import VButtonSet from '../components/VButtonSet.vue';
import VModal from '../components/VModal.vue';
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
    VDropdown,
    VTag,
    VColumn,
  },
  data() {
    return {
      isLoading: true,
      isBtnLoading: false,
      isAddModalVissible: false,
      isEditModalVissible: false,
      pipelines: [{
        id: 23,
        name: "ansible-users"
      },
      {
        id: 24,
        name: "af-access-manager"
      }],
      formData: {
        id: undefined,
        pipelines: undefined,
      },
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        // const response = await this.axios({
        //   method: 'get',
        //   url: `${this.backendUrl}/user/requests`,
        // });

        // this.tableData = response.data.data;
        this.tableData = [{
          status: 'success',
          message: '',
          requested_pipelines: [{
            id: 23,
            name: 'ansible-users',
          }, {
            id: 24,
            name: 'af-access-manager',
          }, {
            id: 25,
            name: 'sample-app',
          }],
        }, {
          status: 'pending',
          message: '',
          requested_pipelines: [{
            id: 23,
            name: 'fusion-hub',
          }],
        },
        {
          status: 'in-progress',
          message: '',
          requested_pipelines: [{
            id: 23,
            name: 'fusion-hub',
          }],
        }, {
          status: 'rejected',
          message: 'You are not allowed to have access to \'af-access-manager\'. Please, update your request and send it again.',
          requested_pipelines: [{
            id: 23,
            name: 'cuartz-frontend',
          }, {
            id: 24,
            name: 'cuartz-backend',
          }],
        }];
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
      this.formData.id = data.id;
      this.formData.requested_pipelines = data.requested_pipelines;
      this.isEditModalVissible = true;
    },
    async addData() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/users/requests`,
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
          url: `${this.backendUrl}/users/requests/${this.formData.id}`,
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
      <VColumn header="Status" value="status">
        <template #body="{ row }">
          <VTag v-if="row" :value="row.status" :type="row.status" />
        </template>
      </VColumn>
      <VColumn header="Requested pipelines" value="requested_pipelines">
        <template #body="{ row }">
          <VTag v-for="pipeline in row.requested_pipelines" :key="pipeline" :value="pipeline.name" type="pending" />
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
      <VButton v-if="formData.pipelines?.length > 0" :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addData">
        Add
      </VButton>
    </VModal>
    <VModal v-model:isActive="isEditModalVissible">
      <VDropdown
        v-model:data="formData.pipelines" name="requested_pipelines" placeholder="Pipelines" :icon="['fas', 'sitemap']"
        :options="pipelines" :is-multyselect="true" option-label="name" option-value="id" :is-searchable="true"
      />
      <VButton v-if="formData.pipelines?.length > 0" :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="updateData">
        Add
      </VButton>
    </VModal>
  </div>
</template>
