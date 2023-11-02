import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Pipelines from "../views/Pipelines.vue";
import SinglePipeline from "../views/SinglePipeline/Main.vue"
import SingleBuildGit from "../views/SinglePipeline/SingleBuildGit.vue"
import SingleBuildJenkins from "../views/SinglePipeline/SingleBuildJenkins.vue"
import AccessRoles from "../views/AccessRoles.vue";
import SingleRole from "../views/SingleRole/Main.vue"
import Users from "../views/Users.vue";
import SingleUser from "../views/SingleUser/Main.vue"
import Applications from "../views/Applications.vue";
import Settings from "../views/Settings.vue";


const routes = [
  { path: "/login", component: Login },
  {path: "/",
    redirect: to => {
      return {path: `/pipelines`}
    }
  },
  { path: "/pipelines", component: Pipelines },
  {
    path: "/pipelines/:application/:pipeline_id",
    name: "SinglePipeline",
    component: SinglePipeline
  },
  {
    path: "/pipelines/Jenkins/:pipeline_id/builds/:build_id",
    name: "SingleBuildJenkins",
    component: SingleBuildJenkins
  },
  {
    path: "/pipelines/:application/:pipeline_id/builds/:build_id",
    name: "SingleBuildGit",
    component: SingleBuildGit
  },
  { path: "/access_roles", component: AccessRoles },
  {
    path: "/access_roles/:roleId",
    name: "SingleRole",
    component: SingleRole
  },
  { path: "/users", component: Users },
  {
    path: "/users/:user_id",
    name: "SingleUser",
    component: SingleUser
  },
  { path: "/applications", component: Applications },
  { path: "/settings", component: Settings },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
