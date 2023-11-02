<template>
  <div>
    <ConfirmationDialog />
    <Button :icon="['fas', 'xmark']" @onClick="requiredConfirmation(sendRequest)" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useNotifyStore } from '../stores/notifications'
import Button from '../components/Button.vue'
import ConfirmationDialog from '../components/Confirmation.vue'

export default defineComponent({
  components: {
    ConfirmationDialog,Button
  },
  methods: {
    sendRequest(){
      console.log('SENDED')
    }
  },
  created() {
    console.log(this.isConfirmationVisible)
  },
});
</script>
