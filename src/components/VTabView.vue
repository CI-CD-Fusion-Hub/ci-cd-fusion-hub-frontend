<script>
import VButtonSet from './VButtonSet.vue';
import VButton from './VButton.vue';

export default {
  components: { VButtonSet, VButton },
  props: {},
  computed: {
    getSlots() {
      return Object.keys(this.$slots).filter((e) => {
        return e !== 'default';
      });
    },
    activeTab() {
      const currentTab = this.$route.query.tab;

      if (this.getSlots[0])
        return currentTab || this.$slots[this.getSlots[0]]()[0].props.header;
      else
        return '';
    },
  },
  methods: {
    isTabActive(tab) {
      return tab === this.activeTab;
    },
    changeTab(tab) {
      this.$router.push({ path: this.$route.path, query: { tab } });
    },
  },
};
</script>

<template>
  <div class="tabs-holder">
    <nav>
      <VButtonSet>
        <template v-for="slot in getSlots" :key="slot">
          <VButton
            v-for="tab in $slots[slot]()" :key="tab" :icon="tab.props.icon" :data-id="tab.props.header"
            :is-active="isTabActive(tab.props.header)" class="tab-button" @on-click="changeTab(tab.props.header)"
          >
            {{ tab.props ? tab.props.header : "" }}
          </VButton>
        </template>
      </VButtonSet>
    </nav>
    <div class="tabs">
      <div v-if="getSlots.length === 0" class="loader">
        <font-awesome-icon :icon="['fas', 'spinner']" spin />
      </div>
      <template v-for="slot in getSlots" :key="slot">
        <template v-for="tab in $slots[slot]()" :key="tab.props.header">
          <slot v-if="isTabActive(tab.props.header)" :name="tab.props.header" />
        </template>
      </template>
    </div>
  </div>
</template>

<style>
.tabs-holder>nav .btn-holder:first-child button {
  border-bottom-left-radius: 0;
}

.tabs-holder>nav .btn-holder:last-child button {
  border-bottom-right-radius: 0;
}

.tabs-holder>nav .btn-holder.active button {
  background-color: white;
  color: #3e4772;
}
</style>
