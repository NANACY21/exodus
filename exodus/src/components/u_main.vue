<!--
[求职者主页]也是未登录状态时的默认主页
vue.js 2.0要求每个template只能有一个根元素。可以在最外层包一个div来解决这个问题
一个主页，由多个组件组成
求职者主要对象：职位、公司
-->
<template>
    <div>
        <el-container>
            <!--头部-->
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="12">
                        <!--走马灯-->
                        <el-carousel v-show="adVisible" :interval="2000" arrow="hover" id="el_carousel" height="400px">
                            <!--关闭广告-->
                            <el-button icon="el-icon-close" id="closeAd" @click="closeAd" title="关闭广告" type="danger" plain/>
                            <span id="xyhy">坚毅 学习新技术、日语</span>
                            <el-carousel-item v-for="item in adNum" :key="item">
                                <img :src="require('../assets/ad/'+item+'.jpg')" class="carousel_image_type">
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                    <el-col :span="12">
                        <ul class="smallImg" v-on:mouseover="pause" v-on:mouseout="start">
                            <li v-for="item in smallAd.length">
                                <transition name="fade">
                                    <img v-if="showAd" :src="'https://api.mz-moe.cn/img/img'+smallAd[item-1]+'.jpg'" fit="contain"/>
                                </transition>
                            </li>
                        </ul>
                    </el-col>
                </el-row>

                <div id="bill">
                    <!--账单相关 就这一个元素-->
                    <el-cascader
                        title="净收入=总收入-总支出。支付/收入渠道：微信 友空间 支付宝"
                        placeholder="选择某年某月以显示该月账单"
                        filterable
                        v-model="billSelectedMonth"
                        :options="billSelector"
                        :props="{ expandTrigger: 'hover' }"
                        @change="afterBillSelectorChange"
                        clearable/>
                </div>
                <!--促销活动 限时秒杀-->
                <div id="promotion">
                    <h1>今日秒杀</h1>
                </div>

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
                    //这时根据用户类型确定用户的主页 三类用户三类主页，根据cookie加载到对应主页，用户名是唯一键
                    //未登录时是默认主页，只要跳到了招聘者、管理员主页就一定是已登录了
                    let userType = _this.users.userType;
                    //招聘者
                    if (userType == '2') {
                        console.log('招聘者已登录');
                        //招聘者已登录：跳转页面时携带数据到招聘者主页，然后再向子组件传数据
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

            _this.convertSmallAd();
            // 每隔6秒执行一遍函数
            _this.timer = setInterval(_this.convertSmallAd, 6000);
            //页面加载时 加载 账单 级联选择器年月显示项
            _this.getBillDate();
        },
        data() {
            return {
                //发布的广告照片数量
                adNum: 6,
                //用于控制图片显示
                timer: '',
                //是否显示图片
                showAd: true,
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
                companyCurrentTab: 'first',
                // 小广告图片
                smallAd: [5, 6, 7, 8],
                //总收入 弹框对象
                income: null,
                //总支出 弹框对象
                pay: null,
                //净收入 弹框对象
                NetIncome: null,
                //账单 级联选择器的年月显示项
                billSelector: [],
                //账单 级联选择器 选中的值
                billSelectedMonth: ''
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
            },
            //换图片 小广告图片数组 变换 数组里4个元素为1-8
            convertSmallAd() {
                let _this = this;
                _this.showAd = false;
                for (let i = 0; i < _this.smallAd.length; i++) {
                    _this.smallAd.splice(i, 1, Math.floor(Math.random() * 492));
                }
                // 等0.5秒再显示
                setTimeout(() => {
                    _this.showAd = true;
                }, 500);
            },
            pause() {
                clearInterval(this.timer);
            },

            start() {
                //每隔6秒换一次图片
                this.timer = setInterval(this.convertSmallAd, 6000);
            },
            //账单 加载级联选择器年月显示项
            getBillDate() {
                let _this = this;
                _this.$ajax.post('/getBillDate', {}, {emulateJSON: true}).then(function (res) {
                    let backstage = res.data;
                    _this.billSelector = backstage;
                });
            },
            //选择账单月份 级联选择器选中值变化时触发---
            afterBillSelectorChange(value) {
                let _this = this;
                console.log(value);
                let yearmonth = '';
                for (let i = 0; i < value.length; i++) {
                    yearmonth = yearmonth + value[i];
                }
                _this.readBill(yearmonth);
            },
            //读取账单 参数：json数组
            readBill(yearmonth) {
                let _this = this;
                let unit = '元';
                let split = new Array();
                if (_this.income != null) {
                    _this.income.close();
                    _this.pay.close();
                    _this.NetIncome.close();
                }
                _this.$ajax.post('/readBill', yearmonth, {emulateJSON: true}).then(function (res) {
                    let backstage = res.data;
                    split = backstage.split('#');
                    _this.income = _this.$notify({
                        title: '总收入',
                        message: split[0] + unit,
                        type: 'warning',
                        duration: 0,
                        offset: 80,
                    });
                    _this.pay = _this.$notify({
                        title: '总支出',
                        message: split[1] + unit,
                        type: 'error',
                        duration: 0,
                        offset: 160,
                    });
                    _this.NetIncome = _this.$notify({
                        title: '净收入',
                        message: split[2] + unit,
                        type: 'success',
                        duration: 0,
                        offset: 240,
                    });
                });
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
    #xyhy {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 2000;
        font-size: 32px;
        font-family: "KaiTi";
        color: #a0cfff;
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

    /*小广告图片*/
    .smallImg {
        list-style: none;
        margin: 0px;
        padding: 0px;
    }
    .smallImg li {
        float: left;
        margin: 0px;
        padding: 0px;
    }
    .smallImg img {
        height: 200px;
        width: auto;
        max-width: 359px;
        margin: 0px;
        padding: 0px;
        border-right: 4px solid white;
    }
    /*淡入淡出动画*/
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

    /*秒杀促销*/
    #promotion {
        width: 95%;
        height: 500px;
        margin: 20px auto 20px auto;
        background-color: hotpink;
        border-radius: 20px;
    }
    #promotion h1 {
        color: #7bff97;
    }
    #bill {
        width: 300px;
    }
</style>
