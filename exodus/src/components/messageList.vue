<!--消息列表-->
<template>
    <div>
        <el-container>
            <el-header>
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-table
                    v-loading="loading"
                    ref="messageList"
                    :data="messageList"
                    @cell-mouse-enter="atRow"
                    @cell-mouse-leave="atLeave"
                    tooltip-effect="dark"
                    style="width: 100%"
                    row-style="height:50px"
                    :cell-style="addStyle"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        label="来自"
                        width="200">
                        <template slot-scope="scope">
                            <el-link @click="" :underline="false">{{ scope.row.from }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        prop="time"
                        label="时间"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        prop="data"
                        label="消息"
                        width="600">
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer></el-footer>
        </el-container>
    </div>
</template>

<script>
    import u_header from "./subComponents/u_header";
    export default {
        components: {
            "u_header": u_header
        },
        name: "messageList",
        mounted() {
            let _this = this;
            let username = _this.$route.query.username;
            console.log(username);
            if (typeof (username) == 'undefined' || username.length == 0) {
                _this.$message({type: "info", message: '暂无消息'});
                _this.$router.go(-1);
                return;
            }
            //加载消息通知
            _this.$ajax.post('/messageList', username, {emulateJSON: true}).then(function (res) {
                console.log("这个人的消息列表");
                console.log(res.data);
                _this.messageList = res.data;
                _this.loading = false;
            });
        },

        data() {
            return {
                headerComponent: 'u_header',
                //消息列表
                messageList: [],
                // 消息列表表格复选框选中的
                multipleSelection: [],
                //表格加载数据
                loading: true,
            };
        },
        methods: {
            // 点击消息列表表格复选框时
            handleSelectionChange(val) {
                // console.log(val);
                this.multipleSelection = val;
            },
            //鼠标悬停在某一行上
            atRow(index, rowData) {
            },
            //鼠标离开某一行
            atLeave(index, rowData) {

            },
            //加背景色
            addStyle({row, column, rowIndex, columnIndex}) {
                if ((rowIndex % 2) == 1) {
                    return "background:#f0f9eb;";
                }
            }
        }
    }
</script>

<style scoped>

</style>
