<template>
    <div>
        <TabView>
          <template #Pipelines>
          <Tab header="Pipelines" :icon="['fas', 'sitemap']">
            <Table :tableData="user['pipelines']" :showRowIndex="true" :isLoading="isLoading" :pagination="true">
              <Column header="Name" value="name" />
              <template #application_id="item">
              <Column header="Application" value="application_id">
                {{ item.item.application.name }}
              </Column>
              </template>
              <template #actions="item">
              <Column header="Actions" value="actions">
                <ButtonSet>
                  <Button :icon="['fas', 'trash']" @onClick="requiredConfirmation(() => deleteDataPipeline(item.item.id))" :isLoading="isBtnLoading" tooltipText="Remove" />
                </ButtonSet>
              </Column>
              </template>
            </Table>
          </Tab>
          </template>
          <template #Roles>
          <Tab header="Roles" :icon="['fas', 'users']">
            <Table :tableData="user['roles']" :showRowIndex="true" :isLoading="isLoading" :pagination="true">
              <Column header="Name" value="name" />
              <Column header="Description" value="description" />
              <template #actions="item">
              <Column header="Actions" value="actions">
                <ButtonSet>
                  <Button :icon="['fas', 'eye']" :linkTo="{name: 'SingleRole', params: { roleId: item.item.id } }" tooltipText="View"/>
                  <Button :icon="['fas', 'trash']" @onClick="requiredConfirmation(() => deleteDataRoles(item.item.id))" :isLoading="isBtnLoading" tooltipText="Remove"/>
                </ButtonSet>
              </Column>
              </template>
            </Table>
            <Button :icon="['fas', 'plus']" @click="showAddRoleModal">Add New</Button>
          </Tab>
          </template>
        </TabView>

        <Modal v-model:isActive="isAddModalRoleVissible">
          <Dropdown name="roleId" placeholder="Roles" :icon="['fas', 'sitemap']" v-model:data="formData" :options="roles" optionLabel="name" optionValue="id" :isMultyselect="true"/>
          <Button :icon="['fas', 'plus']" @onClick="addDataRole" :isLoading="isBtnLoading">Add</Button>
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
      isAddModalRoleVissible: false,
      backendUrl: import.meta.env.VITE_backendUrl,
      user: {},
      formData: [],
      pipelines: [],
      roles: [],
    };
  },
  async created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/users/${this.$route.params.user_id}`
        );
        
        this.user = response.data.data;
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false
    },
    async showAddRoleModal(){
      await this.getUnassignedRoles()
      this.isAddModalRoleVissible = true;
    },
    async getUnassignedRoles(){
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/users/${this.$route.params.user_id}/unassigned_roles`
        );
        
        this.roles = response.data.data;
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }
    },
    async addDataRole() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: "post",
          url: `${this.backendUrl}/access_roles/${this.formData[0]}/users`,
          data: [this.$route.params.user_id],
        });
        
        useNotifyStore().add(response.data.status, response.data.message);
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isAddModalRoleVissible = false;
      this.isBtnLoading = false;
      await this.loadData()
    },
    async deleteDataRoles(id) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: "delete",
          url: `${this.backendUrl}/access_roles/${id}/users/${this.$route.params.user_id}`
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
