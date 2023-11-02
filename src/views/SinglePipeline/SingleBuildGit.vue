<template>
  <div
    v-if="!buildInfo.stages"
    class="loader"
  >
    <font-awesome-icon
      :icon="['fas', 'spinner']"
      spin
    />
  </div>
  <div v-else>
    <nav class="stages_holder">
      <div
        v-for="stage in buildInfo.stages"
        :key="stage"
        :class="`stage`"
      >
        <VButton
          :icon="stageIcons[stage.status]"
          :is-loading="stage.status === 'running' ? true : false"
          :class="stage.status"
          :is-active="isStageActive(stage.name)"
          @on-click="changeStage(stage.name)"
        />
        <div class="stage_label">
          {{ stage.name }}
        </div>
      </div>
    </nav>
    <template
      v-for="stage in buildInfo.stages"
      :key="stage.name"
    >
      <div
        v-if="isStageActive(stage.name)"
        class="build_info"
      >
        <code :ref="stage.name">
          <template v-if="stage.id in stage_logs">
            <div
              v-for="(line, index) in stage_logs[stage.id].log"
              :key="index"
            >
              <div class="line_number">{{ index + 1 }}</div>
              <div class="text_holder">{{ line }}</div>
            </div>
            <div
              v-if="stage.status === 'running'"
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
              v-else-if="stage_logs[stage.id].log.length === 0"
              class="loader_log"
            >
              <div class="text_holder">
                <font-awesome-icon :icon="['fas', 'ghost']" /> No Logs
              </div>
            </div>
          </template>
          <div
            v-else
            class="loader"
          >
            <font-awesome-icon
              :icon="['fas', 'spinner']"
              spin
            />
          </div>
        </code>
        <aside class="build_info_card">
          <h3>{{ buildInfo.name }}</h3>
          <div>
            <b>Status:</b> <VTag
              :type="stage.status"
              :value="stage.status"
            />
          </div>
          <div><b>Stage:</b> {{ stage.name }}</div>
          <div><b>Duration:</b> {{ formatSeconds(stage.duration) }}</div>
          <div><b>Started Date:</b> {{ unixTimestampToFormattedString(buildInfo.created_at) }}</div>
          <div><b>Commit:</b> {{ buildInfo.commit_msg }}</div>
        </aside>
      </div>
    </template>
  </div>
</template> 

<script>
import VTag from '../../components/VTag.vue';
import { useNotifyStore } from '../../stores/notifications'

