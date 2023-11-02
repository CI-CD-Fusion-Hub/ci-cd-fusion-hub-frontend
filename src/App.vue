
<script lang="ts">
import { defineComponent } from 'vue';
import AsideMenu from './components/AsideMenu.vue';
import { useUserStore } from './stores/user'

export default defineComponent({
  components: { AsideMenu },
  created() {
    const userInfo = useUserStore()
    if (!window.location.href.includes('/login') && !window.location.href.includes('/logout')){
      userInfo.loadData()
    }
    
  },
});
</script>

<template>
  <AsideMenu v-if="!this.$route.path.includes('login')"/>

  <main>
    <router-view />
  </main>

  <Notification />
</template>

<style>
 aside + main {
  margin: 15px 15px 15px 220px;
  position: relative;
  background-color: var(--main-bg-color);
  overflow-x: hidden;
}
</style>