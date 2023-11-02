<script>
import VTag from '../../components/VTag.vue';
import { useNotifyStore } from '../../stores/notifications';

export default {
  components: {
    VTag,
  },
  data() {
    return {
      isLoading: true,
      stage_logs: {},
      buildInfo: {},
      interval: null,
      activeStage: null,
      backendUrl: import.meta.env.VITE_backendUrl,
      stageIcons: {
        success: ['fas', 'check'],
        failed: ['fas', 'xmark'],
        running: ['fas', 'spinner'],
        created: ['fas', 'pause'],
        pending: ['fas', 'pause'],
        canceled: ['fas', 'ban'],
        skipped: ['fas', 'slash'],
      },
    };
  },
  async created() {
    await this.loadData();
    await this.refreshRunningBuild();
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    async loadData() {
      try {
        const response = await this.axios.get(
                `${this.backendUrl}/pipelines/jenkins/${this.$route.params.pipeline_id}/builds/${this.$route.params.build_id}`,
        );

        this.buildInfo = response.data.data;
        this.scrollToBottom();
      }
      catch (error) {
        useNotifyStore().add('error', 'Error loading data!');
      }

      this.isLoading = false;
    },
    async refreshRunningBuild() {
      if (this.buildInfo.status !== 'running' && this.buildInfo.status !== 'created')
        return;

      this.interval = setInterval(async () => {
        await this.loadData();
        if (this.buildInfo.status !== 'running' && this.buildInfo.status !== 'created')
          clearInterval(this.interval);
      }, 5000);
    },

    scrollToBottom() {
      console.log(this.$refs);
      if (this.$refs[this.buildInfo.name])
        this.$refs[this.buildInfo.name][0].scrollTop = this.$refs[this.buildInfo.name][0].scrollHeight;
    },
  },
};
</script>

<template>
  <div
    v-if="!buildInfo.name"
    class="loader"
  >
    <font-awesome-icon
      :icon="['fas', 'spinner']"
      spin
    />
  </div>
  <div v-else>
    <div class="build_info">
      <aside class="build_info_card">
        <div><b>Name:</b> {{ buildInfo.name }}</div>
        <div>
          <b>Status:</b> <VTag
            :type="buildInfo.status"
            :value="buildInfo.status"
          />
        </div>
        <div><b>Duration:</b> {{ formatSeconds(buildInfo.duration) }}</div>
        <div><b>Started Date:</b> {{ unixTimestampToFormattedString(buildInfo.created_at) }}</div>
      </aside>
      <code :ref="buildInfo.name">
        <div
          v-for="(line, index) in buildInfo.log"
          :key="index"
        >
          <div class="line_number">{{ index + 1 }}</div>
          <div class="text_holder">{{ line }}</div>
        </div>
        <div
          v-if="buildInfo.status === 'running'"
          class="loader_log"
        >
          <div class="text_holder">
            <font-awesome-icon
              :icon="['fas', 'spinner']"
              spin
            /> Running...
          </div>
        </div>
        <div
          v-else-if="buildInfo.log.length === 0"
          class="loader_log"
        >
          <div class="text_holder">
            <font-awesome-icon :icon="['fas', 'ghost']" /> No Logs
          </div>
        </div>
      </code>
    </div>
  </div>
</template>

<style>
</style>
