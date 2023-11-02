<script>
import VTable from '../components/VTable.vue';
import VButton from '../components/VButton.vue';
import VButtonSet from '../components/VButtonSet.vue';
import VColumn from '../components/VColumn.vue';
import { useNotifyStore } from '../stores/notifications';

export default {
  components: {
    VTable,
    VButton,
    VButtonSet,
    VColumn,
  },
  data() {
    return {
      isLoading: true,
      tableData: [],
      backendUrl: import.meta.env.VITE_backendUrl,
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios.get(`${this.backendUrl}/pipelines`);
        this.tableData = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', error.data.message || 'Unable to get all pipelines.');
      }

      this.isLoading = false;
    },
  },
};
</script>

<template>
  <div>
    <VTable
      :table-data="tableData"
      :show-row-index="true"
      :is-loading="isLoading"
      :pagination="true"
      :page-size="20"
      :is-searchable="true"
      :search-in-columns="['name']"
    >
      <VColumn
        header="Name"
        value="name"
      />
      <template #application="item">
        <VColumn
          header="Application"
          value="application"
        >
          {{ item.item.application.name }}
        </VColumn>
      </template>
      <template #actions="item">
        <VColumn
          header="Actions"
          value="actions"
        >
          <VButtonSet>
            <VButton
              :icon="['fas', 'eye']"
              :link-to="{ name: 'SinglePipeline', params: { pipeline_id: item.item.id, application: item.item.application.type } }"
              tooltip-text="View"
            />
          </VButtonSet>
        </VColumn>
      </template>
    </VTable>
  </div>
</template>
