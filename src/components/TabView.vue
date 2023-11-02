<template>
  <div class="tabs-holder">
    <nav>
        <ButtonSet>
            <template v-for="slot in getSlots" :key="slot">
                <Button v-for="tab in $slots[slot]()" @onClick="changeTab(tab.props.header)" :icon="tab.props.icon" :key="tab" :data-id="tab.props.header" :isActive="isTabActive(tab.props.header)" class="tab-button">{{ tab.props ? tab.props.header : "" }}</Button>
            </template>
        </ButtonSet>
    </nav>
    <div class="tabs">
        <div class="loader" v-if="getSlots.length === 0">
          <font-awesome-icon :icon="['fas', 'spinner']" spin />
        </div>
        <template v-for="slot in getSlots" :key="slot">
            <template v-for="tab in $slots[slot]()" :key="tab.props.header">
                <slot v-if="isTabActive(tab.props.header)" :name="tab.props.header"></slot>
            </template>
        </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonSet from '../components/ButtonSet.vue';
import Button from '../components/Button.vue';

export default defineComponent({
    components: { ButtonSet, Button },
    props: {},
    computed: {
        getSlots(): Object{
            return Object.keys(this.$slots).filter(function(e) { return e !== 'default' })
        },
        activeTab(): String{
            const currentTab = this.$route.query.tab

            if (this.getSlots[0]){
                return currentTab ? currentTab : this.$slots[this.getSlots[0]]()[0].props.header
            } else {
                return ''
            }
        }
    },
    methods: {
        isTabActive(tab: String): boolean {
            return tab === this.activeTab ? true : false
        },
        changeTab(tab: String){
            this.$router.push({path: this.$route.path, query: {tab: tab} });
        }
    },
    created() {
        this.activeTab
    },
});
</script>


<style>
.tabs-holder > nav .btn-holder:first-child button {
    border-bottom-left-radius: 0;
}
.tabs-holder > nav .btn-holder:last-child button {
    border-bottom-right-radius: 0;
}
.tabs-holder > nav .btn-holder.active button {
    background-color: white;
    color: #3e4772;
}
</style>