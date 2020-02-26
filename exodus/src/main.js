// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//整合ElementUI
import ElementUI from 'element-ui' //新添加
import 'element-ui/lib/theme-chalk/index.css';
import u_main from "./components/u_main"; //新添加，避免后期打包样式不同，要放在import
// import baseUrl from './components/u_main'
import axios from 'axios'
import VueAxios from "vue-axios";
import qs from 'qs';
import md5 from 'js-md5';
//引入jq
import $ from 'jquery'
import htmlToPdf from "./util/htmlToPdf";
import Print from 'vue-print-nb'
// main.js是我们的入口文件，主要作用是初始化vue实例，并引入所需要的插件
Vue.config.productionTip = false;
//新添加
Vue.use(ElementUI);
Vue.use(htmlToPdf);
Vue.use(Print);
// Vue.prototype.$http = axios;
//跨域请求
Vue.prototype.$ajax = axios;
Vue.prototype.$qs = qs;

//axios配置

//响应时间 30秒
axios.defaults.timeout = 30000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

/**
 * 跨域 session问题
 * @type {boolean}
 */
axios.defaults.withCredentials = true;
//后端地址
axios.defaults.baseURL = 'http://localhost:8088/';

/* eslint-disable no-new */
// 每个 Vue 应用都是通过 Vue 函数创建一个新的 Vue 实例开始的
//并不会自动跳转至任何页面，
new Vue({
    // 提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。可以是 CSS 选择器，也可以是一个 HTMLElement 实例
    el: '#app',
    router,
    components: {App},
    // components: { components: u_main },
    template: '<App/>'
});
