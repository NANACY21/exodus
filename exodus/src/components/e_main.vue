<!--[招聘者-企业版]主页-->
<template>
    <div>
        <el-container>
            <!--头部-->
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="3" offset="21">
                        <el-dropdown>
                            <el-button plain type="success">
                                {{this.groupBy}}
                                <i class="el-icon-arrow-down el-icon--right"/>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in groupBy_web" :key="item"
                                                  @click.native="changeGroup(item)">
                                    {{item}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
                <el-table
                    border
                    v-show="groupByResume"
                    :data="resumeList"
                    style="width: 100%"
                    @cell-mouse-enter="atRow"
                    @cell-mouse-leave="atLeave"
                    row-style="height:70px"
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
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="姓名"
                        prop="name"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        label="年龄"
                        prop="age"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        label="邮箱"
                        prop="email"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        label="已投递职位"
                        width="180">
                        <template slot-scope="scope">
                            <div>
                                <el-dropdown @click.native="getPositionNameList(scope.row.userId)" @command="hePost" trigger="click" :title="scope.row.name+'投递到本公司的职位'">
                                    <span class="el-dropdown-link">
                                        已投递职位
                                        <i class="el-icon-arrow-down el-icon--right"/>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="(item,index) in positionNameList" :key="index" :command="item">
                                            {{item.name}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div style="text-align: right">
                                <el-button-group>
                                    <el-button plain v-show="scope.row.del" @click="changePostStatus(scope.row,1)" type="primary"
                                               icon="el-icon-chat-round">
                                        打招呼
                                    </el-button>
                                    <el-button plain v-show="scope.row.del" @click="changePostStatus(scope.row,2)"
                                               type="success" icon="el-icon-notebook-2" title="批阅简历">
                                        看简历
                                    </el-button>
                                    <el-button plain v-show="scope.row.del" @click="changePostStatus(scope.row,3)" type="warning"
                                               icon="el-icon-chat-line-round">
                                        邀面试
                                    </el-button>
                                    <el-button plain v-show="scope.row.del" @click="changePostStatus(scope.row,-2)" type="danger"
                                               icon="el-icon-close">
                                        不合适
                                    </el-button>
                                </el-button-group>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <el-table
                    border
                    v-show="!groupByResume"
                    :data="positionList"
                    style="width: 100%"
                    @cell-mouse-enter="atRow"
                    @cell-mouse-leave="atLeave"
                    row-style="height:70px"
                    :cell-style="addStyle">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="职位名称">
                                    <span>{{ scope.row.name }}</span>
                                </el-form-item>
                                <el-form-item label="职位详情">
                                    <span>{{ scope.row.detail }}</span>
                                </el-form-item>
                                <el-form-item label="工作经验要求">
                                    <span>{{ scope.row.workExp }}</span>
                                </el-form-item>
                                <el-form-item label="学历要求">
                                    <span>{{ scope.row.eduBg }}</span>
                                </el-form-item>
                                <el-form-item label="最高月薪">
                                    <span>{{ scope.row.salary }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="职位名称"
                        prop="name"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        label="职位详情"
                        prop="detail"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        label="工作经验要求"
                        prop="workExp"
                        width="180">
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div style="text-align: right">
                                <el-popover
                                    placement="right"
                                    width="400"
                                    trigger="click">
                                    <el-table :data="resumeNameList">
                                        <el-table-column width="133" property="id" label="简历id"></el-table-column>
                                        <el-table-column width="134" property="userId" label="用户id"></el-table-column>
                                        <el-table-column width="133" property="name" label="真实姓名"></el-table-column>
                                    </el-table>
                                    <el-button slot="reference" @click="getResumeNameList(scope.row.id)">已投递简历</el-button>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination
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
            </el-main>
            <!--尾部-->
            <el-footer height="180px">
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
            let _this = this;
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                let backStage = res.data;
                if (backStage == '') {
                    _this.$router.push('/');
                    return;
                }
                _this.users = backStage;
                _this.commitData.companyId = _this.users.companyId;
                _this.getResumeList();
                _this.getResumeListLength();
            });
        },
        data() {
            return {
                //按简历分组
                groupByResume: true,
                groupBy: '按简历分组',
                groupBy_web: ['按简历分组', '按职位分组'],
                //该数据要传给[已登录]子组件 当前已登录的用户
                users: {},
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
                //分页相关
                pageBean: {
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

                //按简历分组 所有投递到本公司的简历概要列表，处理中心
                resumeList: [{
                    //这个投简历的人的用户id！！！！
                    userId: '',
                    //这个投简历的人的username
                    username: '',
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
                    //悬浮按钮
                    del: ''
                }],
                //按职位分组 所有有投递的职位的列表
                positionList: [{}],
                //消息
                message: {
                    from: '',
                    to: '',
                    msgContent: 'hi，你好，很高兴认识你！'
                },
                //某个人（简历）投递的职位名称列表
                positionNameList: [{
                    //职位id
                    id: '',
                    //职位名称
                    name: ''
                }],
                // 某个职位的已投递简历的列表
                resumeNameList: [{
                    //简历id
                    id: '',
                    //用户id
                    userId: '',
                    //这个求职者的真实姓名
                    name: ''
                }],
                //本页面的4个主要请求提交到后端的数据
                commitData: {
                    companyId: '',
                    currentPage: 1,
                    pageSize: 5
                }
            };
        },
        methods: {
            //改变分组方式
            changeGroup(item) {
                let _this = this;
                _this.groupBy = item;
                if (_this.groupBy == _this.groupBy_web[0]) {
                    _this.getResumeList();
                    _this.getResumeListLength();
                } else if (_this.groupBy == _this.groupBy_web[1]) {
                    _this.getHasPostList();
                    _this.getHasPostListLength();
                }
            },
            //点击项回调事件
            hePost(command) {
                let _this = this;
                console.log(command.id);
                console.log(command.name);
                _this.$ajax.post('/getPositionById', command.id, {emulateJSON: true}).then((res) => {
                    _this.$router.push({path: '/e_position', query: {position: res.data, action: 'e_see'}});
                });
            },
            //查询某个人在本公司投递的职位
            getPositionNameList(userId) {
                let _this = this;
                console.log(userId);
                let map = {
                    "userId": userId,
                    "companyId": _this.users.companyId
                };
                _this.$ajax.post('/getPositionNameList', map, {emulateJSON: true}).then((res) => {
                    _this.positionNameList = res.data;
                    console.log(_this.positionNameList);
                });
            },

            //职位的简历 某职位的所有投递的简历
            getResumeNameList(positionId) {
                let _this = this;
                console.log(positionId);
                _this.$ajax.post('/getResumeNameList', positionId, {emulateJSON: true}).then((res) => {
                    _this.resumeNameList = res.data;
                });
            },
            //改变每页显示的条数时
            handleSizeChange(val) {
                let _this = this;
                console.log('每页' + val + ' 条');
                _this.$set(_this.pageBean, 'pageSize', val);
                console.log(_this.pageBean);
                _this.commitData.currentPage = _this.pageBean.currentPage;
                _this.commitData.pageSize = _this.pageBean.pageSize;
                if (_this.groupByResume == true) {
                    _this.getResumeList();
                } else {
                    _this.getHasPostList();
                }
            },
            //当前页改变时
            handleCurrentChange(val) {
                let _this = this;
                console.log('当前页: ' + val);
                _this.$set(_this.pageBean, 'currentPage', val);
                console.log(_this.pageBean);
                _this.commitData.currentPage = _this.pageBean.currentPage;
                _this.commitData.pageSize = _this.pageBean.pageSize;
                if (_this.groupByResume == true) {
                    _this.getResumeList();
                } else {
                    _this.getHasPostList();
                }
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

            //改变求职者职位的投递状态 参数 要改成的状态
            changePostStatus(rowData, postStatus) {
                let _this = this;
                let map = {
                    "userId": rowData.userId,
                    "companyId": _this.users.companyId,
                    "postStatus": postStatus
                };
                _this.$ajax.post('/changePostStatus', map, {emulateJSON: true}).then((res) => {
                    console.log(res.data);
                });
                // 看他的简历
                if (postStatus === 2) {
                    _this.$router.push({path: '/u_resume', query: {users: rowData}});
                }
                // hr向求职者打招呼 投递状态变成被查看
                else if (postStatus == 1) {
                    _this.$set(_this.message, 'from', _this.users.username);
                    _this.$set(_this.message, 'to', rowData.email);
                    console.log(_this.message);
                    _this.$ajax.post('/sayHello', _this.message, {emulateJSON: true}).then((res) => {
                        _this.$message({type: 'success', message: res.data});
                    });
                }
            },
            //4个主要请求 简历概要列表。列表 列表长度 请求提交的数据一样
            getResumeList() {
                let _this = this;
                _this.$ajax.post('/resumeList', _this.commitData, {emulateJSON: true}).then((res) => {
                    _this.resumeList = res.data;
                    _this.groupByResume = true;
                });
            },
            // 所有投递到本公司的简历概要列表长度
            getResumeListLength() {
                let _this = this;
                _this.$ajax.post('/resumeListLength', _this.commitData, {emulateJSON: true}).then((res) => {
                    _this.pageBean.currentListLength = res.data;
                    _this.pageBean.tip = '投递到我公司的简历' + _this.pageBean.currentListLength + '个';
                });
            },
            // 我公司发布的有投递的职位列表
            getHasPostList() {
                let _this = this;
                _this.$ajax.post('/hasPostList', _this.commitData, {emulateJSON: true}).then((res) => {
                    _this.positionList = res.data;
                    _this.groupByResume = false;
                });
            },
            // 我公司发布的有投递的职位列表长度
            getHasPostListLength() {
                let _this = this;
                _this.$ajax.post('/hasPostListLength', _this.commitData, {emulateJSON: true}).then((res) => {
                    _this.pageBean.currentListLength = res.data;
                    _this.pageBean.tip = '我公司发布的有投递的职位' + _this.pageBean.currentListLength + '个';
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
        text-align: right;
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

    /*280px是header+footer的高度之和*/
    .el-main {
        min-height: calc(100vh - 280px)
    }
    .el-pagination {
        margin: 15px;
    }
</style>
