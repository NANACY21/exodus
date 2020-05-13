<!--[职位列表子组件] 使用场景：
默认主页（加载最新发布的职位）
求职者的职位列表
我的收藏
求职者全局站内搜索
-->
<template>
    <div>
        <el-card class="position-card" shadow="hover" v-for="item in positionList" :key="item">
            <div slot="header" class="clearfix">
                <el-row>
                    <el-col :span="12" class="contentAtLeft">
                        <el-link :underline="false" @click="seePosition(item)">
                            {{item.name}}
                        </el-link>
                    </el-col>
                    <el-col :span="12" class="contentAtRight">
                        {{(item.salary-item.salaryFloat)/1000+'k'}} - {{item.salary/1000+'k'}}
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20" class="contentAtLeft">
                        <span>{{item.releaseTime}} 发布</span>
                    </el-col>
                    <el-col :span="4" class="contentAt_right">
                        <el-popover
                            placement="right"
                            width="200"
                            trigger="hover">
                            <div>
                                <p>
                                    发布人：{{item.username}}
                                </p>
                                <p>
                                    <i style="color: blue" class="el-icon-document-checked"/>
                                    {{item.auth}}
                                </p>
                                <el-button @click="gochat(item.username)">与他联系</el-button>
                            </div>
                            <el-button class="chatWithHer" slot="reference" icon="el-icon-chat-dot-round" type="text"/>
                        </el-popover>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" class="contentAtLeft">
                        <span>工作经验&emsp;{{item.workExp + ' / ' + item.eduBg}}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20" class="contentAtLeft">
                        行业&emsp;<el-tag class="tradeTag">{{item.trade}}</el-tag>
                    </el-col>
                    <el-col :span="4" class="contentAt_right">
                        <el-button class="chatWithHer" :icon="collectPositionIdList.indexOf(item.id)>-1?icon1:icon2"
                                   :title="collectPositionIdList.indexOf(item.id)?'未收藏':'已收藏'" type="text"
                        @click="collectPosition(item.id)"/>
                    </el-col>
                </el-row>
            </div>
            <el-row class="companyArea">
                <el-col :span="6" class="contentAtLeft">
                    <el-avatar shape="square" v-if="item" :size="50"
                               :src="require('../../assets/companyLogo/'+item.companyId+'.jpg')"
                                @click.native="goCompanyHomePage(item.companyId)"/>
                </el-col>
                <el-col :span="18" class="contentAtLeft">
                    {{item.companyName}}<br/>
                    <el-popover
                        placement="top-start"
                        title="公司信息"
                        width="200"
                        trigger="click"
                        :content="item.companyInfo">
                        <el-button type="text" slot="reference">{{item.companyInfo.substring(0,10)+'...'}}</el-button>
                    </el-popover>
                </el-col>
            </el-row>
        </el-card>

        <el-pagination
            v-show="pageBean.show_el_pagination"
            style="clear: both"
            :title="pageBean.tip"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageBean.currentPage"
            :page-sizes="pageBean.pageSize_web"
            :page-size="pageBean.pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageBean.currentListLength">
        </el-pagination>
    </div>
</template>

