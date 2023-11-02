<template>
  <div>
    <VConfirmationDialog />
    <VButton
      :icon="['fas', 'xmark']"
      @on-click="requiredConfirmation(sendRequest)"
    />
  </div>
</template>

<script>
import VButton from '../components/VButton.vue'
import VConfirmationDialog from '../components/VConfirmation.vue'

export default {
  components: {
    VConfirmationDialog,VButton
  },
  created() {
    console.log(this.isConfirmationVisible)
  },
  methods: {
    sendRequest(){
      console.log('SENDED')
    }
  },
};
</script>
