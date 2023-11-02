<template>
    <aside class="aside_menu">
        <ul>
            <template v-for="route in asideMenuRoutes" :key="route">
                <li v-if="route.requiredAccessLevel.includes(userInfo.accessLevel)">
                    <router-link v-if="route.label !== 'Logout'" :to="route.path" :class="{ 'active': $route.path.startsWith(route.path) }">
                        <font-awesome-icon :icon="route.icon" />
                        <span>{{ route.label }}</span>
                    </router-link>
                    <router-link v-else @click="logout" :to="route.path" :class="{ 'active': $route.path.startsWith(route.path) }">
                        <font-awesome-icon :icon="route.icon" />
                        <span>{{ route.label }}</span>
                    </router-link>
                </li>
            </template>
        </ul>
    </aside>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useNotifyStore } from '../stores/notifications'
import { useUserStore } from '../stores/user'

export default defineComponent({
  props: {},
  data() {
    return {
        backendUrl: import.meta.env.VITE_backendUrl,
        userInfo: useUserStore(),
        asideMenuRoutes: [
            {
                path: '/pipelines',
                icon: ['fas', 'sitemap'],
                label: 'Pipelines',
                requiredAccessLevel: ['User', 'Admin']
            },
            {
                path: '/access_roles',
                icon: ['fas', 'shield-halved'],
                label: 'Access Roles',
                requiredAccessLevel: ['Admin'] 
            },
            {
                path: '/users',
                icon: ['fas', 'users'],
                label: 'Users',
                requiredAccessLevel: ['Admin'] 
            },
            {
                path: '/applications',
                icon: ['fas', 'rocket'],
                label: 'Applications',
                requiredAccessLevel: ['Admin'] 
            },
            {
                path: '/settings',
                icon: ['fas', 'gear'],
                label: 'Settings',
                requiredAccessLevel: ['Admin'] 
            },
            {
                path: '/login',
                icon: ['fas', 'arrow-right-from-bracket'],
                label: 'Logout',
                requiredAccessLevel: ['User', 'Admin'],
            }
        ]
    }
  },
  methods: {
    async logout(){
        try {
            const response = await this.axios({
                method: "post",
                url: `${this.backendUrl}/logout`
            });

            this.$router.push({path: "/login"});
        } catch (error) {
            useNotifyStore().add('error', 'Error loading data!');
        }
    },
  }
});
</script>

<style scoped>
.aside_menu {
    width: 200px;
    height: 100%;
    background-color: var(--main-color);
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    overflow-y: auto;
    box-shadow: 3px 0px 5px #909090;
}

.aside_menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.aside_menu ul li {
    transition: background-color 300ms;
}

.aside_menu ul li:hover,
.aside_menu ul li a.active {
    background-color:var(--main-color-hover);
}

.aside_menu ul li:last-child {
    position: absolute;
    bottom: 0;
    width: 100%;
}

.aside_menu a {
    text-decoration: none;
    color: #fff;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 15px;
}
</style>
