<script>
import VButtonSet from './VButtonSet.vue';
import VButton from './VButton.vue';

export default {
  components: { VButton, VButtonSet },
  props: {
    message: {
      type: String,
      default: 'Please confirm to proceed.',
    },
  },
};
</script>

<template>
  <div
    v-if="isConfirmationVisible"
    class="modal-holder confirmation"
  >
    <div class="modal-container">
      <div class="conf-icon">
        <font-awesome-icon :icon="['fas', 'fa-question']" />
      </div>
      <h2>Are you sure?</h2>
      <p>{{ message }}</p>
      <div>
        <VButtonSet>
          <VButton
            :icon="['fas', 'check']"
            @on-click="confirmAction"
          >
            Confirm
          </VButton>
          <VButton
            :icon="['fas', 'xmark']"
            @on-click="cancelAction"
          >
            Cancel
          </VButton>
        </VButtonSet>
      </div>
    </div>
  </div>
</template>

<style>
.confirmation {
  text-align: center;
}
.confirmation .btn-set-holder {
  justify-content: center;
}

.confirmation .conf-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -35px;
  width: 100%;
  left: 0;
}

.confirmation .conf-icon svg {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--main-color);
  color: white;
  padding: 20px;
}

.confirmation p,
.confirmation h2{
  color: var(--main-color);
}

.confirmation h2 {
  margin-top: 30px;
}

.confirmation p {
  margin-bottom: 30px;
}
</style>
