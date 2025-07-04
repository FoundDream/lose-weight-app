import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "./style.less";
import App from "./App.vue";
import { useUserStore } from "./stores/user";
import Varlet from "@varlet/ui";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Varlet);

// 初始化认证状态
const userStore = useUserStore();
userStore.initAuth();

app.mount("#app");
