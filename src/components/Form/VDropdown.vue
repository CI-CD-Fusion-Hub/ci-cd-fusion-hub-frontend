<script>
import VButton from '../VButton.vue';

export default {
  component: {
    VButton,
  },
  props: {
    options: {
      type: Array,
      default: () => [],
      required: true,
    },
    optionLabel: {
      type: String,
      default: null,
    },
    optionValue: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: () => [],
    },
    icon: {
      type: Array,
      default: () => ['fas', 'flag'],
    },
    isSearchable: {
      type: Boolean,
      default: false,
    },
    isMultyselect: {
      type: Boolean,
      default: false,
    },
    tooltipText: {
      type: String,
      default: null,
    },
    tooltipPos: {
      type: String,
      default: 'Left',
    },
  },
  emits: ['update:data'],
  data() {
    return {
      isOpen: false,
      dropdownPlaceholder: this.isMultyselect ? this.data : this.placeholder,
      value: this.data?.length > 0 ? this.data : [],
      searchValue: '',
    };
  },
  computed: {
    filterResults() {
      if (!this.options)
        return [];

      return this.options.filter((item) => {
        // Check if items is in already selected items
        if (this.isMultyselect && this.optionLabel !== '')
          return !this.value.includes(item[this.optionValue]) ? item[this.optionLabel].includes(this.searchValue) : false;

        return item.toString().includes(this.searchValue);
      });
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectValue(item) {
      const selectedValue = this.optionLabel && this.optionValue ? item[this.optionValue] : item;
      const selectedLabel = item;

      if (this.isMultyselect) {
        this.value.push(selectedValue);
        this.dropdownPlaceholder.push(selectedLabel);
      }
      else {
        this.value = selectedValue;
        this.dropdownPlaceholder = selectedLabel;
        this.isOpen = false;
      }

      this.$emit('update:data', this.value);
    },
    removeValue(e) {
      this.dropdownPlaceholder = this.dropdownPlaceholder.filter((item) => {
        return item !== e;
      });

      this.value = this.value.filter((item) => {
        return item !== (e[this.optionValue] || e);
      });
    },
    getPlaceHolder(item) {
      const label = this.options.filter((e) => {
        return item === e[this.optionValue];
      });

      return label[0][this.optionLabel];
    },
  },
};
</script>

<template>
  <div
    class="dropdown-holder"
    :tooltip-text="tooltipText"
    :tooltip-position="tooltipPos"
  >
    <a
      href="javascript:;"
      :class="`drop-down-btn is-multyselect-${isMultyselect}`"
      @click="toggleDropdown"
    >
      <font-awesome-icon
        v-if="icon"
        :icon="icon"
      />
      <template v-if="Array.isArray(dropdownPlaceholder)">
        <div
          v-for="item in dropdownPlaceholder"
          :key="item"
          class="dropdown-tag"
        >
          <span v-if="optionLabel">{{ item[optionLabel] || getPlaceHolder(item) }}</span>
          <span v-else>{{ item }}</span>
          <font-awesome-icon
            :icon="['fas', 'xmark']"
            @click.stop="removeValue(item)"
          />
        </div>
        <span v-if="dropdownPlaceholder.length === 0">{{ placeholder }}</span>
      </template>
      <span v-else-if="data?.length > 0">{{ data }}</span>
      <span v-else>{{ dropdownPlaceholder }}</span>
      <font-awesome-icon
        :icon="['fas', 'chevron-down']"
        :class="`is-dropdown-open-${isOpen}`"
      />
    </a>
    <div :class="`is-visible-${isOpen}`">
      <div
        v-if="isSearchable && options.length !== 0"
        class="input-holder"
      >
        <input
          :id="name"
          type="text"
          placeholder=""
          @input="searchValue = $event.target.value"
        >
        <label :for="name">Search</label>
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      </div>
      <ul>
        <li v-if="filterResults.length === 0">
          <div class="no-data">
            <font-awesome-icon :icon="['fas', 'ghost']" />No Data
          </div>
        </li>
        <li
          v-for="item in filterResults"
          :key="item"
        >
          <a
            v-if="optionValue && optionLabel"
            href="javascript:;"
            @click="selectValue(item)"
          >{{ item[optionLabel] }}</a>
          <a
            v-else
            href="javascript:;"
            @click="selectValue(item)"
          >{{ item }}</a>
        </li>
      </ul>
    </div>
    <input
      type="hidden"
      :name="name"
      :value="data"
    >
  </div>
</template>

<style>
.dropdown-holder {
  background-color: var(--main-color-hover);
  color: white;
  border-radius: 5px;
  position: relative;
  margin-bottom: 10px;
}

.dropdown-holder svg {
  font-size: 13px
}

.dropdown-holder a {
  display: block;
}

.dropdown-holder > div > ul {
  transition: max-height 150ms ease-in-out;
  overflow-y: auto;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
}

.dropdown-holder .drop-down-btn {
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
  max-height: 200px;
}

.dropdown-holder .drop-down-btn.is-multyselect-true {
  overflow-y: auto;
}

.dropdown-holder .drop-down-btn svg:first-child {
  padding-left: 5px;
}

.dropdown-holder .drop-down-btn svg:last-child {
  margin-left: auto;
}

.dropdown-holder ul a {
  background-color: var(--main-color-hover);
  padding: 6px 15px;
  transition: background-color 300ms ease-in-out;
  display: flex;
  gap: 5px;
  align-content: center;
}
.dropdown-holder ul a:hover,
.dropdown-holder ul li.active a {
  background-color: var(--main-color);
}

.dropdown-holder div.is-visible-true ul{
  max-height: 200px;
  border: solid 2px var(--main-color-hover);
}
.dropdown-holder div.is-visible-false ul {
  max-height: 0;
}

.dropdown-holder .is-dropdown-open-false {
  transform: rotateZ(0deg);
  transition: transform 150ms ease-in-out;
}
.dropdown-holder .is-dropdown-open-true {
  transform: rotateZ(-90deg);
}

.dropdown-holder .input-holder {
  margin-bottom: 0;
  display: none;
  border-bottom: solid 2px var(--main-color);
  border-radius: 0;
  gap: 10px;
}

.dropdown-holder .input-holder label {
  padding-left: 33px;
}

.dropdown-holder div.is-visible-true .input-holder {
  display: flex;
}

.dropdown-holder div .input-holder input {
  padding: 6px 0;
  width: 100%;
}

.dropdown-holder div .input-holder input,
.dropdown-holder div .input-holder label {
  font-size: 13px;
}

.dropdown-holder .no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
}

.dropdown-holder .dropdown-tag {
  padding: 5px 10px;
  background-color: gray;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-holder .dropdown-tag svg {
  width: 10px;
  height: 10px;
  padding: 5px 5px;
  border-radius: 50%;
  background-color: var(--main-color);
  transition: background-color 300ms ease-in-out;
}

.dropdown-holder .dropdown-tag svg:hover {
  background-color: red;
}
</style>
