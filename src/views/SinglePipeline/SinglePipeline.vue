<script>
import VTable from '../../components/VTable.vue';
import VButton from '../../components/VButton.vue';
import VButtonSet from '../../components/VButtonSet.vue';
import VTag from '../../components/VTag.vue';
import VColumn from '../../components/VColumn.vue';
import VModal from '../../components/VModal.vue';
import VDropdown from '../../components/Form/VDropdown.vue';
import VTextInput from '../../components/Form/VTextInput.vue';
import { useNotifyStore } from '../../stores/notifications';

export default {
  components: {
    VTable,
    VButton,
    VButtonSet,
    VTag,
    VColumn,
    VModal,
    VTextInput,
    VDropdown,
  },
  data() {
    return {
      isLoading: true,
      isBtnLoading: false,
      isModalBtnLoading: false,
      isModalVissible: false,
      interval: null,
      formData: {},
      params: {},
      builds: [],
      backendUrl: import.meta.env.VITE_backendUrl,
    };
  },
  computed: {
    getAllParameters() {
      return this.params.filter((item) => {
        if (item.depends_on) {
          const depends_on = Object.keys(item.depends_on);

          const isActive = depends_on.filter((key) => {
            if (item.depends_on[key] === this.formData[key])
              return true;
            else
              return false;
          });

          if (isActive.length === depends_on.length) {
            return true;
          }
          else {
            this.formData[item.key] = null;
            return false;
          }
        }
        else {
          return true;
        }
      });
    },
  },
  created() {
    this.loadData();
    this.intervalLoadData();
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios.get(
                `${this.backendUrl}/pipelines/${this.$route.params.application.toLowerCase()}/${this.$route.params.pipeline_id}/builds`,
        );

        this.builds = response.data.data;
      }
      catch (error) {
        useNotifyStore().add('error', error.data.message || 'Error loading data!');
      }

      this.isLoading = false;
    },
    async getPipelineParams() {
      try {
        this.isBtnLoading = true;

        const response = await this.axios.get(
                `${this.backendUrl}/pipelines/${this.$route.params.application.toLowerCase()}/${this.$route.params.pipeline_id}/params`,
        );

        this.params = response.data.data;
        this.params.forEach((e) => {
          this.formData[e.key] = null;
        });

        this.isModalVissible = true;
        this.isBtnLoading = false;
      }
      catch (error) {
        useNotifyStore().add('error', error.data.message || 'Error loading data!');
      }
    },
    async startPipeline() {
      try {
        this.isModalBtnLoading = true;

        const response = await this.axios({
          method: 'post',
          url: `${this.backendUrl}/pipelines/${this.$route.params.application.toLowerCase()}/${this.$route.params.pipeline_id}/builds`,
          data: this.formData,
        });

        useNotifyStore().add(response.data.status, response.data.message);
      }
      catch (error) {
        useNotifyStore().add('error', error.data.message || 'Error loading data!');
      }

      this.isModalVissible = false;
      this.isModalBtnLoading = false;
      await this.loadData();
    },
    async intervalLoadData() {
      this.interval = setInterval(() => {
        this.loadData();
      }, 10000);
    },
  },
};
</script>

<template>
  <div>
    <VTable
      :table-data="builds"
      :is-loading="isLoading"
      :pagination="true"
      :page_size="20"
    >
      <VColumn
        header="#"
        value="id"
      />
      <VColumn
        header="Commit Message"
        value="commit_msg"
      />
      <template #duration="item">
        <VColumn
          header="Duration"
          value="duration"
        >
          {{ formatSeconds(item.item.duration) }}
        </VColumn>
      </template>
      <template
        v-if="$route.params.application === 'GitLab'"
        #stages="item"
      >
        <VColumn
          header="Stages"
          value="stages"
        >
          <VTag
            v-for="stage in item.item.stages"
            :key="stage"
            :value="stage.name"
            :type="stage.status"
          />
        </VColumn>
      </template>
      <template #created_at="item">
        <VColumn
          header="Started At"
          value="created_at"
        >
          {{ unixTimestampToFormattedString(item.item.created_at) }}
        </VColumn>
      </template>
      <template #status="item">
        <VColumn
          header="Status"
          value="status"
        >
          <VTag
            :value="item.item.status"
            :type="item.item.status"
          />
        </VColumn>
      </template>
      <template #actions="item">
        <VColumn
          header="Actions"
          value="actions"
        >
          <VButtonSet>
            <VButton
              v-if="item.item.status !== 'running'"
              :icon="['fas', 'arrows-rotate']"
              tooltip-text="Replay"
            />
            <VButton
              v-if="item.item.status === 'running'"
              :icon="['fas', 'stop']"
              tooltip-text="Stop"
            />
            <VButton
              v-if="$route.params.application === 'Jenkins'"
              :icon="['fas', 'eye']"
              :link-to="{ name: `SingleBuild${$route.params.application}`, params: { build_id: item.item.id } }"
              tooltip-text="View"
            />
            <VButton
              v-else
              :icon="['fas', 'eye']"
              :link-to="{ name: 'SingleBuildGit', params: { build_id: item.item.id, appplication: $route.params.application } }"
              tooltip-text="View"
            />
          </VButtonSet>
        </VColumn>
      </template>
    </VTable>
    <VButton
      :icon="['fas', 'fa-play']"
      :is-loading="isBtnLoading"
      @on-click="getPipelineParams"
    >
      Run Pipeline
    </VButton>
    <VModal v-model:isActive="isModalVissible">
      <template
        v-for="param in getAllParameters"
        :key="param"
      >
        <VTextInput
          v-if="param.type === 'string' || param.type === 'stringparameterdefinition'"
          v-model:data="formData[param.key]"
          type="text"
          :name="param.key"
          :placeholder="param.key"
          :icon="['fas', 'tag']"
          :tooltip-text="param.description"
          tooltip-pos="left"
        />
        <VTextInput
          v-if="param.type === 'password'"
          v-model:data="formData[param.key]"
          type="password"
          :name="param.key"
          :placeholder="param.key"
          :icon="['fas', 'fa-key']"
          :tooltip-text="param.description"
          tooltip-pos="left"
        />
        <VDropdown
          v-else-if="param.type === 'choice'"
          v-model:data="formData[param.key]"
          :name="param.key"
          :placeholder="param.key"
          :icon="['fas', 'tag']"
          :options="param.value"
          :tooltip-text="param.description"
          tooltip-pos="left"
        />
      </template>
      <VButtonSet class="flex-end">
        <VButton
          :icon="['fas', 'fa-play']"
          :is-loading="isModalBtnLoading"
          @on-click="startPipeline"
        >
          Run
        </VButton>
      </VButtonSet>
    </VModal>
  </div>
</template>