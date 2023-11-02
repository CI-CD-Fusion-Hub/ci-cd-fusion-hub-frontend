<template>
  <div>
    <Table :tableData="tableData" :showRowIndex="true" :isLoading="isLoading" :pagination="true" :page_size="20" :isSearchable="true" :search_in_columns="['name']">
      <Column header="Name" value="name" />
      <template #application="item">
      <Column header="Application" value="application">
        {{ item.item.application.name }}
      </Column>
      </template>
      <template #actions="item">
      <Column header="Actions" value="actions">
        <ButtonSet>
          <Button :icon="['fas', 'eye']" :linkTo="{name: 'SinglePipeline', params: { pipeline_id: item.item.id, application: item.item.application.type } }" tooltipText="View"/>
        </ButtonSet>
      </Column>
      </template>
    </Table>
  </div>
</template> 

<script>
import Table from '../components/Table.vue';
import Button from '../components/Button.vue';
import ButtonSet from '../components/ButtonSet.vue';
import Column from '../components/Column.vue';
import { useNotifyStore } from '../stores/notifications'

export default {
  components: {
    Table,
    Button,
    ButtonSet,
    Column
  },
  data() {
    return {
      isLoading: true,
      tableData: [],
      backendUrl: import.meta.env.VITE_backendUrl,
    };
  },
  async created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios.get(`${this.backendUrl}/pipelines`);
        this.tableData = response.data.data;
      } catch (error) {
        useNotifyStore().add('error', error.data.message || "Unable to get all pipelines.");
      }

      this.isLoading = false
    }
  },
};
</script>
