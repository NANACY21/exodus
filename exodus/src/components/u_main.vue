<!--[求职者主页]也是未登录状态时的默认主页-->
<!--vue.js 2.0要求每个template只能有一个根元素。可以在最外层包一个div来解决这个问题-->
<template>
    <div>
        <el-container>
            <!--头部-->
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="14">
                        <!--走马灯-->
                        <el-carousel v-show="adVisible" :interval="2000" arrow="hover" id="el_carousel" height="400px">
                            <!--关闭广告-->
                            <el-button icon="el-icon-close" id="closeAd" @click="closeAd" title="关闭广告" type="danger" plain/>
                            <el-carousel-item v-for="item in 4" :key="item">
                                <img :src="require('../assets/ad/'+item+'.jpg')" class="carousel_image_type">
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                    <el-col :span="10">
                    </el-col>
                </el-row>
                <!--职位列表-->
                <el-tabs v-model="positionCurrentTab" @tab-click="changePositionTab" >
                    <el-tab-pane name="first">
                        <span slot="label">
                            24Hour热门
                        </span>
                        <component :is="positionListComponent"/>
                    </el-tab-pane>
                    <el-tab-pane name="second">
                        <span slot="label">
                            最新职位
                        </span>
                        <component :is="positionListComponent"/>
                    </el-tab-pane>
                    <el-tab-pane name="third">
                        <span slot="label">
                            为你匹配
                        </span>
                    </el-tab-pane>
                    <el-tab-pane name="fourth">
                        <span slot="label">
                            查看更多
                        </span>
                    </el-tab-pane>
                </el-tabs>

                <!--公司列表-->
                <el-tabs v-model="companyCurrentTab" @tab-click="">
                    <el-tab-pane name="first">
                        <span slot="label">
                            互联网公司榜
                        </span>
                        <component :is="companyListComponent"/>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
            <el-footer>
                <component :is="footerComponent"/>
            </el-footer>
        </el-container>

        <!--返回顶部-->
        <back-top/>
    </div>
</template>

<script>
    // 引入组件
    import u_header from "./subComponents/u_header";
    import backTop from "./subComponents/backTop";
    import u_footer from "./subComponents/u_footer";
    import positionList from "./subComponents/positionList";
    import companyList from "./subComponents/companyList";
    //该请求是验证是否已登录
    const loginURL = '/isLogged';
    export default {
        // 注册组件
        components: {
            backTop,
            "u_header": u_header,
            "u_footer": u_footer,
            "positionList": positionList,
            "companyList": companyList
        },
        name: 'u_main',
        //html加载完成后执行；执行顺序：子组件-父组件
        mounted: function () {
            let _this = this;

            //发一个请求判断是否已登录
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                let backStage = res.data;
                console.log('重新加载了主页');
                console.log('来自后端的数据：');
                console.log(backStage);
                //已登录
                if (backStage != '') {
                    console.log('用户已登录');
                    _this.users = backStage;
                    let userType = _this.users.userType;
                    //这时根据用户类型确定用户的主页
                    //招聘者
                    if (userType == '2') {
                        console.log('招聘者已登录');
                        //跳转到招聘者主页并携带数据过去
                        _this.$router.push({path: '/e_main'});
                    }
                    // 管理员
                    else if (userType == '3') {
                        console.log('管理员已登录');
                        //跳转到管理员主页
                        _this.$router.push('/m_main');
                    }
                    return;
                }
                console.log('用户未登录');
            });
        },
        data() {
            return {
                //该数据要传给[已登录]子组件 当前已登录的用户
                users: {
                    //用户名
                    username: '',
                    //用户类型
                    userType: ''
                },
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
                //职位列表组件
                positionListComponent: 'positionList',
                //公司列表组件
                companyListComponent: 'companyList',
                // 广告走马灯默认显示
                adVisible: true,
                //当前职位标签页
                positionCurrentTab: 'first',
                //当前公司标签页
                companyCurrentTab: 'first'
            };
        },

        methods: {
            //关闭走马灯广告
            closeAd() {
                console.log('关闭了广告');
                this.adVisible = false;
            },

            // 切换职位标签页时触发
            changePositionTab(tab, event) {
                let _this = this;
                // console.log(tab);
                // console.log(tab, event);
                // 查看更多职位
                if (_this.positionCurrentTab === 'fourth') {
                    _this.$router.push({path: '/u_positionList'});
                }
            }
        }
    };
</script>
<!--局部引用-->
<style scoped>
    /*走马灯*/
    /*关闭广告*/
    #closeAd {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 2000;
        display: none;
        /*背景透明*/
        background: transparent;
        /*边框透明*/
        /*border-width: 0px;*/
        /*点击后没边框*/
        /*outline: none;*/
    }
    .el-carousel__item h3 {
        color: #475669;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }

    .carousel_image_type {
        width: 100%;
    }

    #el_menu,#el_carousel {
        margin: 5px 5px 5px 5px;
    }

    /*以下的字体 如卡片等*/
    .el-tabs__item,
    .grid-content a,
    .el-carousel__item h3,
    .el-dialog--center .el-dialog__body,
    .el-input__inner,
    .el-button,
    .el-footer .grid-content,
    .el-footer .grid-content a,
    .text,
    .el-row a {
        font-size: 16px;
    }
    .el-tabs {
        width: 1370px;
        margin-left: auto;
        margin-right: auto;
    }
    .el-carousel :hover #closeAd {
        display: block;
    }
</style>
