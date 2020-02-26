<!--关于网站-->
<template>
    <div>
        <!--整个页面-->
        <el-container>
            <el-header height="100px">
                <!--页头-->
                <el-page-header @back="goBack" content="关于平台">
                </el-page-header>
            </el-header>
            <el-container>
                <el-aside width="250px">
                    <el-menu :default-openeds="['1', '3']">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-message"></i>导航一</template>
                            <el-menu-item-group>
                                <template slot="title">分组一</template>
                                <el-menu-item index="1-1">选项1</el-menu-item>
                                <el-menu-item index="1-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="1-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="1-4">
                                <template slot="title">选项4</template>
                                <el-menu-item index="1-4-1">选项4-1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title"><i class="el-icon-menu"></i>导航二</template>
                            <el-menu-item-group>
                                <template slot="title">分组一</template>
                                <el-menu-item index="2-1">选项1</el-menu-item>
                                <el-menu-item index="2-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="2-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="2-4">
                                <template slot="title">选项4</template>
                                <el-menu-item index="2-4-1">选项4-1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title"><i class="el-icon-setting"></i>导航三</template>
                            <el-menu-item-group>
                                <template slot="title">分组一</template>
                                <el-menu-item index="3-1">选项1</el-menu-item>
                                <el-menu-item index="3-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="3-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="3-4">
                                <template slot="title">选项4</template>
                                <el-menu-item index="3-4-1">选项4-1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <h3>Main - 内容</h3>
                        <ol>
                            <li>我们承诺：对平台严格监管</li>
                            <li>平台专注招聘/求职</li>
                            <li>从服务器——一服务多的角度思考问题，设计数据表</li>
                            <li>面向多家企业的求职网站难以避免大杂烩，比不上企业校招官网</li>
                            <li>求职者奔公司去的</li>
                            <li>服务端不关心求职者所在地，关心其目标城市</li>
                            <li>企业需要宣传</li>
                            <li>职位可以由一或多个岗位组成</li>
                            <li>企业发布职位是从职位表枚举表选取职位，不能新造职位</li>
                            <li>职位：生产+消费，企业发布职位，求职者申请职位</li>
                            <li>填写/上传简历</li>
                            <li>越少层的页面越好</li>
                            <li>客户间私聊</li>
                            <li>用户身份要认证，如：求职者，hr</li>
                            <li>单点登录</li>
                            <li>显示信息很重要</li>
                            <li>注销：退出登录</li>
                        </ol>
                    </el-main>

                    <el-main>
                        <h3>something</h3>
                        <dl>
                            <dt>微软</dt>
                            <dd>Windows</dd>
                            <dd>Office</dd>
                            <dd>GitHub</dd>
                            <dt>苹果</dt>
                            <dd>iPhone</dd>
                            <dd>iOS</dd>
                            <dt>Google</dt>
                            <dd>Linux</dd>
                            <dd>Android</dd>
                            <dt>亚马逊</dt>
                            <dt>Facebook</dt>
                            <dt>IBM</dt>
                            <dt>甲骨文</dt>
                            <dd>Java</dd>
                            <dd>数据库</dd>
                            <dt>高通公司</dt>
                            <dd>骁龙手机CPU芯片</dd>
                            <dt>英特尔</dt>
                            <dd>PC机CPU芯片</dd>
                            <dt>波音公司</dt>
                        </dl>
                    </el-main>
                </el-container>
            </el-container>
            <el-footer height="100px">
                <h3>Footer</h3>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "about",
        data() {
            return {};
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
        border: 1px solid black;
        margin: 5px 5px 5px 5px;
    }
    .el-aside {
        height: 1000px;
    }
    .el-header div{
        /*el-header div这个div的内容的行高*/
        line-height: 100px;
    }
</style>
