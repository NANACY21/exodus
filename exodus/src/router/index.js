import Vue from 'vue';
//关于该网站
import about from "../components/about";
import Router from 'vue-router';
//求职者
import u_main from '@/components/u_main';
//招聘者
import e_main from "../components/e_main";
//管理员
import m_main from "../components/m_main";
//账号设置
import setting from "../components/setting";
//公司信息
import e_company from "../components/e_company";
import e_position from "../components/e_position";
import e_positionList from "../components/e_positionList";
import u_resume from "../components/u_resume";
import messageList from "../components/messageList";
Vue.use(Router);

export default new Router({
    // 新页面在这里注册
    routes: [
        {
            path: '/',
            name: 'u_main',
            component: u_main
        },
        {
            path: '/about',
            name: 'about',
            component: about
        },
        {
            path: '/e_main',
            name: 'e_main',
            component: e_main
        },
        {
            path: '/m_main',
            name: 'm_main',
            component: m_main
        },
        {
            path: '/setting',
            name: 'setting',
            component: setting
        },
        {
            path: '/e_company',
            name: 'e_company',
            component: e_company
        },
        {
            path: '/e_position',
            name: 'e_position',
            component: e_position
        },
        {
            path: '/e_positionList',
            name: 'e_positionList',
            component: e_positionList
        },
        {
            path: '/u_resume',
            name: 'u_resume',
            component: u_resume
        },
        {
            path: '/messageList',
            name: 'messageList',
            component: messageList
        }
    ]
});
