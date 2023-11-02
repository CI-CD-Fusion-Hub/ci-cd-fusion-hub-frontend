<template>
  <div>
    <Table :tableData="tableData" :showRowIndex="true" :isLoading="isLoading">
      <Column header="Name" value="name" />
      <Column header="Description" value="description" />
      <Column header="Created Date" value="created_ts" />
      <template #actions="item">
      <Column header="Actions" value="actions">
        <ButtonSet>
          <Button :icon="['fas', 'eye']" :linkTo="{name: 'SingleRole', params: { roleId: item.item.id } }" tooltipText="View" tooltipPos="Top"/>
          <Button :icon="['fas', 'pen-to-square']" @onClick="showEditModal(item.item)" tooltipText="Edit"/>
          <Button :icon="['fas', 'trash']" @onClick="requiredConfirmation(() => deleteData(item.item))" :isLoading="isBtnLoading" tooltipText="Remove"/>
        </ButtonSet>
      </Column>
      </template>
    </Table>
    <Button :icon="['fas', 'plus']" @onClick="showAddModal">Add New</Button>
  
    <Modal v-model:isActive="isAddModalVissible" >
      <TextInput name="name" placeholder="Name" tooltipText="Name of the access role." tooltipPos="left" :icon="['fas', 'fa-user-tag']" v-model:data="formData.name" />
      <TextInput name="description" placeholder="Description" :icon="['fas', 'fa-user-tag']" v-model:data="formData.description" />
      <Button :icon="['fas', 'plus']" @onClick="addData" :isLoading="isBtnLoading">Add</Button>
    </Modal>
    <Modal v-model:isActive="isEditModalVissible" >
      <TextInput name="name" placeholder="Name" :icon="['fas', 'fa-user-tag']" v-model:data="formData.name" />
      <TextInput name="description" placeholder="Description" :icon="['fas', 'fa-user-tag']" v-model:data="formData.description" />
      <Button :icon="['fas', 'floppy-disk']" @onClick="updateData" :isLoading="isBtnLoading">Save</Button>
    </Modal>
  </div>
</template> 

<script>
import Table from '../components/Table.vue';
import Button from '../components/Button.vue';
import ButtonSet from '../components/ButtonSet.vue';
import Modal from '../components/Modal.vue';
import TextInput from '../components/Form/TextInput.vue';
import Dropdown from '../components/Form/Dropdown.vue';
import Tag from '../components/Tag.vue';
import Column from '../components/Column.vue';
import { useNotifyStore } from '../stores/notifications'

export default {
  components: {
    Table,
    Button,
    ButtonSet,
    Modal,
    TextInput,
    Dropdown,
    Tag,
    Column
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
      }
    };
  },
  async created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios.get(
          `${this.backendUrl}/access_roles`
        );
        
        this.tableData = response.data.data;
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false
    },
    clear_form(){
      Object.keys(this.formData).forEach(key => (this.formData[key] = ''));
    },
    showAddModal(){
      this.clear_form()
      this.isAddModalVissible = true;
    },
    showEditModal(data){
      this.clear_form()
      Object.assign(this.formData, data);
      this.isEditModalVissible = true;
    },
    async addData() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: "post",
          url: `${this.backendUrl}/access_roles`,
          data: this.formData,
        });
        
        useNotifyStore().add(response.data.status, response.data.message);
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isAddModalVissible = false;
      this.isBtnLoading = false;
      await this.loadData()
    },
    async updateData() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: "put",
          url: `${this.backendUrl}/access_roles/${this.formData.id}`,
          data: this.formData,
        });
        
        useNotifyStore().add(response.data.status, response.data.message);
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      await this.loadData()
      this.isEditModalVissible = false;
      this.isBtnLoading = false;
    },
    async deleteData(data) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: "delete",
          url: `${this.backendUrl}/access_roles/${data.id}`
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
