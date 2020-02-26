<!--[通用页面头部子组件]-->
<template>
    <div>
        <el-row>
            <el-col :span="10">
                <div class="grid-content bg-purple">
                    <img src="../../assets/logo/logo.png" style="width: 205px;height: 38px">
                    <img :src="require('../../assets/logo/'+theme+'.png')" style="width: 350px;height: 41px">
                </div>
            </el-col>
            <el-col :span="5" offset="6">
                <div class="grid-content bg-purple">
                    <el-input clearable prop="search" :placeholder="searchTip" v-model="search"/>
                </div>
            </el-col>
            <el-col :span="3">
                <div class="grid-content bg-purple">
                    <!--根据是否已经登录加载不同组件 若已登录则向子组件传数据-->
                    <component v-bind:users="users" :is="loggedComponent"/>
                </div>
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
            var _this = this;
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                _this.theme = 'u_theme';
                _this.searchTip = '搜索职位、公司或地点';
                if (res.data.username == null) {
                    // _this.$router.push('/');
                } else {
                    _this.users = res.data;
                    _this.loggedComponent = 'logged';
                    console.log('页面头部子组件-当前用户：');
                    console.log(_this.users);
                    if (_this.users.userType == '2') {
                        _this.theme = 'e_theme';
                        _this.searchTip = '搜索简历';
                    }
                    else if (_this.users.userType == '3') {
                        _this.theme = 'm_theme';
                    }
                }
            });
        },
        data() {
            return {
                users: {},
                //默认未登录
                loggedComponent: 'unlogged',
                //主题图片
                theme: '',
                //搜索框提示
                searchTip: '',
                //搜索框
                search: ''
            };
        }
    }
</script>

<style lang="scss">
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
    .bg-purple-dark,.bg-purple,.bg-purple-light {
        background: white;
    }
    .grid-content {
        line-height: 60px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: white;
    }
    .grid-content a {
        padding-left: 0px;
    }

    .el-dialog {
        width: 450px;
    }
    .el-dialog__title {
        font-size: 32px;
    }
    .el-dialog--center .el-dialog__body {
        padding: 0px 0px 0px 0px;
    }
    .el-form-item {
        margin-bottom: 20px;
        width: 80%;
        margin-right: auto;
        margin-left: auto;
    }
    .el-dialog__header{
        padding-top: 50px;
        padding-bottom: 50px;
    }
    .el-dialog__footer {
        padding-bottom: 50px;
        margin-bottom: 0px;
    }
    /*文本框、按钮大小*/
    .el-input__inner {
        height: 45px;
        line-height: 45px;
    }
    .el-button {
        height: 45px;
        /*强迫图标居中！！！*/
        padding: 12px 15px;
    }
    .el-select {
        width: 100%;
    }
    /*el-dialog浏览器居中固定*/
    .el-dialog{
        display: flex;
        flex-direction: column;
        margin:0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        /*height:600px;*/
        max-height:calc(100% - 30px);
        max-width:calc(100% - 30px);
    }
    .el-dialog .el-dialog__body{
        flex:1;
        /*overflow: auto;*/
    }
</style>
