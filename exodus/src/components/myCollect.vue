<template>
    <div>
        <el-container>
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="4">
                        收藏的职位
                    </el-col>
                </el-row>
                <component v-if="updatePositionListComponent" v-bind:username="username" :is="positionListComponent"/>
            </el-main>
            <el-footer>
                <component :is="footerComponent"/>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import backTop from "./subComponents/backTop";
    import u_header from "./subComponents/u_header";
    import u_footer from "./subComponents/u_footer";
    import positionList from "./subComponents/positionList";

    export default {
        name: "myCollect",
        components: {
            backTop,
            "u_header": u_header,
            "u_footer": u_footer,
            "positionList": positionList
        },
        mounted() {
        },

        data() {
            return {
                username: this.$route.query.username,
                //强制刷新子组件数据 重新渲染 默认加载这个子组件
                updatePositionListComponent: true,
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
                //职位列表组件
                positionListComponent: 'positionList',
            };
        },
        methods: {
            //重新加载职位列表子组件
            refreshPositionListComponent() {
                let _this = this;
                _this.updatePositionListComponent = false;
                _this.$nextTick(() => {
                    _this.updatePositionListComponent = true;
                });
            }
        }
    }
</script>

<style scoped>
    .el-main {
        min-height: calc(100vh - 280px);
    }
    .el-row {
        margin: 10px;
    }

    .el-col {
        text-align: left;
    }
</style>
