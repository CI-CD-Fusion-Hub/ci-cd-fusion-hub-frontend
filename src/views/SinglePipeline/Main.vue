<template>
  <div>
    <Table :tableData="builds" :isLoading="isLoading" :pagination="true" :page_size="20">
        <Column header="#" value="id" />
        <Column header="Commit Message" value="commit_msg" />
        <template #duration="item">
        <Column header="Duration" value="duration">
            {{ formatSeconds(item.item.duration) }}
        </Column>
        </template>
        <template #stages="item" v-if="this.$route.params.application === 'GitLab'" >
        <Column header="Stages" value="stages">
            <Tag :value="stage.name" :type="stage.status" v-for="stage in item.item.stages" />
        </Column>
        </template>
        <template #created_at="item">
        <Column header="Started At" value="created_at">
            {{ unixTimestampToFormattedString(item.item.created_at) }}
        </Column>
        </template>
        <template #status="item">
        <Column header="Status" value="status">
            <Tag :value="item.item.status" :type="item.item.status" />
        </Column>
        </template>
        <template #actions="item">
        <Column header="Actions" value="actions">
        <ButtonSet>
            <Button v-if="item.item.status !== 'running'" :icon="['fas', 'arrows-rotate']" tooltipText="Replay"/>
            <Button v-if="item.item.status == 'running'" :icon="['fas', 'stop']" tooltipText="Stop"/>
            <Button v-if="$route.params.application === 'Jenkins'" :icon="['fas', 'eye']" :linkTo="{name: 'SingleBuild' +  $route.params.application, params: { build_id: item.item.id } }" tooltipText="View"/>
            <Button v-else :icon="['fas', 'eye']" :linkTo="{name: 'SingleBuildGit', params: { build_id: item.item.id, appplication: $route.params.application } }" tooltipText="View"/>
        </ButtonSet>
        </Column>
        </template>
    </Table>
    <Button :icon="['fas', 'fa-play']" @onClick="getPipelineParams" :isLoading="isBtnLoading">Run Pipeline</Button>
    <Modal v-model:isActive="isModalVissible">
        <template v-for="param in getAllParameters" :key="param">
            <TextInput v-if="param.type == 'string' || param.type == 'stringparameterdefinition'" type="text" :name="param.key" :placeholder="param.key" :icon="['fas', 'tag']" v-model:data="formData[param.key]" :tooltipText="param.description" tooltipPos="left"/>
            <TextInput v-if="param.type == 'password'" type="password" :name="param.key" :placeholder="param.key" :icon="['fas', 'fa-key']" v-model:data="formData[param.key]"  :tooltipText="param.description" tooltipPos="left"/>
            <Dropdown v-else-if="param.type == 'choice'" :name="param.key" :placeholder="param.key" :icon="['fas', 'tag']" v-model:data="formData[param.key]" :options="param.value" :tooltipText="param.description" tooltipPos="left"/>
        </template>
        <ButtonSet class="flex-end">
            <Button :icon="['fas', 'fa-play']" @onClick="startPipeline" :isLoading="isModalBtnLoading">Run</Button>
        </ButtonSet>
    </Modal>
  </div>
</template> 

<script lang="ts">
import { defineComponent } from 'vue';
import Table from '../../components/Table.vue';
import Button from '../../components/Button.vue';
import ButtonSet from '../../components/ButtonSet.vue';
import Tag from '../../components/Tag.vue';
import Column from '../../components/Column.vue';
import Modal from '../../components/Modal.vue';
import Dropdown from '../../components/Form/Dropdown.vue';
import TextInput from '../../components/Form/TextInput.vue';
import { useNotifyStore } from '../../stores/notifications'

export default defineComponent({
    components: {
        Table,
        Button,
        ButtonSet,
        Tag,
        Column,
        Modal,
        TextInput,
        Dropdown
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
        }
    },
    computed: {
        getAllParameters(){
            return this.params.filter((item) => {
                if(item.depends_on){
                    const depends_on = Object.keys(item.depends_on)

                    let isActive = depends_on.filter((key) => {
                        if(item.depends_on[key] === this.formData[key]){
                            return true
                        }
                    })

                    if (isActive.length === depends_on.length){
                        return true
                    } else {
                        this.formData[item.key] = null
                    }
                } else {
                    return true
                }
            })
        }
    },
    methods: {
        async loadData() {
            try {
                const response = await this.axios.get(
                `${this.backendUrl}/pipelines/${this.$route.params.application.toLowerCase()}/${this.$route.params.pipeline_id}/builds`
                );
                
                this.builds = response.data.data;
            } catch (error) {
                useNotifyStore().add('error', error.data.message || 'Error loading data!');
            }

            this.isLoading = false
        },
        async getPipelineParams() {
            try {
                this.isBtnLoading = true;

                const response = await this.axios.get(
                `${this.backendUrl}/pipelines/${this.$route.params.application.toLowerCase()}/${this.$route.params.pipeline_id}/params`
                );
                
                this.params = response.data.data;
                this.params.forEach(e => {
                    this.formData[e.key] = null
                });
                
                this.isModalVissible = true;
                this.isBtnLoading = false;
            } catch (error) {
                useNotifyStore().add('error', error.data.message || 'Error loading data!');
            }
        },
        async startPipeline() {
            try {
                this.isModalBtnLoading = true;

                const response = await this.axios({
                    method: "post",
                    url: `${this.backendUrl}/pipelines/${this.$route.params.application.toLowerCase()}/${this.$route.params.pipeline_id}/builds`,
                    data: this.formData,
                });
                
                useNotifyStore().add(response.data.status, response.data.message);
            } catch (error) {
                useNotifyStore().add('error', error.data.message || 'Error loading data!');
            }

            this.isModalVissible = false;
            this.isModalBtnLoading = false;
            await this.loadData()
        },
        async intervalLoadData(){
            this.interval = setInterval(() => {
                this.loadData()
            }, 10000);
        }
    },
    created() {
        this.loadData()
        this.intervalLoadData()
    },
    unmounted() {
        clearInterval(this.interval)
    },
})
</script>
