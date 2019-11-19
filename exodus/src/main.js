// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui' //新添加
import 'element-ui/lib/theme-chalk/index.css';
import HelloWorld from "./components/HelloWorld"; //新添加，避免后期打包样式不同，要放在import
// import baseUrl from './components/HelloWorld'

// main.js是我们的入口文件，主要作用是初始化vue实例，并引入所需要的插件
Vue.config.productionTip = false
Vue.use(ElementUI)   //新添加

/* eslint-disable no-new */
new Vue({
  el: '#nancy',
  router,
  components: { App },
  // components: { components: HelloWorld },
  template: '<App/>'
})
