<!--关于网站-->
<template>
    <div>
        <!--整个页面-->
        <el-container>
            <el-header height="120px">
                <component :is="headerComponent"/>
            </el-header>
            <el-container>
                <el-aside>
                    <el-menu :default-openeds="['1', '3']">
                        <el-menu-item index="1">
                            承诺
                        </el-menu-item>
                        <el-menu-item index="2">
                            科普
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <p>
                            我们承诺：对平台严格监管，平台获取公司数据都是公开的，平台专注招聘/求职，面向多家企业的求职网站难以避免大杂烩，比不上企业校招官网，我们会精益求精。
                        </p>
                        <p>
                            <el-link href="https://zhidao.baidu.com/question/1859696943038414667.html">产业 行业 职位 岗位4者区别</el-link>
                        </p>
                        <p>
                            <el-link href="https://wenku.baidu.com/view/5df10d6a25c52cc58bd6be95.html">行业分类</el-link>
                        </p>
                    </el-main>
                </el-container>
            </el-container>
            <el-footer height="180px">
                <component :is="footerComponent"/>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import u_footer from "./subComponents/u_footer";
    import u_header from "./subComponents/u_header";
    export default {
        components: {
            "u_header": u_header,
            "u_footer": u_footer
        },
        name: "about",
        data() {
            return {
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
            };
        },
        methods: {
            goBack() {
                this.$router.push('/');
            },
        }
    };
</script>

<style scoped>
    .el-header,.el-aside,.el-main,.el-footer {
        margin: 5px 5px 5px 5px;
    }
    .el-aside {
        height: 1000px;
    }
    .el-header div{
        /*el-header div这个div的内容的行高*/
        line-height: 100px;
    }
    p {
        width: 600px;
        text-align: left;
    }
</style>
