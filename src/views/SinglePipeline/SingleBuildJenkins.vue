<template>
    <div class="loader" v-if="!buildInfo.name">
        <font-awesome-icon :icon="['fas', 'spinner']" spin />
    </div>
    <div v-else>
        <div class="build_info">
            <code :ref="buildInfo.name">
                <div v-for="(line, index) in buildInfo.log" :key="index">
                    <div class="line_number">{{ index + 1 }}</div>
                    <div class="text_holder">{{ line }}</div>
                </div>
                <div v-if="buildInfo.status === 'running'" class="loader_log">
                    <div class="text_holder">
                        <font-awesome-icon :icon="['fas', 'spinner']" spin /> Running...
                    </div>
                </div>
                <div v-else-if="buildInfo.log.length === 0" class="loader_log">
                    <div class="text_holder">
                        <font-awesome-icon :icon="['fas', 'ghost']" /> No Logs
                    </div>
                </div>
            </code>
            <aside class="build_info_card">
                <h3>{{ buildInfo.name }}</h3>
                <div><b>Status:</b> <Tag :type="buildInfo.status" :value="buildInfo.status" /></div>
                <div><b>Duration:</b> {{ formatSeconds(buildInfo.duration) }}</div>
                <div><b>Started Date:</b> {{ unixTimestampToFormattedString(buildInfo.created_at) }}</div>
            </aside>
        </div>
    </div>
    
</template> 

<script>
import Table from '../../components/Table.vue';
import Button from '../../components/Button.vue';
import ButtonSet from '../../components/ButtonSet.vue';
import Tag from '../../components/Tag.vue';
import Column from '../../components/Column.vue';
import TabView from '../../components/TabView.vue';
import Tab from '../../components/Tab.vue';
import { useNotifyStore } from '../../stores/notifications'

export default {
    components: {
        Table,
        Button,
        ButtonSet,
        Tag,
        Column,
        TabView,
        Tab
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
            }
        }
    },
    methods: {
        async loadData() {
            try {
                const response = await this.axios.get(
                `${this.backendUrl}/pipelines/jenkins/${this.$route.params.pipeline_id}/builds/${this.$route.params.build_id}`
                );
                
                this.buildInfo = response.data.data;
                this.scrollToBottom()
            } catch (error) {
                useNotifyStore().add('error', 'Error loading data!');
            }

            this.isLoading = false
        },
        async refreshRunningBuild(){
            if(this.buildInfo.status !== 'running' && this.buildInfo.status !== 'created'){
                return
            }

            this.interval = setInterval(async () => {
                await this.loadData()
                if(this.buildInfo.status !== 'running' && this.buildInfo.status !== 'created'){
                    clearInterval(this.interval)
                }
            }, 5000);
        },
        
        scrollToBottom() {
            console.log(this.$refs)
            if (this.$refs[this.buildInfo.name]) {
                this.$refs[this.buildInfo.name][0].scrollTop = this.$refs[this.buildInfo.name][0].scrollHeight;
            }
        },
    },
    async created() {
        await this.loadData()
        await this.refreshRunningBuild()
    },
    unmounted() {
        clearInterval(this.interval)
    },
}
</script>

<style scoped>
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