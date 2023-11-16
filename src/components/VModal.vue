<script>
import VButton from './VButton.vue';

export default {
  components: { VButton },
  props: {
    header: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:isActive'],
  computed: {
    is_visible() {
      return this.isActive;
    },
  },
  methods: {
    close_modal() {
      this.$emit('update:isActive', false);
    },
  },
};
</script>

<template>
  <div
    v-if="is_visible"
    class="modal-holder"
  >
    <div class="modal-container">
      <VButton
        :icon="['fas', 'xmark']"
        class="btn-modal-close"
        tooltip-text="Close"
        @on-click="close_modal"
      />
      <h2 v-if="header !== ''">
        {{ header }}
      </h2>
      <slot />
    </div>
  </div>
</template>

<style>
.modal-holder {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #00000073;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-holder > div {
  padding: 20px;
  border-radius: var(--border-radius);
  background-color: var(--main-color);
  position: relative;
  width: 400px;
}

.modal-holder .btn-modal-close {
  position: absolute;
  top: -15px;
  right: -15px;
}

.modal-holder .btn-modal-close:hover button{
  background-color: red;
  color: white;
}

.modal-holder .btn-modal-close button {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  text-align: center;
  border: solid 1px white;
}

.modal-holder .input-holder[tooltip-text]::after,
.modal-holder .dropdown-holder[tooltip-text]::after{
  line-height: 16px;
  padding: 8px;
  width: 80%;
}

.modal-holder .btn-set-holder button {
  border-top: solid 1px white;
  border-bottom: solid 1px white;
}
.modal-holder .btn-set-holder .btn-holder:first-child button {
  border-left: solid 1px white;
}
.modal-holder .btn-set-holder .btn-holder:last-child button {
  border-right: solid 1px white;
}

.modal-container > .btn-holder button {
  border: solid 1px white;
}

@media only screen and (max-width: 500px) {
  .modal-holder > div {
    width: 300px;
  }
}
</style>
