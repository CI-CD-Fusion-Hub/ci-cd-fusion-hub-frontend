<script>
import VAsideMenu from './components/VAsideMenu.vue';
import { useUserStore } from './stores/user';

export default {
  components: { VAsideMenu },
  created() {
    const userInfo = useUserStore();
    if (!window.location.href.includes('/login') && !window.location.href.includes('/logout'))
      userInfo.loadData();
  },
};
</script>

<template>
  <VAsideMenu v-if="!$route.path.includes('login')" />

  <main>
    <router-view />
  </main>

  <VNotification />
</template>

<style>
 aside + main {
  margin: 20px 20px 20px 70px;
  position: relative;
  background-color: var(--main-bg-color);
  overflow-x: hidden;
}

@media only screen and (min-width: 768px) {
  aside + main {
    margin: 20px 20px 20px 220px;
  }
}
</style>
