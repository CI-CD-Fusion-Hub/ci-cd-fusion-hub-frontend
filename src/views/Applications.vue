<template>
  <div>
    <Table v-if="tableData" :tableData="tableData" :showRowIndex="true" :isLoading="isLoading">
      <Column header="Name" value="name" />
      <Column header="Filter By (Regex)" value="regex_pattern" />
      <Column header="Auth User" value="auth_user" />
      <Column header="API Url" value="base_url" />
      <Column header="Type" value="type" />
      <Column header="Created Date" value="created_ts" />
      <template #status="item">
        <Column header="Status" value="status">
          <Tag v-if="item.item" :value="item.item.status" :type="item.item.status" />
        </Column>
      </template>
      <template #actions="item">
      <Column header="Actions" value="actions">
        <ButtonSet>
          <Button :icon="['fas', 'pen-to-square']" @onClick="showEditModal(item.item)" tooltipText="Edit"/>
          <Button :icon="['fas', 'trash']" @onClick="requiredConfirmation(() => deleteData(item.item))" :isLoading="isBtnLoading" tooltipText="Remove"/>
        </ButtonSet>
      </Column>
      </template>
    </Table>
    <Button :icon="['fas', 'plus']" @onClick="showAddModal" class="flex-end">Add New</Button>
  
    <Modal v-model:isActive="isAddModalVissible" >
      <TextInput name="name" placeholder="Name" :icon="['fas', 'fa-user-tag']" v-model:data="formData.name" />
      <Dropdown name="type" placeholder="Application" :icon="['fas', 'flag']" v-model:data="formData.type" :options="['Jenkins', 'GitLab', 'GitHub', 'AzureDevOps']"/>
      <TextInput name="regex_pattern" placeholder="Filter By (Regex)" :icon="['fas', 'fa-filter']" v-model:data="formData.regex_pattern" />
      <TextInput v-if="formData.type === 'Jenkins'" name="auth_user" placeholder="Authentication User" :icon="['fas', 'fa-user-tag']" v-model:data="formData.auth_user" />
      <TextInput type="auth_pass" name="auth_pass" placeholder="Token/Password" :icon="['fas', 'fa-user-tag']" v-model:data="formData.auth_pass" />
      <TextInput name="base_url" type="url" placeholder="API Url" :icon="['fas', 'fa-user-tag']" v-model:data="formData.base_url" />
      <ButtonSet class="flex-end">
        <Button :icon="['fas', 'check']" @onClick="verifyData" :isLoading="isBtnVerifyLoading">Verify</Button>
        <Button :icon="['fas', 'plus']" @onClick="addData" :isLoading="isBtnLoading">Add</Button>
      </ButtonSet>
    </Modal>
    <Modal v-model:isActive="isEditModalVissible" >
      <TextInput name="name" placeholder="Name" :icon="['fas', 'fa-user-tag']" v-model:data="formData.name" />
      <TextInput name="regex_pattern" placeholder="Filter By (Regex)" :icon="['fas', 'fa-filter']" v-model:data="formData.regex_pattern" />
      <TextInput v-if="formData.type === 'jenkins'" name="auth_user" placeholder="Authentication User" :icon="['fas', 'fa-user-tag']" v-model:data="formData.auth_user" />
      <TextInput type="auth_pass" name="auth_pass" placeholder="Token/Password" :icon="['fas', 'fa-user-tag']" v-model:data="formData.auth_pass" />
      <TextInput name="base_url" placeholder="API Url" :icon="['fas', 'fa-user-tag']" v-model:data="formData.base_url" />
      <Dropdown name="status" placeholder="Status" :icon="['fas', 'flag']" v-model:data="formData.status" :options="['active', 'inactive']" />
      <ButtonSet class="flex-end">
        <Button :icon="['fas', 'check']" @onClick="verifyData" :isLoading="isBtnVerifyLoading">Verify</Button>
        <Button :icon="['fas', 'save']" @onClick="updateData" :isLoading="isBtnLoading">Save</Button>
      </ButtonSet>
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
      isBtnVerifyLoading: false,
      backendUrl: import.meta.env.VITE_backendUrl,
      tableData: [],
      formData: {
        id: null,
        name: null,
        auth_user: null,
        auth_pass: null,
        base_url: null,
        type: null,
        status: null,
        regex_pattern: null,
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
          `${this.backendUrl}/applications`
        );
        
        this.tableData = response.data.data;
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false
    },
    clearForm(){
      Object.keys(this.formData).forEach(key => (this.formData[key] = ''));
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
          url: `${this.backendUrl}/applications`,
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
          url: `${this.backendUrl}/applications/${this.formData.id}`,
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
    async verifyData() {
      try {
        this.isBtnVerifyLoading = true;

        const response = await this.axios({
          method: "post",
          url: `${this.backendUrl}/applications/verify`,
          data: this.formData,
        });
        
        useNotifyStore().add(response.data.status, response.data.message);
      } catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isBtnVerifyLoading = false;
    },
    async deleteData(data: Object) {
      try {
        this.isLoading = true;

        const response = await this.axios({
          method: "delete",
          url: `${this.backendUrl}/applications/${data.id}`
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
