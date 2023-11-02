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
      isAddModalRoleVissible: false,
      backendUrl: import.meta.env.VITE_backendUrl,
      user: {},
      formData: [],
      pipelines: [],
      roles: [],
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/users/${this.$route.params.user_id}`,
        );

        this.user = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false;
    },
    async showAddRoleModal() {
      await this.getUnassignedRoles();
      this.isAddModalRoleVissible = true;
    },
    async getUnassignedRoles() {
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/users/${this.$route.params.user_id}/unassigned_roles`,
        );

        this.roles = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }
    },
    async addDataRole() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/access_roles/${this.formData[0]}/users`,
          data: [this.$route.params.user_id],
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isAddModalRoleVissible = false;
      this.isBtnLoading = false;
      await this.loadData();
    },
    async deleteDataRoles(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: 'delete',
          url: `${this.backendUrl}/access_roles/${id}/users/${this.$route.params.user_id}`,
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
        <VTab header="Pipelines" :icon="['fas', 'sitemap']">
          <VTable :table-data="user.pipelines" :show-row-index="true" :is-loading="isLoading" :pagination="true">
            <VColumn header="Name" value="name" />
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
        </VTab>
      </template>
      <template #Roles>
        <VTab header="Roles" :icon="['fas', 'users']">
          <VTable :table-data="user.roles" :show-row-index="true" :is-loading="isLoading" :pagination="true">
            <VColumn header="Name" value="name" />
            <VColumn header="Description" value="description" />
            <VColumn header="Actions" value="actions">
              <template #body="{ row }">
                <VButtonSet>
                  <VButton
                    :icon="['fas', 'eye']" :link-to="{ name: 'SingleRole', params: { roleId: row.id } }"
                    tooltip-text="View"
                  />
                  <VButton
                    :icon="['fas', 'trash']" :is-loading="isBtnLoading" tooltip-text="Remove"
                    @on-click="deleteDataRoles(row.id)"
                  />
                </VButtonSet>
              </template>
            </VColumn>
          </VTable>
          <VButton :icon="['fas', 'plus']" @click="showAddRoleModal">
            Add New
          </VButton>
        </VTab>
      </template>
    </VTabView>

    <VModal v-model:isActive="isAddModalRoleVissible">
      <VDropdown
        v-model:data="formData" name="roleId" placeholder="Roles" :icon="['fas', 'sitemap']" :options="roles"
        option-label="name" option-value="id" :is-multyselect="true"
      />
      <VButton :icon="['fas', 'plus']" :is-loading="isBtnLoading" @on-click="addDataRole">
        Add
      </VButton>
    </VModal>

    <VNotification />
  </div>
</template>
