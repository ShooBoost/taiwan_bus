// 引入 leaflet css
import "leaflet/dist/leaflet.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");
