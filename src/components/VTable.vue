<template>
  <div>
    <div
      v-if="isSearchable"
      class="table_search"
    >
      <VTextInput
        name="table_search"
        placeholder="Search"
        :icon="['fas', 'magnifying-glass']"
        :data="search_text"
        @keyup.enter="filterResults($event.target.value)"
      />
    </div>
    <div>
      <table>
        <div
          v-if="isLoading"
          class="loader"
        >
          <font-awesome-icon
            :icon="['fas', 'spinner']"
            spin
          />
        </div>
        <thead>
          <tr>
            <th
              v-if="showRowIndex"
              class="index_row"
            >
              #
            </th>
            <template v-for="slot in get_slots">
              <th
                v-for="column in $slots[slot]()"
                :key="column.value"
              >
                {{ column.props ? column.props.header : '' }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-if="get_page_items.length === 0">
            <td
              colspan="100"
              class="empty_data"
            >
              <font-awesome-icon :icon="['fas', 'ghost']" /> No Data
            </td>
          </tr>
          <tr
            v-for="(row, index) in get_page_items"
            :key="row"
          >
            <td
              v-if="showRowIndex"
              class="index_row"
            >
              {{ (index + 1) + pageSize * (get_active_page - 1) }}
            </td>
            <template
              v-for="slot in get_slots"
              :key="slot"
            >
              <template
                v-for="column in $slots[slot]()"
                :key="column.id"
              >
                <td v-if="!column.children && column.props.value">
                  {{ row[column.props.value] }}
                </td>
                <slot
                  :name="column.props.value"
                  :item="row"
                />
              </template>
            </template>
          </tr>
        </tbody>
      </table>

      <nav
        v-if="pagination && total_pages > 1"
        class="pagination_holder"
      >
        <VButton
          :icon="['fas', 'chevron-left']"
          tooltip-text="Prev"
          @on-click="change_page(get_active_page - 1)"
        />
        <VButtonSet>
          <VButton
            v-for="n in total_pages"
            :key="n"
            :is-active="get_active_page === n ? true : false"
            @on-click="change_page(n)"
          >
            {{ n }}
          </VButton>
        </VButtonSet>
        <VButton
          :icon="['fas', 'chevron-right']"
          tooltip-text="Next"
          @on-click="change_page(get_active_page + 1)"
        />
      </nav>
    </div>
  </div>
</template>

<script>
import VButtonSet from './VButtonSet.vue';
import VButton from './VButton.vue';
import VTextInput from './Form/VTextInput.vue';

export default {
  components: { VButton, VButtonSet, VTextInput },
  props: {
    tableData: {
      type: Array,
      default: () => []
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
      search_text: this.$route?.query.search || ''
    }
  },
  computed: {
    total_pages() {
      return Math.round(this.filtered_items.length / this.pageSize) || 1;
    },
    get_active_page() {
      return parseInt(this.$route.query.page) || 1;
    },
    get_slots() {
      let slots = Object.keys(this.$slots);

      if (slots.includes('default')) {
        slots = slots.filter(function(e) { return e !== 'default'; });
        slots.unshift('default');
      }

      return slots;
    },
    get_page_items() {
      if (this.pagination){
        return this.filtered_items.slice((this.get_active_page - 1) * this.pageSize, this.get_active_page * this.pageSize);
      }
      return this.filtered_items
    },
    filtered_items() {
      if(this.isSearchable === true) {
        return this.tableData.filter((item) => {
          let item_match = false;
          let search = this.search_text.toLowerCase()
          
          this.searchInColumns.forEach(element => {
            if (!(element in item)){
              console.log("Please, select valid column name that should be used for filtering.")
              return
            }

            if (item[element].toLowerCase().includes(search)) {
              item_match = true;
              return
            }
          });

          return item_match
        })
      }

      return this.tableData
    }
  },
  methods: {
    change_page(n) {
      if (n >= 1 && n <= this.total_pages) {
        this.$router.push({ path: this.$route.path, query: Object.assign({}, this.$route.query, { page: n }) });
      }
    },
    filterResults(e) {
      this.$router.push({ path: this.$route.path, query: this.pagination ? { search: e, page: 1 } :  { search: e}});

      this.search_text = e.toLowerCase()
    },
  },
};
</script>


<style>
.loader {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: #b7c6e7;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  align-content: center;
  text-align: center;
  justify-content: space-evenly;
  font-size: 20px;
  color: white;
  z-index: 9;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  padding: 15px;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px #00000014;
  font-size: 14px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
  color: #3e4772;
}

thead {
  border-bottom: solid 2px #b7c6e7;
}

th, td {
  padding: 5px 15px;
  text-align: left;
}

tbody tr:nth-child(odd) {
  background-color: #b7c6e7;
}

table .index_row {
  max-width: 55px;
  width: 30px;
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

.table_search + div table {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.table_search .input-holder {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
