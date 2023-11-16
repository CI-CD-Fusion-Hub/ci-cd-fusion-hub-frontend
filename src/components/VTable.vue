<script>
import { h, useSlots } from 'vue';
import VRenderColumn from './VRenderColumn.vue';
import VButtonSet from './VButtonSet.vue';
import VButton from './VButton.vue';
import VTextInput from './Form/VTextInput.vue';

export default {
  components: { VButton, VButtonSet, VTextInput, VRenderColumn },
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    showRowIndex: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Boolean,
      default: false,
    },
    pageSize: {
      type: Number,
      default: 15,
    },
    isSearchable: {
      type: Boolean,
      default: false,
    },
    searchInColumns: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      search_text: this.$route?.query.search || '',
      slots: useSlots(),
    };
  },
  computed: {
    get_columns() {
      return this.slots.default().filter((obj) => {
        if (obj.props)
          return true;

        else
          return false;
      });
    },
    total_pages() {
      return Math.round(this.filtered_items.length / this.pageSize) || 1;
    },
    get_active_page() {
      return Number.parseInt(this.$route.query.page) || 1;
    },
    get_page_items() {
      if (this.pagination)
        return this.filtered_items.slice((this.get_active_page - 1) * this.pageSize, this.get_active_page * this.pageSize);

      return this.filtered_items;
    },
    filtered_items() {
      if (this.isSearchable === true) {
        return this.tableData.filter((item) => {
          let item_match = false;
          const search = this.search_text.toLowerCase();

          this.searchInColumns.forEach((element) => {
            if (!(element in item)) {
              console.log('Please, select valid column name that should be used for filtering.');
              return;
            }

            if (item[element].toLowerCase().includes(search))
              item_match = true;
          });

          return item_match;
        });
      }

      return this.tableData;
    },
  },
  methods: {
    vnode(el, row) {
      return h(VRenderColumn, { ...el.props, row }, el.children);
    },
    change_page(n) {
      if (n >= 1 && n <= this.total_pages)
        this.$router.push({ path: this.$route.path, query: Object.assign({}, this.$route.query, { page: n }) });
    },
    filterResults(e) {
      this.$router.push({ path: this.$route.path, query: this.pagination ? { search: e, page: 1 } : { search: e } });

      this.search_text = e.toLowerCase();
    },
  },
};
</script>

<template>
  <div>
    <div v-if="isSearchable" class="table_search">
      <VTextInput
        name="table_search" placeholder="Search" :icon="['fas', 'magnifying-glass']" :data="search_text"
        @keyup.enter="filterResults($event.target.value)"
      />
    </div>
    <table>
      <div v-if="isLoading" class="loader">
        <font-awesome-icon :icon="['fas', 'spinner']" spin />
      </div>
      <thead>
        <tr>
          <th v-if="showRowIndex" class="index_row">
            #
          </th>
          <th v-for="el in get_columns" :key="el.props.header">
            {{ el.props.header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="get_page_items.length === 0">
          <td colspan="100" class="empty_data">
            <font-awesome-icon :icon="['fas', 'ghost']" /> No Data
          </td>
        </tr>
        <tr v-for="(row, index) in get_page_items" :key="row">
          <td v-if="showRowIndex" class="index_row">
            {{ (index + 1) + pageSize * (get_active_page - 1) }}
          </td>
          <td v-for="el in get_columns" :key="`slot-${el.props?.header ?? ''}-${idx}`">
            <template v-if="!el.children">
              {{ row[el.props.value] ?? '' }}
            </template>
            <template v-else-if="el.children">
              <component :is="vnode(el, row)" />
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <nav v-if="pagination && total_pages > 1" class="pagination_holder">
      <VButton :icon="['fas', 'chevron-left']" tooltip-text="Prev" @on-click="change_page(get_active_page - 1)" />
      <VButtonSet>
        <VButton
          v-for="n in total_pages" :key="n" :is-active="get_active_page === n ? true : false"
          @on-click="change_page(n)"
        >
          {{ n }}
        </VButton>
      </VButtonSet>
      <VButton :icon="['fas', 'chevron-right']" tooltip-text="Next" @on-click="change_page(get_active_page + 1)" />
    </nav>
  </div>
</template>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  padding: 15px;
  border-radius: var(--border-radius);
  font-size: 14px;
  position: relative;
  margin-bottom: 10px;
  color: #3e4772;
}

thead {
  border-bottom: solid 2px #b7c6e7;
}

th,
td {
  padding: 5px 2.5px;
  text-align: left;
}

tbody tr:last-child {
  border-radius: 0 0 var(--border-radius) var(--border-radius);
}

tbody tr:nth-child(odd) {
  background-color: #b7c6e7;
}

table .index_row {
  padding: 5px 10px;
  text-align: center;
}

table div.btn-holder {
  margin-top: 0;
}

table .empty_data {
  text-align: center;
  font-weight: 500;
}

.pagination_holder {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.table_search + table,
.table_search + table .loader {
  border-radius: 0 0 var(--border-radius) var(--border-radius);
}

.table_search .input-holder {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

@media only screen and (min-width: 1024px) {
  th,
  td {
    padding: 5px 15px;
  }
}
</style>
