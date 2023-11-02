<template>
  <div>
    <Table :tableData="tableData" :showRowIndex="true" :isLoading="isLoading">
      <Column header="First Name" value="first_name"/>
      <Column header="Last Name" value="last_name" />
      <Column header="Email" value="email" />
      <template #access_level="item">
        <Column header="Access Level" value="access_level">
          <Tag :value="item.item.access_level" :type="item.item.access_level" />
        </Column>
      </template>
      <template #status="item">
        <Column header="Status" value="status">
          <Tag v-if="item.item" :value="item.item.status" :type="item.item.status" />
        </Column>
      </template>
      <template #actions="item">
        <Column header="Actions" value="actions">
          <ButtonSet v-if="item.item" >
            <Button :icon="['fas', 'eye']" :linkTo="{name: 'SingleUser', params: { user_id: item.item.id } }" tooltipText="View"/>
            <Button :icon="['fas', 'pen-to-square']" @onClick="showEditModal(item.item)" tooltipText="Edit"/>
            <Button :icon="['fas', 'trash']" @onClick="requiredConfirmation(() => deleteData(item.item))" :isLoading="isBtnLoading" tooltipText="Remove"/>
          </ButtonSet>
        </Column>
      </template>
    </Table>
    <Button :icon="['fas', 'plus']" @onClick="showAddModal">Add New</Button>
  
    <Modal v-model:isActive="isAddModalVissible" >
      <TextInput name="first_name" placeholder="Fi  rst Name" :icon="['fas', 'fa-user-tag']" v-model:data="formData.first_name" />
      <TextInput name="last_name" placeholder="Last name" :icon="['fas', 'fa-user-tag']" v-model:data="formData.last_name" />
      <TextInput name="email" placeholder="Email" :icon="['fas', 'fa-at']" v-model:data="formData.email" />
      <TextInput name="password" placeholder="******" :icon="['fas', 'fa-key']" v-model:data="formData.password" />
      <TextInput name="confirm_password" placeholder="******" :icon="['fas', 'fa-key']" v-model:data="formData.confirm_password" />
      <Dropdown name="account_level" placeholder="Account Level" :icon="['fas', 'user-tag']" v-model:data="formData.access_level" :options="['User', 'Admin']"/>
      <Button :icon="['fas', 'plus']" @onClick="addData" :isLoading="isBtnLoading">Add</Button>
    </Modal>
    <Modal v-model:isActive="isEditModalVissible" >
      <TextInput type="text" name="first_name" placeholder="First Name" :icon="['fas', 'fa-user-tag']" v-model:data="formData.first_name" />
      <TextInput type="text" name="last_name" placeholder="Last name" :icon="['fas', 'fa-user-tag']" v-model:data="formData.last_name" />
      <TextInput type="text" name="email" placeholder="Email" :icon="['fas', 'fa-at']" v-model:data="formData.email" />
      <TextInput type="password" name="password" placeholder="******" :icon="['fas', 'fa-key']" v-model:data="formData.password" />
      <TextInput type="password" name="confirm_password" placeholder="******" :icon="['fas', 'fa-key']" v-model:data="formData.confirm_password" />
      <Dropdown name="account_level" placeholder="Account Level" :icon="['fas', 'user-tag']" v-model:data="formData.access_level" :options="['User', 'Admin']"/>
      <Dropdown name="status" placeholder="Status" :icon="['fas', 'flag']" v-model:data="formData.status" :options="['active', 'inactive']"/>
      <Button :icon="['fas', 'floppy-disk']" @onClick="updateData" :isLoading="isBtnLoading">Save</Button>
    </Modal>
  </div>
</template> 

<script lang="ts">
import { defineComponent } from 'vue';
import Table from '../components/Table.vue';
import Button from '../components/Button.vue';
import ButtonSet from '../components/ButtonSet.vue';
import Modal from '../components/Modal.vue';
import TextInput from '../components/Form/TextInput.vue';
import Dropdown from '../components/Form/Dropdown.vue';
import Tag from '../components/Tag.vue';
import Column from '../components/Column.vue';
import { useNotifyStore } from '../stores/notifications'

export default defineComponent({
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
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        confirm_password: null,
        status: null,
        access_level: null,
      }
    };
  },
  async created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios({
          method: "get",
          url: `${this.backendUrl}/users`
        });
        
        this.tableData = response.data.data;
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false
    },
    clearForm(){
      Object.keys(this.formData).forEach(key => (this.formData[key] = null));
    },
    showAddModal(){
      this.clearForm()
      this.isAddModalVissible = true;
    },
    showEditModal(data: Object){
      this.clearForm()
      Object.assign(this.formData, data);
      this.isEditModalVissible = true;
    },
    async addData() {
      try {
        this.isLoading = true;
        this.isBtnLoading = true;

        const response = await this.axios({
          method: "post",
          url: `${this.backendUrl}/users`,
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
          url: `${this.backendUrl}/users/${this.formData.id}`,
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
    async deleteData(data: Object) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: "delete",
          url: `${this.backendUrl}/users/${data.id}`
        });
        
        useNotifyStore().add(response.data.status, response.data.message);
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      await this.loadData()
    }
  },
});
</script>
