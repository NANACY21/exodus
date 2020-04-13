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
//消息列表
import chat from "../components/chat";
import u_positionList from "../components/u_positionList";
import myCollect from "../components/myCollect";
import m_picture from "../components/m_picture";
Vue.use(Router);

export default new Router({
    // 新页面在这里注册
    routes: [
        {
            path: '/',
            name: 'u_main',
            component: u_main,
            meta: {
                title: '首页'
            }
        },
        {
            path: '/about',
            name: 'about',
            component: about,
            meta: {
                title: '关于Exodus'
            }
        },
        {
            path: '/e_main',
            name: 'e_main',
            component: e_main,
            meta: {
                title: '企业版首页'
            }
        },
        {
            path: '/m_main',
            name: 'm_main',
            component: m_main,
            meta: {
                title: '管理员首页'
            }
        },
        {
            path: '/setting',
            name: 'setting',
            component: setting,
            meta: {
                title: '账号设置'
            }
        },
        {
            path: '/e_company',
            name: 'e_company',
            component: e_company,
            meta: {
                title: '公司主页'
            }
        },
        {
            path: '/e_position',
            name: 'e_position',
            component: e_position,
            meta: {
                title: '职位卡片'
            }
        },
        {
            path: '/e_positionList',
            name: 'e_positionList',
            component: e_positionList,
            meta: {
                title: '职位列表'
            }
        },
        {
            path: '/u_resume',
            name: 'u_resume',
            component: u_resume,
            meta: {
                title: '简历卡片'
            }
        },
        {
            path: '/chat',
            name: 'chat',
            component: chat,
            meta: {
                title: '聊天'
            }
        },
        {
            path: '/u_positionList',
            name: 'u_positionList',
            component: u_positionList,
            meta: {
                title: '求职者职位列表'
            }
        },
        {
            path: '/myCollect',
            name: 'myCollect',
            component: myCollect,
            meta: {
                title: '我的收藏列表'
            }
        },
        {
            path: '/m_picture',
            name: 'm_picture',
            component: m_picture
        }
    ]
});
// router.beforeEach((to, from, next) => {
//     /* 路由发生变化修改页面title */
//     if (to.meta.title) {
//         document.title = to.meta.title
//     }
//     next()
// });
