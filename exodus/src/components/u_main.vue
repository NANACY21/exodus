<!--[求职者主页]也是未登录状态时的默认主页-->
<!--vue.js 2.0要求每个template只能有一个根元素。可以在最外层包一个div来解决这个问题-->
<template>
    <div>
        <el-container>
            <!--头部-->
            <el-header>
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
<!--                走马灯-->
                <el-carousel v-show="adVisible" :interval="2000" arrow="hover" id="el_carousel" height="400px">
<!--                    关闭广告-->
                    <i class="el-icon-circle-close" id="closeAd" @click="closeAd" title="关闭广告"></i>
                    <el-carousel-item v-for="item in 4" :key="item">
                        <img :src="require('../assets/carousel/'+item+'.jpg')" class="carousel_image_type">
                    </el-carousel-item>
                </el-carousel>
<!--                职位列表-->
                <el-tabs v-model="positionCurrentTab" @tab-click="changePositionTab" type="border-card">
                    <el-tab-pane name="first">
                        <span slot="label"><i class="el-icon-magic-stick"></i> 热门职位</span>
                        <el-card class="box-card" shadow="hover" v-for="item in positionList" :key="item">
                            <div slot="header" class="clearfix">
                                <el-row>
                                    <el-col :span="12"><el-link :underline="false" @click="seePosition(item)" title="职位名称">{{item.name}}工程师</el-link></el-col>
                                    <el-col :span="8" offset="4" style="color: coral">
                                        {{(item.salary-item.salaryFloat)/1000+unit}}-{{item.salary/1000+unit}}
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        发布时间：{{item.releaseTime}}
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        经验{{item.workExp}} / {{item.eduBg}}
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-tag>{{item.trade}}</el-tag>
                                    </el-col>
                                </el-row>
                            </div>
                            <el-row>
                                <el-col :span="24">
                                    <el-tag type="success">{{item.companyName}}</el-tag>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-popover
                                        placement="top-start"
                                        title="公司信息"
                                        width="200"
                                        trigger="hover"
                                        :content="item.companyInfo">
                                        <el-button type="text" slot="reference">{{item.companyInfo.substring(0,10)+miss}}</el-button>
                                    </el-popover>
                                </el-col>
                            </el-row>
                        </el-card>
                        <el-card class="box-card" shadow="hover">
                            <el-button @click="releasePositionList" type="text">查看更多职位</el-button>
                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane name="second">
                        <span slot="label"><i class="el-icon-alarm-clock"></i> 最新职位</span>
                        <el-card class="box-card" shadow="hover" v-for="item in latestPositionList" :key="item">
                            <div slot="header" class="clearfix">
                                <el-row>
                                    <el-col :span="12"><el-link :underline="false" @click="seePosition(item)" title="职位名称">{{item.name}}工程师</el-link></el-col>
                                    <el-col :span="8" offset="4" style="color: coral">
                                        {{(item.salary-item.salaryFloat)/1000+unit}}-{{item.salary/1000+unit}}
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        发布时间：{{item.releaseTime}}
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        经验{{item.workExp}} / {{item.eduBg}}
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-tag>{{item.trade}}</el-tag>
                                    </el-col>
                                </el-row>
                            </div>
                            <el-row>
                                <el-col :span="24">
                                    <el-tag type="success">{{item.companyName}}</el-tag>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-popover
                                        placement="top-start"
                                        title="公司信息"
                                        width="200"
                                        trigger="hover"
                                        :content="item.companyInfo">
                                        <el-button type="text" slot="reference">{{item.companyInfo.substring(0,10)+miss}}</el-button>
                                    </el-popover>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane name="third">
                        <span slot="label"><i class="el-icon-check"></i> 为你匹配</span>
                    </el-tab-pane>
                    <el-tab-pane label="选择职位" name="fourth">
                        <el-cascader
                            v-model="value"
                            :options="allTradeTreeRoot"
                            :props="{ expandTrigger: 'hover' }"
                            @change="handleChange"
                            clearable>
                        </el-cascader>
                    </el-tab-pane>
                </el-tabs>

                <!--公司列表-->
                <el-tabs v-model="companyCurrentTab" @tab-click="" type="border-card">
                    <el-tab-pane name="first">
                        <span slot="label"><i class="el-icon-office-building"></i> 互联网公司榜</span>
                        <el-card class="box-card" shadow="hover" v-for="item in companyList" :key="item">
                            <img :src="require('../assets/companyLogo/'+item.id+'.jpg')" class="image">
                            <div>
                                <el-row>
                                    <el-col :span="24"><el-link :underline="false" @click="companyHomePage(item.id)">{{item.name}}</el-link></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">{{item.introduction.substring(0,10)+miss}}</el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8">{{ item.positionNum }}<br/>在招职位<el-divider direction="vertical"/></el-col>
                                    <el-col :span="8">{{ item.positionNum }}<br/>面试评价<el-divider direction="vertical"/></el-col>
                                    <el-col :span="8">{{ item.positionNum }}<br/>简历处理率</el-col>
                                </el-row>
                            </div>
                        </el-card>
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
    //该请求是验证是否已登录
    const loginURL = '/isLogged';
    export default {
        // 注册组件
        components: {
            backTop,
            "u_header": u_header,
            "u_footer":u_footer
        },
        name: 'u_main',
        //html加载完成后执行；执行顺序：子组件-父组件
        mounted: function () {
            //加载供搜索的行业、职位
            var _this = this;
            _this.$ajax.get('/getAllTradeTreeRoot').then(function (res) {
                _this.allTradeTreeRoot = res.data;
            }, function (res) {
            });

            //发一个请求判断是否已登录
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                console.log('重新加载了主页');
                console.log('来自后端的数据：');
                console.log(res.data);
                //已登录
                if (res.data.username != null) {
                    console.log('用户已登录');
                    _this.users = res.data;
                    //这时根据用户类型确定用户的主页
                    //招聘者
                    if (_this.users.userType == '2') {
                        console.log('招聘者已登录');
                        //跳转到招聘者主页并携带数据过去
                        _this.$router.push({path: '/e_main', query: {carryData: _this.users}});
                    }
                    // 管理员
                    else if (_this.users.userType == '3') {
                        console.log('管理员已登录');
                        //跳转到管理员主页
                        _this.$router.push('/m_main');
                    }
                }
                //未登录
                else {
                    console.log('用户未登录');
                }
            });

            //默认标签页 卡片 已发布的职位 参数：查询的条数
            _this.$ajax.post('/getReleasePositionList', 1000, {emulateJSON: true}).then(function (res) {
                _this.positionList = res.data;
                console.log('已发布的职位列表');
                console.log(_this.positionList);
            });

            //默认标签页 卡片 公司列表 参数：
            _this.$ajax.post('/companyList', {}, {emulateJSON: true}).then(function (res) {
                _this.companyList = res.data;
                console.log('公司列表');
                console.log(_this.companyList);
            });
        },
        data() {
            return {
                //已发布职位列表
                positionList: [],
                //最新已发布职位列表
                latestPositionList: [],
                //公司列表
                companyList: [],
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
                // 广告走马灯默认显示
                adVisible: true,
                //当前职位标签页
                positionCurrentTab: 'first',
                //当前公司标签页
                companyCurrentTab: 'first',
                value: [],
                //省略字符
                miss: '...',
                //千
                unit: 'k',
                //所有行业树根节点
                allTradeTreeRoot: []
            };
        },

        methods: {
            //查看更多职位
            releasePositionList() {
                console.log('查看更多职位');
            },
            //职位详情页面
            seePosition(item) {
                console.log(item);
                //携带数据
                this.$router.push({path: '/e_position', query: {position: item, action: 'u_see'}});
            },
            //关闭走马灯广告
            closeAd() {
                console.log('关闭了广告');
                this.adVisible = false;
            },
            // 级联选择器选中值变化时触发
            handleChange(value) {
                console.log(value);
            },
            // 切换职位标签页时触发
            changePositionTab(tab, event) {
                // console.log(tab);
                // console.log(tab, event);
                let _this = this;
                if (_this.positionCurrentTab == 'second') {
                    console.log('最新职位！！！！！');
                    //默认标签页 已发布的职位 参数：查询的条数
                    _this.$ajax.post('/getReleasePositionList', 3, {emulateJSON: true}).then(function (res) {
                        _this.latestPositionList = res.data;
                        console.log('最新已发布的职位列表');
                        console.log(_this.latestPositionList);
                        _this.$message({
                            message: '这是最近发布的职位',
                            type: 'success'
                        });
                    }, function (res) {
                    });
                }
            },
            //前往公司主页
            companyHomePage(companyId) {
                this.$router.push({path:'/e_company', query: {companyId: companyId}});
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
        color: red;
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

    .carousel_image_type{
        width: 100%;
    }

    #el_menu,#el_carousel {
        margin: 5px 5px 5px 5px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 320px;
        margin: 10px 10px 10px 10px;
        float: left;
    }
    /*以下的字体 如卡片等*/
    .el-tabs__item,.grid-content a,.el-carousel__item h3,.el-dialog--center .el-dialog__body,.el-input__inner,.el-button,.el-footer .grid-content,.el-footer .grid-content a ,.text,.el-row a{
        font-size: 16px;
    }
    /*公司概要信息列表卡片*/
    .image {
        width: 50%;
        display: block;
        margin-right: auto;
        margin-left: auto;
    }
    .el-row {
        height: 30px;
    }
</style>