export default {
    components: {
        VTag,
    },
    data() {
        return {
            isLoading: true,
            stage_logs: {},
            buildInfo: {},
            interval: {},
            activeStage: undefined,
            backendUrl: import.meta.env.VITE_backendUrl,
            stageIcons: {
                success: ['fas', 'check'],
                failed: ['fas', 'xmark'],
                running: ['fas', 'spinner'],
                created: ['fas', 'pause'],
                pending: ['fas', 'pause'],
                canceled: ['fas', 'ban'],
                skipped: ['fas', 'slash'],
            }
        }
    },
    computed: {
        getActiveStage(){
            return this.$route.query?.activeStage ? this.$route.query.activeStage : this.buildInfo.stages[0].name
        }
    },
    async created() {
        await this.loadData()
        this.activeStage = this.buildInfo.stages[0].name
        await this.refreshRunningStage()
        await this.refreshRunningBuild()
    },
    unmounted() {
        Object.entries(this.interval).forEach((e) => {
            clearInterval(e)
        });
    },
    methods: {
        async loadData() {
            try {
                console.log(this.$route.params.application)
                const response = await this.axios.get(
                `${this.backendUrl}/pipelines/${this.$route.params.application.toLowerCase()}/${this.$route.params.pipeline_id}/builds/${this.$route.params.build_id}`
                );
                
                this.buildInfo = response.data.data;
            } catch (error) {
                useNotifyStore().add('error', 'Error loading data!');
            }

            this.isLoading = false
        },
        async loadStageLog(id) {
            try {
                const response = await this.axios.get(
                `${this.backendUrl}/pipelines/${this.$route.params.application.toLowerCase()}/${this.$route.params.pipeline_id}/builds/${this.$route.params.build_id}/jobs/${id}/trace`
                );
                
                this.stage_logs[id] = response.data.data
                this.scrollToBottom()
                console.log(response.data.data.status)
                if (response.data.data.status !== 'running' && response.data.data.status !== 'created' && id in this.interval){
                    console.log("Clear Interval: " + response.data.data.name)
                    clearInterval(this.interval[id])
                }
            } catch (error) {
                useNotifyStore().add('error', 'Error loading data!');
            }
        },
        async refreshRunningStage(){
            this.buildInfo.stages.forEach(async(e) => {
                if(Object.keys(this.interval).length === 0){
                    await this.loadStageLog(e.id)
                }

                if ((e.status === 'created' || e.status === 'running') && !(e.id in this.interval)) {
                    console.log("Start Interval: " + e.name)
                    this.interval[e.id] = setInterval(async () => {
                        await this.loadStageLog(e.id)
                    }, 3000);
                }
            });
        },
        async refreshRunningBuild(){
            if(this.buildInfo.status !== 'running' && this.buildInfo.status !== 'created'){
                return
            }

            this.interval[this.buildInfo.id] = setInterval(async () => {
                await this.loadData()

                if(this.buildInfo.status !== 'running' && this.buildInfo.status !== 'created'){
                    clearInterval(this.interval[this.buildInfo.id])
                }
            }, 5000);
        },
        changeStage(id){
            this.activeStage = id

            this.$router.push({ path: this.$route.path, query: {activeStage: id} });
            this.scrollToBottom()
        },
        isStageActive(stage) {
            return stage === this.getActiveStage ? true : false
        },
        scrollToBottom() {
            if (this.$refs[this.getActiveStage]) {
                this.$refs[this.getActiveStage][0].scrollTop = this.$refs[this.getActiveStage][0].scrollHeight;
            }
        },
    },
}
</script>

<style>
.stages_holder {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 15vh;
    margin: 0;
    gap:50px;
}

.stages_holder .stage {
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: var(--border-radius);
    position: relative;
}

.stages_holder .stage button {
    border-radius: 50%;
    width: 30px;
    height: 30px;
}

.stages_holder .stage:not(:only-child):not(:last-child):after {
    content: '';
    display: inline-block;
    width: 50px;
    border: solid 1.5px var(--main-color);
    z-index: 1;
    position: absolute;
    bottom: 19px;
    right: -50px;
}

.stages_holder .stage_label {
    position: absolute;
    top: -27px;
}

.stages_holder .btn-holder {
    border: solid 2px transparent;
    border-radius: 50%;
    padding: 2px;
    transition: all 300ms ease-in-out;
}
.stages_holder .stage .btn-holder.active {
    border-color: var(--main-color);
}

.stages_holder .success {
    border-radius: 50%;
}

.stages_holder .success button {
    background-color: green;
}
.stages_holder .running button {
    background-color: yellow;
    color: var(--main-color)
}
.stages_holder .failed button {
    background-color: red;
}
.stages_holder .created button,
.stages_holder .skipped button {
    background-color: gray;
}

.build_info {
    display: flex;
    height: 80vh;
}

.build_info_card {
    width: 250px;
    background-color: white;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 10px;
    color: var(--main-color)
}

.build_info_card b {
    font-weight: 700;
}

.build_info_card h3 {
    padding-bottom: 10px;
    border-bottom: solid 1px var(--main-color)
}

.build_info_card div {
    margin-bottom: 10px
}

.tabs .tag {
    position: absolute;
    top: 10px;
    right: 10px;
}

code {
  background-color: black;
  display: flex;
  flex-flow: column;
  gap: 2px;
  padding: 10px 0;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  font-family: monospace;
  min-height: 25px;
  overflow: auto;
  max-height: calc(80vh - 15px);
  box-shadow: 1px 0px 3px 0px #9c9494;
  width: 100%;
  position: relative;
}

code .loader_log {
    margin: auto;
}

code > div {
  display: flex;
  gap: 5px;
  align-items: flex-start;
}

code .line_number {
  width: 35px;
  min-width: 35px;
  text-align: right;
  color: #666;
}

code .text_holder {
  color: white;
  line-height: 20px;
  word-break: break-word;
}
</style>