import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { 
faPhone, faSitemap, 
faShieldHalved, faUsers, 
faGear, faArrowRightFromBracket,
faRocket, faSpinner, faPlus, faUserTag, faAt, faKey, 
faChevronDown, faFlag, faFloppyDisk, faPenToSquare, 
faTrash, faEye, faCheck, faGhost, faXmark, faChevronLeft, 
faChevronRight, faMagnifyingGlass, faSquare, faSquareCheck,
faRightToBracket, faPlay, faFilter, faPause, faBan, faSlash,
faArrowsRotate, faStop, faTag, faQuestion
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./assets/css/index.css";
import axios from "./config/axios";
import Notification from './components/Notification.vue';
import { createPinia } from 'pinia'
import * as sharedFunctions from './utils/sharedFunctions';
import ConfirmationDialog from './components/Confirmation.vue';

library.add(faPhone);
library.add(faSitemap);
library.add(faShieldHalved);
library.add(faUsers);
library.add(faGear);
library.add(faArrowRightFromBracket);
library.add(faRocket);
library.add(faSpinner);
library.add(faPlus);
library.add(faUserTag);
library.add(faAt);
library.add(faKey);
library.add(faChevronDown);
library.add(faFlag);
library.add(faFloppyDisk);
library.add(faPenToSquare);
library.add(faTrash);
library.add(faEye);
library.add(faCheck);
library.add(faGhost);
library.add(faXmark);
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faMagnifyingGlass);
library.add(faSquare);
library.add(faSquareCheck);
library.add(faRightToBracket);
library.add(faPlay);
library.add(faFilter);
library.add(faPause);
library.add(faBan);
library.add(faSlash);
library.add(faArrowsRotate);
library.add(faStop);
library.add(faTag);
library.add(faQuestion);

axios.defaults.withCredentials = true;

const pinia = createPinia()
const app = createApp(App);

app
.use(router)
.use(pinia)
.component("font-awesome-icon", FontAwesomeIcon)
.component('Notification', Notification)
.component('ConfirmationDialog', ConfirmationDialog)

app.config.globalProperties.axios = axios;
app.config.globalProperties.unixTimestampToFormattedString = sharedFunctions.unixTimestampToFormattedString;
app.config.globalProperties.formatSeconds = sharedFunctions.formatSeconds;
app.config.globalProperties.requiredConfirmation = sharedFunctions.requiredConfirmation;

app.mount("#app");
