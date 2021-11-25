import { createApp } from "vue";
import App from "./App.vue";

import Cookies from 'js-cookie'
import ElementPlus from 'element-plus';

import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'

const app = createApp(App)

app.use(ElementPlus, {
    locale,
    size: Cookies.get('size') || 'medium'
})

app.mount("#app");
