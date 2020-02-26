<!--[招聘者-企业版]主页-->
<template>
    <div>
        <el-container>
            <!--头部-->
            <el-header>
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="6" offset="18">
                        投递到我公司的简历：{{resumeListLength}}个
                    </el-col>
                </el-row>
                <el-table
                    :data="resumeList"
                    style="width: 100%"
                    @cell-mouse-enter="atRow"
                    @cell-mouse-leave="atLeave"
                    row-style="height:80px"
                    :cell-style="addStyle">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="姓名">
                                    <span>{{ scope.row.name }}</span>
                                </el-form-item>
                                <el-form-item label="年龄">
                                    <span>{{ scope.row.age }}</span>
                                </el-form-item>
                                <el-form-item label="邮箱">
                                    <span>{{ scope.row.email }}</span>
                                </el-form-item>
                                <el-form-item label="所在地">
                                    <span>{{ scope.row.location }}</span>
                                </el-form-item>
                                <el-form-item label="求职意向">
                                    <span>{{ scope.row.jobIntent }}</span>
                                </el-form-item>
                                <el-form-item label="学校">
                                    <span>{{ scope.row.school }}</span>
                                </el-form-item>
                                <el-form-item label="专业">
                                    <span>{{ scope.row.major }}</span>
                                </el-form-item>
                                <el-form-item label="学历">
                                    <span>{{ scope.row.eduBg }}</span>
                                </el-form-item>
                                <el-form-item label="工作经历 公司">
                                    <span>{{ scope.row.companyName }}</span>
                                </el-form-item>
                                <el-form-item label="工作经历 岗位">
                                    <span>{{ scope.row.position }}</span>
                                </el-form-item>
                                <el-form-item label="工作经历 工作月数">
                                    <span>{{ scope.row.workLength }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="姓名"
                        prop="name">
                    </el-table-column>
                    <el-table-column
                        label="年龄"
                        prop="age">
                    </el-table-column>
                    <el-table-column
                        label="邮箱"
                        prop="email">
                    </el-table-column>
                    <el-table-column
                        label="投递职位"
                        prop="positionName">
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div>
                                <el-button-group>
                                    <el-button plain v-show="scope.row.del" @click="sayHello(scope.row)" type="primary" icon="el-icon-chat-dot-square">打招呼</el-button>
                                </el-button-group>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-main>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageBean.currentPage"
                    :page-sizes="pageSize_web"
                    :page-size="pageBean.pageSize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="resumeListLength">
                </el-pagination>
            </el-main>
            <!--尾部-->
            <el-footer>
                <component :is="footerComponent"/>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    // 引入组件
    import backTop from "./subComponents/backTop";
    import u_header from "./subComponents/u_header";
    import u_footer from "./subComponents/u_footer";
    const loginURL = '/isLogged';
    export default {
        // 注册组件
        components: {
            backTop,
            "u_header": u_header,
            "u_footer": u_footer
        },
        name: "e_main",
        created() {
        },

        mounted() {
            console.log('企业版主页刷新');
            let _this = this;
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                if (res.data.username == null) {
                    _this.$router.push('/');
                    return;
                }
                _this.users = res.data;
                console.log('企业版主页-当前用户：');
                console.log(_this.users);
                _this.$ajax.post('/resumeListLength', _this.users.companyId, {emulateJSON: true}).then((res) => {
                    _this.resumeListLength = res.data;
                });
                //发送到后端的数据
                var map = {
                    "companyId": _this.users.companyId,
                    "currentPage": 1,
                    "pageSize": 5
                };
                _this.$ajax.post('/resumeList', map, {emulateJSON: true}).then((res) => {
                    _this.resumeList = res.data;
                    console.log('简历概要列表');
                    console.log(_this.resumeList);
                });
            });
        },
        data() {
            return {
                //该数据要传给[已登录]子组件 当前已登录的用户
                users: this.$route.query.carryData,
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',

                pageBean: {
                    //默认的当前页
                    currentPage: 1,
                    //默认的每页显示的条数
                    pageSize: 5
                },
                //供选择的每页规格条数
                pageSize_web: [5, 50, 100, 200],
                //所有投递到本公司的简历概要列表长度
                resumeListLength: '',
                //所有投递到本公司的简历概要列表，处理中心
                resumeList: [{
                    //这个投简历的人的用户id
                    userId: '',
                    //姓名
                    name: '',
                    //年龄
                    age: '',
                    //邮箱
                    email: '',
                    //所在地
                    location: '',
                    //求职意向
                    jobIntent: '',
                    //学校
                    school: '',
                    //专业
                    major: '',
                    //学历
                    eduBg: '',
                    //工作经历-公司名称
                    companyName: '',
                    //工作经历-任职岗位
                    position: '',
                    //在该公司工作了多久（单位：月）
                    workLength: '',
                    //投递的职位的id
                    positionId: '',
                    //投递的职位的名称
                    positionName: '',
                    //悬浮按钮
                    del: ''
                }],
                //消息
                message: {
                    from: this.$route.query.carryData.username,
                    to: '',
                    data: 'hi，你好，很高兴认识你！'
                }
            };
        },
        methods: {
            //改变每页显示的条数时
            handleSizeChange(val) {
                let _this = this;
                console.log('每页' + val + ' 条');
                _this.$set(_this.pageBean, 'pageSize', val);
                console.log(this.pageBean);
                //发送到后端的数据
                var map = {
                    "companyId": _this.users.companyId,
                    "currentPage": _this.pageBean.currentPage,
                    "pageSize": _this.pageBean.pageSize
                };
                _this.$ajax.post('/resumeList', map, {emulateJSON: true}).then((res) => {
                    _this.resumeList = res.data;
                    console.log('简历概要列表');
                    console.log(_this.resumeList);
                });
            },
            //当前页改变时
            handleCurrentChange(val) {
                let _this = this;
                console.log('当前页: ' + val);
                _this.$set(_this.pageBean, 'currentPage', val);
                console.log(_this.pageBean);
                //发送到后端的数据
                var map = {
                    "companyId": _this.users.companyId,
                    "currentPage": _this.pageBean.currentPage,
                    "pageSize": _this.pageBean.pageSize
                };
                _this.$ajax.post('/resumeList', map, {emulateJSON: true}).then((res) => {
                    _this.resumeList = res.data;
                    console.log('简历概要列表');
                    console.log(_this.resumeList);
                });
            },
            //加背景色
            addStyle({row, column, rowIndex, columnIndex}) {
                if ((rowIndex % 2) == 1) {
                    return "background:#f0f9eb;";
                }
            },
            //鼠标悬停在某一行上
            atRow(index, rowData) {
                //这能使得数据实时驱动示图
                this.$set(index, 'del', true);
            },
            //鼠标离开某一行
            atLeave(index, rowData) {
                this.$set(index, 'del', false);
            },

            //向求职者打招呼
            sayHello(rowData) {
                let _this = this;
                _this.$set(_this.message, 'to', rowData.email);
                console.log(_this.message);
                _this.$ajax.post('/sayHello', _this.message, {emulateJSON: true}).then((res) => {
                    _this.$message({type: 'success', message: res.data});
                });
            }
        }
    }
</script>
<style scoped lang="scss">
    /*栅格布局*/
    .el-row,.el-col {
        margin-top: 0px;
        margin-bottom: 0px;

        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        padding-bottom: 1px;
        padding-top: 1px;
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

    .box-card {
        width: 90%;
        margin: 10px 10px 10px 10px;
    }


    /*简历概述列表*/
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
