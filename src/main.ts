import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "./style.less";
import App from "./App.vue";
import Varlet from "@varlet/ui";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Varlet);

app.mount("#app");
