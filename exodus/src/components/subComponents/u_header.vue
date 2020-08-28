<!--[通用页面头部子组件]-->
<template>
    <div class="u_header">
        <el-row>
            <el-col :span="10" style="text-align: left">
                <div class="grid-content bg-purple">
                    <img src="../../assets/logo/logo.png" style="width: 205px;height: 38px"/>
                    <img :src="require('../../assets/logo/'+theme+'.png')" style="width: 350px;height: 41px"/>
                </div>
            </el-col>
            <el-col :span="4" :offset="10-colSpan" style="text-align: right">
                <div class="grid-content bg-purple">
                    <!--搜索-->
                    <el-autocomplete
                        clearable
                        prop="searchContent"
                        :placeholder="searchTip"
                        v-model.trim="searchContent"
                        ref="searchContent"
                        @keyup.enter.native="search"
                        prefix-icon="el-icon-search"
                        :fetch-suggestions="querySearch"
                        @select="handleSelect">
                    </el-autocomplete>
                </div>
            </el-col>
            <el-col :span="colSpan" style="text-align: right">
                <div class="grid-content bg-purple">
                    <!--根据是否已经登录加载不同组件 若已登录则向子组件传数据 求职者已登录：u_header组件向logged组件传数据-->
                    <component v-bind:users="users" :is="loggedComponent"/>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item replace v-for="(item,index) in dirPath" :to="{ path: item.path }" :key="item">{{item.title}}</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    //引入组件
    import unlogged from "./unlogged";
    import logged from "./logged";
    const loginURL = '/isLogged';
    export default {
        name: "u_header",
        components: {
            "logged": logged,
            "unlogged": unlogged
        },
        mounted() {
            let _this = this;
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                let backStage = res.data;
                _this.theme = 'u_theme';
                _this.searchTip = '搜索职位、公司或地点';
                if (backStage == '') {
                    // _this.$router.push('/');
                } else {
                    _this.users = backStage;
                    _this.initWebSocket();
                    _this.colSpan = 2;
                    _this.loggedComponent = 'logged';
                    console.log('页面头部子组件-当前用户：');
                    console.log(_this.users);
                    if (_this.users.userType == '2') {
                        _this.theme = 'e_theme';
                        _this.searchTip = '搜索简历';
                    } else if (_this.users.userType == '3') {
                        _this.theme = 'm_theme';
                    }

                    // 加载站内搜索历史记录
                    _this.$ajax.post('/getSearchHistory', _this.users.username, {emulateJSON: true}).then(function (res) {
                        let temp = res.data;
                        console.log('搜索历史');
                        if (temp.length != 0) {
                            for (let i = 0; i < temp.length; i++) {
                                _this.searchHistory.push({
                                    value: temp[i]
                                })
                            }
                            _this.searchHistory.push({
                                value: '清空历史记录'
                            });
                        }
                        console.log(_this.searchHistory);
                    });
                }
            });

            //面包屑相关 https://www.cnblogs.com/houzheng/p/9067110.html
            let path = _this.$route.path;
            let tempDirPath = JSON.parse(localStorage.getItem('dirPath'));
            if (tempDirPath == null) {
                _this.dirPath = [];
                console.log('dirPath:' + _this.dirPath);
                _this.dirPath.push({
                    title: _this.$route.meta.title,
                    path: path
                });
            } else {
                _this.dirPath = tempDirPath;
                for (let i = 0; i < _this.dirPath.length; i++) {
                    if (_this.dirPath[i].path == path) {
                        _this.dirPath.splice(i, 1);
                        break;
                    }
                }
                _this.dirPath.push({
                    title: _this.$route.meta.title,
                    path: path
                });
            }
            localStorage.setItem('dirPath', JSON.stringify(_this.dirPath));
            // _this.dirPath = JSON.parse(localStorage.getItem('dirPath'));
        },
        destroyed() {
            this.webSocket.onclose(undefined);
        },
        watch: {
            //监听全局搜索框输入的内容
            searchContent: {
                handler: function (newVal, oldVal) {
                    let _this = this;
                    if (newVal.includes('清空')) {
                        _this.searchContent = '';
                        _this.$ajax.post('/delSearchHistory', _this.users.username, {emulateJSON: true}).then((res) => {
                            console.log(res.data);
                            _this.searchHistory = [];
                        });
                    }
                }
            }

        },
        data() {
            return {
                //路径
                dirPath: [{
                    title: '',
                    path: ''
                }],
                //连接
                webSocket: '',
                //最后一个col的格数
                colSpan: 3,
                users: {},
                //默认未登录
                loggedComponent: 'unlogged',
                //页面主题图片
                theme: '',
                //搜索框提示
                searchTip: '',
                //搜索的内容
                searchContent: '',
                //站内搜索历史记录 必须有value属性！！！坑
                searchHistory: [{value: ''}]
            };
        },
        methods: {
            //全局站内搜索
            search() {
                let _this = this;
                if (_this.searchContent.length == 0) {
                    return;
                }
                let temp = {
                    "username": _this.users.username,
                    "searchContent": _this.searchContent
                };
                _this.$ajax.post('/globalSearch', temp, {emulateJSON: true}).then((res) => {
                    //搜索到的职位列表
                    let positionList = res.data;
                    //把搜索到的职位列表存起来
                    localStorage.setItem('positionList', JSON.stringify(positionList));
                    if (_this.$route.path === '/u_positionList') {
                        _this.$router.go(0);
                        return;
                    }
                    _this.$router.push({path: '/u_positionList'});
                });
            },
            //站内搜索历史记录相关 该函数 点击搜索框触发
            querySearch(queryString, cb) {
                let _this = this;
                var searchHistory = _this.searchHistory;
                console.log(queryString);
                var results = queryString ? searchHistory.filter(_this.createFilter(queryString)) : searchHistory;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (searchHisto) => {
                    return (searchHisto.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },

            //选择一个历史记录
            handleSelect(item) {
                //多此一举 会自动这样的
                // this.searchContent = item.value;
                this.$refs.searchContent.focus();
            },
            // 进入页面创建websocket连接
            initWebSocket() {
                let _this = this;
                // 判断页面有没有存在websocket连接
                if ('WebSocket' in window && window.WebSocket) {
                    //连接到服务器
                    let serverHost = window.location.hostname;
                    let url = "ws://" + serverHost + ":8088/onlineUser/" + _this.users.username;
                    _this.webSocket = new WebSocket(url);
                    console.log(_this.webSocket);
                    //成功连接OnlineUserServer时
                    _this.webSocket.onopen = function (e) {
                        console.log('成功连接OnlineUserServer');
                    };
                    //OnlineUserServer连接关闭时
                    _this.webSocket.onclose = function (e) {
                        console.log('OnlineUserServer连接关闭');
                    };
                    // OnlineUserServer向指定前端推送消息时
                    _this.webSocket.onmessage = function (res) {

                    };
                    _this.webSocket.onerror = function () {
                        _this.$message({type: 'error', showClose: true, message: "OnlineUserServer连接失败"});
                    };
                } else {
                    _this.$message({type: 'error', showClose: true, message: "当前浏览器不支持聊天"});
                }
            },
        }
    }
</script>

<style lang="scss">
    .u_header {
        background-color: aliceblue;
    }
    /*栅格布局*/
    .el-row,.el-col {
        margin-top: 0px;
        margin-bottom: 0px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    /*img在div垂直居中*/
    .el-header img {
        vertical-align: middle;
    }
    .row-bg {
        padding: 10px 0;
    }
    .grid-content {
        line-height: 60px;
    }
    .grid-content a {
        padding-left: 0px;
    }

    .el-dialog {
        width: 450px;
    }
    .el-dialog--center .el-dialog__body {
        padding: 0px 0px 0px 0px;
    }
    .el-form-item {
        margin-bottom: 25px;
        width: 100%;
        margin-right: auto;
        margin-left: auto;
    }

    /*文本框、按钮大小*/
    .el-input__inner {
        height: 45px;
        line-height: 45px;
    }
    .el-cascader {
        width: 100%;
    }
    /*el-dialog浏览器居中固定*/
    .el-dialog {
        display: flex;
        flex-direction: column;
        margin: 0 !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /*height:600px;*/
        max-height: calc(100% - 30px);
        max-width: calc(100% - 30px);
    }
    .el-dialog .el-dialog__body {
        flex: 1;
        /*overflow: auto;*/
    }

    .el-tabs__item,.el-breadcrumb__inner {
        font-size: 16px;
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__inner {
        color: darkblue;
    }
    .el-breadcrumb__item .el-breadcrumb__inner {
        color: black;
    }
</style>
