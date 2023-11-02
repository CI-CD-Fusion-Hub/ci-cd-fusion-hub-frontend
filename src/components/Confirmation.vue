<template>
  <div class="modal-holder confirmation" v-if="isConfirmationVisible">
    <div class="modal-container">
      <div class="conf-icon"><font-awesome-icon :icon="['fas', 'fa-question']" /></div>
      <h2>Are you sure?</h2>
      <p>{{ message }}</p>
      <div>
        <ButtonSet>
          <Button :icon="['fas', 'check']" @onClick="confirmAction">Confirm</Button>
          <Button :icon="['fas', 'xmark']" @onClick="cancelAction">Cancel</Button>
        </ButtonSet>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonSet from './ButtonSet.vue';
import Button from './Button.vue';

export default defineComponent({
  components: { Button,ButtonSet },
  props: {
    message: {
      type: String,
      default: 'Please confirm to proceed.'
    }
  },
});
</script>


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