<script>
    const loginURL = '/isLogged';
    export default {
        //接收来自父组件的信息
        props: ['currentFilter', 'username'],
        name: "positionList",
        mounted() {
            let _this = this;
            //加载该子组件时必然要加载一下我收藏的职位 https://blog.csdn.net/hanjiangong666/article/details/80366613
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                let backStage = res.data;
                if (backStage == '') {
                    return;
                }
                _this.users = backStage;
                //我收藏的职位列表
                _this.$ajax.post('/collectPositionList', _this.users.username, {emulateJSON: true}).then(function (res) {
                    let temp = res.data;
                    if (temp.length == 0) {
                        return;
                    }
                    for (let i = 0; i < temp.length; i++) {
                        _this.collectPositionIdList.push(temp[i].id);
                    }
                });
            });
            //当前页面
            let currentPath = _this.$route.path;
            // 职位列表子组件 来自父组件的数据[职位列表查询条件]
            if (typeof (_this.currentFilter) != 'undefined') {
                _this.currentFilterNative = _this.currentFilter;
                _this.$set(_this.currentFilterNative, 'currentPage', 1);
                _this.$set(_this.currentFilterNative, 'pageSize', 5);
            }
            if (currentPath == '/') {
                //最新已发布的职位列表 参数：查询条件
                _this.$ajax.post('/getReleasePositionList', _this.currentFilterNative, {emulateJSON: true}).then(function (res) {
                    _this.positionList = res.data;
                });
            }
            else if (currentPath == '/u_positionList') {
                //如果是求职者全局站内搜索的情况
                if (localStorage.getItem('positionList') != null) {
                    console.log('如果是求职者全局站内搜索的情况');
                    _this.positionList = JSON.parse(localStorage.getItem('positionList'));
                    _this.pageBean.show_el_pagination = false;
                    localStorage.removeItem('positionList');
                    return;
                }
                //符合当前查询条件的职位总数
                _this.$ajax.post('/getReleasePositionListLength', _this.currentFilterNative, {emulateJSON: true}).then(function (res) {
                    _this.pageBean.currentListLength = res.data;
                    _this.pageBean.tip = '符合当前条件的职位总数' + _this.pageBean.currentListLength + '个';
                });
                _this.$ajax.post('/getReleasePositionList', _this.currentFilterNative, {emulateJSON: true}).then(function (res) {
                    _this.positionList = res.data;
                });
                _this.pageBean.show_el_pagination = true;
            } else if (currentPath == '/myCollect') {
                //我收藏的职位列表 参数还可以是：跳转页面携带数据接收数据给了子组件
                _this.$ajax.post('/collectPositionList', _this.username, {emulateJSON: true}).then(function (res) {
                    _this.positionList = res.data;
                    if (_this.positionList.length == 0) {
                        _this.$message({type: 'info', message: '没有任何收藏'});
                        return;
                    }
                    for (let i = 0; i < _this.positionList.length; i++) {
                        _this.collectPositionIdList.push(_this.positionList[i].id);
                    }
                });
            }
        },
        data() {
            return {
                users: {},
                //已收藏
                icon1: 'el-icon-star-on',
                //未收藏
                icon2: 'el-icon-star-off',
                // 当前职位列表条件
                currentFilterNative: {
                    //工作地点
                    city: ['全国'],
                    //工作经验
                    workExp: ['不限'],
                    //学历要求
                    eduBg: ['不限'],

                    currentPage: 1,
                    //查询符合条件的职位个数 显示的职位数量 查询条数
                    pageSize: 10
                },
                //已发布职位列表
                positionList: [],
                //我收藏的职位id列表
                collectPositionIdList: [],
                //分页相关
                pageBean: {
                    //显示分页组件
                    show_el_pagination: false,
                    //供选择的每页规格条数
                    pageSize_web: [5, 50, 100, 200],
                    //悬停在分页上时
                    tip: '',
                    //当前列表总长度
                    currentListLength: '',
                    //默认的当前页
                    currentPage: 1,
                    //默认的每页显示的条数
                    pageSize: 5
                },
            };
        },
        methods: {
            //职位详情页面
            seePosition(item) {
                let _this = this;
                console.log(item);
                let collected = _this.collectPositionIdList.indexOf(item.id);
                // 对象转字符串
                let position = JSON.stringify(item);
                //携带数据
                _this.$router.push({
                    name: 'e_position',
                    query: {position: position, action: 'u_see', collected: collected}
                });
            },

            //去聊天 消息通知列表 参数 对方的用户名
            gochat(withUsername) {
                let _this = this;
                console.log(withUsername);
                if (_this.$route.path === '/chat') {
                    //刷新页面
                    _this.$router.go(0);
                    return;
                }
                _this.$router.push({path: '/chat', query: {withUsername: withUsername}});
            },

            //改变每页显示的条数时
            handleSizeChange(val) {
                let _this = this;
                console.log('每页' + val + ' 条');
                _this.$set(_this.pageBean, 'pageSize', val);
                console.log(_this.pageBean);
                _this.currentFilterNative.currentPage = _this.pageBean.currentPage;
                _this.currentFilterNative.pageSize = _this.pageBean.pageSize;
                //发送到后端的数据
                _this.$ajax.post('/getReleasePositionList', _this.currentFilterNative, {emulateJSON: true}).then((res) => {
                    _this.positionList = res.data;
                });
            },
            //当前页改变时
            handleCurrentChange(val) {
                let _this = this;
                console.log('当前页: ' + val);
                _this.$set(_this.pageBean, 'currentPage', val);
                console.log(_this.pageBean);
                _this.currentFilterNative.currentPage = _this.pageBean.currentPage;
                _this.currentFilterNative.pageSize = _this.pageBean.pageSize;
                //发送到后端的数据
                _this.$ajax.post('/getReleasePositionList', _this.currentFilterNative, {emulateJSON: true}).then((res) => {
                    _this.positionList = res.data;
                });
            },

            //收藏该职位/取消收藏该职位
            collectPosition(positionId) {
                let _this = this;
                let map = {
                    "username": _this.users.username,
                    "positionId": positionId
                };
                //登录才能收藏
                if (typeof (_this.users.username) == 'undefined') {
                    _this.$message({type: 'error', message: '请登录'});
                    return;
                }
                _this.$ajax.post('/collectPosition', map, {emulateJSON: true}).then((res) => {
                    _this.$message({type: 'success', message: res.data});
                });
            },

            //公司主页
            goCompanyHomePage(companyId) {
                this.$router.push({path: '/e_company', query: {companyId: companyId}});
            }
        }
    };
</script>

<style scoped>
    /*职位卡片*/
    .clearfix:before, .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .position-card {
        /*这个宽度别变了！！！*/
        width: 320px;
        margin: 10px 10px 10px 10px;
        float: left;
    }
    .el-row {
        height: 30px;
    }
    .el-col span {
        font-size: 14px;
        color: darkgray;
    }
    .companyArea {
        height: 60px;
    }
    .contentAtLeft {
        text-align: left;
        margin-top: 4.5px;
        color: darkblue;
        /*color: darkcyan*/
    }
    .el-link:hover {
        color: darkblue;
    }
    .contentAtRight {
        text-align: right;
        margin-top: 4.5px;
        color: coral;
    }
    .contentAt_right {
        text-align: right;
    }
    .el-button,.el-tag {
        height: 30px;
    }
    .el-button {
        padding: 0px 0px;
        color: darkgrey;
    }
    .el-tag {
        padding: 0px 15px;
        color: darkblue;
        background-color: white;
    }

    /*与招聘者联系图标大小*/
    .chatWithHer {
        color: deeppink;
        font-size: 20px !important;
    }
    /*职位卡片所属行业标签字体大小*/
    .tradeTag {
        font-size: 16px;
    }
    .el-pagination {
        margin: 15px;
    }
    .el-avatar {
        cursor: pointer;
    }
</style>
