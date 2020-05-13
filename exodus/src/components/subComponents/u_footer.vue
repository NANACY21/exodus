<!--子组件-页面底部-->
<template>
    <div>
        <el-row>
            <el-col :span="8">
                <ul>
                    <li><img src="../../assets/logo/logo3.png" style="width: 120px;height: 28px"/></li>
                </ul>
                <ul>
                    <li><i class="ali-icon-location iconS"/>&nbsp;哈尔滨市香坊区旭升南街68号南郡新城</li>
                    <li><i class="ali-icon-phone iconS"/>&nbsp;188 4608 1495</li>
                    <li><i class="ali-icon-email iconS"/>&nbsp;2050761966@qq.com</li>
                </ul>
            </el-col>
            <el-col :span="4">
                <ul class="other">
                    <li><el-link type="primary" href="/">首页</el-link></li>
                    <li><el-link type="success" @click="">联系我们</el-link> </li>
                    <li><el-link type="warning" @click="aboutUs">关于我们</el-link></li>
                </ul>
            </el-col>
            <el-col :span="12">
                <ul class="other">
                    <li>繁星技术有限公司</li>
                    <li>
                        <span>&copy; Copyright 2019-2020 备案号：京ICP备14023790号-2 All Rights Reserved</span>
                    </li>
                </ul>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "footer",
        methods: {
            // 关于我们
            aboutUs() {
                let _this = this;
                if (_this.$route.path === '/about') {
                    _this.$router.go(0);
                    return;
                }
                _this.$router.push({path: '/about'});
            }
        }
    }
</script>

<style scoped>
    li {
        list-style: none;
        height: 35px;
        text-align: left;
    }
    .el-row {
        height: 180px;
        background-color: aliceblue !important;
        color: #475669;
    }
    .other {
        margin-top: 67px;
    }
    li span {
        color: lightgray;
    }
    .ali-icon-location {
        background: url("../../assets/ali-icon/ali-icon-location.png") no-repeat center;
    }
    .ali-icon-phone {
        background: url("../../assets/ali-icon/ali-icon-phone.png") no-repeat center;
    }
    .ali-icon-email {
        background: url("../../assets/ali-icon/ali-icon-email.png") no-repeat center;
    }
    /*图标通用样式*/
    .iconS {
        display: inline-block;
        width: 15px;
        height: 15px;
        background-size: cover;
    }
</style>
