<script>
import VTabView from '../../components/VTabView.vue';
import VTab from '../../components/VTab.vue';
import VTable from '../../components/VTable.vue';
import VButton from '../../components/VButton.vue';
import VButtonSet from '../../components/VButtonSet.vue';
import VModal from '../../components/VModal.vue';
import VDropdown from '../../components/Form/VDropdown.vue';
import VColumn from '../../components/VColumn.vue';
import { useNotifyStore } from '../../stores/notifications';

export default {
  components: {
    VTab,
    VTabView,
    VTable,
    VButton,
    VModal,
    VDropdown,
    VButtonSet,
    VColumn,
  },
  data() {
    return {
      isLoading: true,
      isBtnLoading: false,
      isAddModalPipelineVissible: false,
      isAddModalUserVissible: false,
      backendUrl: import.meta.env.VITE_backendUrl,
      role: {},
      formData: {
        formPipelineData: undefined,
        formUserData: undefined,
      },
      pipelines: [],
      users: [],
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    clearForm() {
      Object.keys(this.formData).forEach(key => (this.formData[key] = undefined));
    },
    async loadData() {
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/access_roles/${this.$route.params.roleId}`,
        );

        this.role = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false;
    },
    async showAddPipelineModal() {
      this.clearForm();
      await this.getUnassignedPipelines();
      this.isAddModalPipelineVissible = true;
    },
    async getUnassignedPipelines() {
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/access_roles/${this.$route.params.roleId}/unassigned_pipelines`,
        );

        this.pipelines = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }
    },
    async addDataPipeline() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/access_roles/${this.$route.params.roleId}/pipelines`,
          data: this.formData.formPipelineData,
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isAddModalPipelineVissible = false;
      this.isBtnLoading = false;
      await this.loadData();
    },
    async deleteDataPipeline(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: 'delete',
          url: `${this.backendUrl}/access_roles/${this.$route.params.roleId}/pipelines/${id}`,
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      await this.loadData();
    },
    async showAddUserModal() {
      this.clearForm();
      await this.getUnassignedUsers();
      this.isAddModalUserVissible = true;
    },
    async getUnassignedUsers() {
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/access_roles/${this.$route.params.roleId}/unassigned_users`,
        );

        this.users = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }
    },
    async addDataUser() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/access_roles/${this.$route.params.roleId}/users`,
          data: this.formData.formUserData,
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isAddModalUserVissible = false;
      this.isBtnLoading = false;
      await this.loadData();
    },
    async deleteDataUser(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: 'delete',
          url: `${this.backendUrl}/access_roles/${this.$route.params.roleId}/users/${id}`,
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
    <VTabView>
      <template #Pipelines>
        <VTab header="Pipelines" :icon="['fas', 'sitemap']" :is-loading="isLoading">
          <VTable
            :table-data="role.pipelines" :show-row-index="true" :pagination="true"
            :page_size="20" :is-loading="false"
          >
            <VColumn header="Name" value="name" />
            <VColumn header="Created Date" value="created_ts" />
            <VColumn header="Application" value="application_id">
              <template #body="{ row }">
                {{ row.application.name }}
              </template>
            </VColumn>
            <VColumn header="Actions" value="actions">
              <template #body="{ row }">
                <VButtonSet>
                  <VButton
                    :icon="['fas', 'eye']" :link-to="{ name: 'SinglePipeline', params: { application: row.application.type, pipeline_id: row.id } }"
                    tooltip-text="View" tooltip-pos="Top"
                  />
                  <VButton
                    :icon="['fas', 'trash']" :is-loading="isBtnLoading" tooltip-text="Remove"
                    @on-click="deleteDataPipeline(row.id)"
                  />
                </VButtonSet>
              </template>
            </VColumn>
          </VTable>
          <VButton :icon="['fas', 'plus']" @on-click="showAddPipelineModal">
            Add New
          </VButton>
        </VTab>
      </template>
      <template #Members>
        <VTab header="Members" :icon="['fas', 'users']" :is-loading="isLoading">
          <VTable
            :table-data="role.members" :show-row-index="true" :pagination="true"
            :page_size="20" :is-loading="false"
          >
            <VColumn header="First Name" value="first_name" />
            <VColumn header="Last Name" value="last_name" />
            <VColumn header="Email" value="email" />
            <VColumn header="Actions" value="actions">
              <template #body="{ row }">
                <VButtonSet>
                  <VButton
                    :icon="['fas', 'eye']" :link-to="{ name: 'SingleUser', params: { user_id: row.id } }"
                    tooltip-text="View"
                  />
                  <VButton
                    :icon="['fas', 'trash']" :is-loading="isBtnLoading" tooltip-text="Remove"
                    @on-click="deleteDataUser(row.id)"
                  />
                </VButtonSet>
              </template>
            </VColumn>
          </VTable>
          <VButton :icon="['fas', 'plus']" @on-click="showAddUserModal">
            Add New
          </VButton>
        </VTab>
      </template>
    </VTabView>

    <VModal v-model:isActive="isAddModalPipelineVissible">
      <VDropdown
        v-model:data="formData.formPipelineData" name="pipeline_id" placeholder="Pipelines" :icon="['fas', 'sitemap']"
        :options="pipelines" :is-multyselect="true" option-label="name" option-value="id" :is-searchable="true"
      />
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addDataPipeline">
        Add
      </VButton>
    </VModal>
    <VModal v-model:isActive="isAddModalUserVissible">
      <VDropdown
        v-model:data="formData.formUserData" name="user_id" placeholder="Users" :icon="['fas', 'sitemap']"
        :options="users" :is-multyselect="true" option-label="email" option-value="id" :is-searchable="true"
      />
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addDataUser">
        Add
      </VButton>
    </VModal>

    <VNotification />
  </div>
</template>
