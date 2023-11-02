<template>
    <div>
        <TabView>
          <template #Pipelines>
          <Tab header="Pipelines" :icon="['fas', 'sitemap']">
            <Table :tableData="role['pipelines']" :showRowIndex="true" :isLoading="isLoading" :pagination="true" :page_size="20">
              <Column header="Name" value="name" />
              <Column header="Created Date" value="created_ts" />
              <template #application_id="item">
              <Column header="Application" value="application_id">
                {{ item.item.application.name }}
              </Column>
              </template>
              <template #actions="item">
              <Column header="Actions" value="actions">
                <ButtonSet>
                  <Button :icon="['fas', 'trash']" @onClick="requiredConfirmation(() => deleteDataPipeline(item.item.id))" :isLoading="isBtnLoading" tooltipText="Remove"/>
                </ButtonSet>
              </Column>
              </template>
            </Table>
            <Button :icon="['fas', 'plus']" @onClick="showAddPipelineModal">Add New</Button>
          </Tab>
          </template>
          <template #Members>
          <Tab header="Members" :icon="['fas', 'users']">
            <Table :tableData="role['members']" :showRowIndex="true" :isLoading="isLoading" :pagination="true" :page_size="20">
              <Column header="First Name" value="first_name" />
              <Column header="Last Name" value="last_name" />
              <Column header="Email" value="email" />
              <template #actions="item">
              <Column header="Actions" value="actions">
                <ButtonSet>
                  <Button :icon="['fas', 'eye']" :linkTo="{name: 'SingleUser', params: { user_id: item.item.id } }" tooltipText="View"/>
                  <Button :icon="['fas', 'trash']" @onClick="requiredConfirmation(() => deleteDataUser(item.item.id))" :isLoading="isBtnLoading" tooltipText="Remove" />
                </ButtonSet>
              </Column>
              </template>
            </Table>
            <Button :icon="['fas', 'plus']" @onClick="showAddUserModal">Add New</Button>
          </Tab>
          </template>
        </TabView>

        <Modal v-model:isActive="isAddModalPipelineVissible">
          <Dropdown name="pipeline_id" placeholder="Pipelines" :icon="['fas', 'sitemap']" v-model:data="formPipelineData" :options="pipelines" :isMultyselect="true" optionLabel="name" optionValue="id"  :isSearchable="true" />
          <Button v-if="pipelines.length > 0" :icon="['fas', 'plus']" @onClick="addDataPipeline" :isLoading="isBtnLoading">Add</Button>
        </Modal>
        <Modal v-model:isActive="isAddModalUserVissible">
          <Dropdown name="user_id" placeholder="Users" :icon="['fas', 'sitemap']" v-model:data="formUserData" :options="users" :isMultyselect="true" optionLabel="email" optionValue="id" :isSearchable="true" />
          <Button v-if="users.length > 0" :icon="['fas', 'plus']" @onClick="addDataUser" :isLoading="isBtnLoading">Add</Button>
        </Modal>

        <Notification />
    </div>
</template>

<script>
import TabView from '../../components/TabView.vue';
import Tab from '../../components/Tab.vue';
import Table from '../../components/Table.vue';
import Button from '../../components/Button.vue';
import ButtonSet from '../../components/ButtonSet.vue';
import Modal from '../../components/Modal.vue';
import Dropdown from '../../components/Form/Dropdown.vue';
import Column from '../../components/Column.vue';
import { useNotifyStore } from '../../stores/notifications'

export default {
  components: {
    Tab,
    TabView,
    Table,
    Button,
    Modal,
    Dropdown,
    ButtonSet,
    Column
  },
  data() {
    return {
      isLoading: true,
      isBtnLoading: false,
      isAddModalPipelineVissible: false,
      isAddModalUserVissible: false,
      backendUrl: import.meta.env.VITE_backendUrl,
      role: {},
      formPipelineData: [],
      formUserData: [],
      pipelines: [],
      users: [],
    };
  },
  async created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/access_roles/${this.$route.params.roleId}`
        );
        
        this.role = response.data.data;
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false
    },
    async showAddPipelineModal(){
      await this.getUnassignedPipelines()
      this.isAddModalPipelineVissible = true;
    },
    async getUnassignedPipelines(){
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/access_roles/${this.$route.params.roleId}/unassigned_pipelines`
        );
        
        this.pipelines = response.data.data;
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }
    },
    async addDataPipeline() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: "post",
          url: `${this.backendUrl}/access_roles/${this.$route.params.roleId}/pipelines`,
          data: this.formPipelineData,
        });
        
        useNotifyStore().add(response.data.status, response.data.message);
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isAddModalPipelineVissible = false;
      this.isBtnLoading = false;
      await this.loadData()
    },
    async deleteDataPipeline(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: "delete",
          url: `${this.backendUrl}/access_roles/${this.$route.params.roleId}/pipelines/${id}`
        });
        
        useNotifyStore().add(response.data.status, response.data.message);
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      await this.loadData()
    },
    async showAddUserModal(){
      await this.getUnassignedUsers()
      this.isAddModalUserVissible = true;
    },
    async getUnassignedUsers(){
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/access_roles/${this.$route.params.roleId}/unassigned_users`
        );
        
        this.users = response.data.data;
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }
    },
    async addDataUser() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: "post",
          url: `${this.backendUrl}/access_roles/${this.$route.params.roleId}/users`,
          data: this.formUserData,
        });
        
        useNotifyStore().add(response.data.status, response.data.message);
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isAddModalUserVissible = false;
      this.isBtnLoading = false;
      await this.loadData()
    },
    async deleteDataUser(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: "delete",
          url: `${this.backendUrl}/access_roles/${this.$route.params.roleId}/users/${id}`
        });
        
        useNotifyStore().add(response.data.status, response.data.message);
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      await this.loadData()
    }
  },
};
</script>
