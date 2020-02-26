<!--子组件-页面底部-->
<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple">
                    Copyright&nbsp;&copy;&nbsp;2019-2020&nbsp;Exodus&nbsp;exodus.com&nbsp;All Rights Reserved&nbsp;备案号：京ICP备14023790号-2
                    <el-divider direction="vertical"/>
                    <el-link type="primary" :underline="false" @click="aboutUs">关于Exodus</el-link>
                    <el-divider direction="vertical"/>
                    <i class="el-icon-phone-outline"/>188-4608-1495
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    //该请求是验证是否已登录
    const loginURL = '/isLogged';
    export default {
        name: "footer",
        methods: {
            // 关于我们
            aboutUs() {
                // 发请求
                let _this = this;
                _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                    if (res.data.username != null) {
                        _this.$router.push({path: '/about'});
                    } else {
                        _this.$message({
                            message: '请先登录',
                            type: 'warning',
                        });
                    }
                });
            },
        }
    }
</script>

<style scoped>
</style>
