<!--职位列表
使用场景：
企业版用户查看职位列表
用户版用户的投递箱-->
<template>
    <div>
        <el-container>
            <!--头部 每个页面都包含头部子组件-->
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-row v-show="!control.e_" class="userPostList" title="已投递简历状态">
                    <el-col :span="11" offset="10">
                        <el-steps :active="currentStep" finish-status="success" simple style="margin-top: 20px">
                            <el-step @click.native="postStep(1)" title="投递成功"/>
                            <el-step @click.native="postStep(2)" title="被查看"/>
                            <el-step @click.native="postStep(3)" title="待沟通"/>
                            <el-step @click.native="postStep(4)" title="邀请面试"/>
                        </el-steps>
                    </el-col>
                    <el-col :span="3">
                        <el-button-group style="margin-top: 20px">
                            <el-button @click="postStep(-1)" title="招聘者认为你不合适" type="danger">不合适</el-button>
                            <el-button @click="postStep(0)" title="求职者手动删的" type="warning">删除记录</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col v-show="control.e_" :span="2" offset="16">
                        <el-dropdown>
                            <el-button plain type="success">
                                {{this.filterItem}}
                                <i class="el-icon-arrow-down el-icon--right"/>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in filter_web" @click.native="filterPositionList(item)"
                                                  :title="'公司'+item+'的职位'"
                                                  :key="item">
                                    {{item}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                    <el-col :span="3" :offset="control.offset">
                        <el-button-group>
                            <el-button v-show="control.e_" type="primary" plain icon="el-icon-plus" @click="e_position" title="新增职位">新增</el-button>
                            <el-button type="danger" plain icon="el-icon-delete" @click="delPosition" title="批量删除职位">删除</el-button>
                        </el-button-group>
                    </el-col>
                    <el-col :span="3">
                        <!--搜索时模糊匹配-->
                        <el-autocomplete
                            prefix-icon="el-icon-search"
                            placeholder="职位名称"
                            :trigger-on-focus="false"
                            v-model="search_content"
                            @keyup.enter.native="searchPosition"
                            :fetch-suggestions="querySearch"
                            @select="handleSelect"/>
                    </el-col>
                </el-row>
                <el-table
                    border
                    v-loading="loading"
                    ref="positionList"
                    :data="positionList"
                    @cell-mouse-enter="atRow"
                    @cell-mouse-leave="atLeave"
                    tooltip-effect="dark"
                    style="width: 100%"
                    row-style="height:70px"
                    :cell-style="addStyle"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        label="职位名称"
                        width="108">
                        <template slot-scope="scope">
                            <el-link @click="seePosition(scope.$index, scope.row)" :underline="false">{{ scope.row.name }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        prop="detail"
                        label="职位详情"
                        width="108">
                    </el-table-column>
                    <el-table-column
                        width="108">
                        <template slot-scope="scope">
                            <div>
                                <el-popover
                                    placement="right"
                                    width="400"
                                    trigger="click">
                                    <el-table :data="cityAndNum">
                                        <el-table-column width="200" property="city" label="城市"></el-table-column>
                                        <el-table-column width="200" property="num" label="需求人数"></el-table-column>
                                    </el-table>
                                    <el-button type="text" slot="reference" @click="getCityAndNum(scope.$index)">工作地点</el-button>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="workExp"
                        label="工作经验"
                        width="108">
                    </el-table-column>
                    <el-table-column
                        prop="eduBg"
                        label="学历"
                        width="108">
                    </el-table-column>
                    <el-table-column
                        prop="salary"
                        label="最高月薪"
                        width="108">
                    </el-table-column>
                    <el-table-column
                        prop="salaryFloat"
                        label="月薪浮动"
                        width="108">
                    </el-table-column>
                    <el-table-column
                        prop="worktype"
                        label="工作性质"
                        width="108">
                    </el-table-column>
                    <el-table-column
                        prop="faceto"
                        label="校招/社招"
                        width="108">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态"
                        width="108">
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div style="text-align: right">
                                <el-button-group>
                                    <el-button size="small" plain v-show="scope.row.del && control.e_"
                                               @click="editPosition(scope.$index, scope.row)" type="primary"
                                               title="编辑该职位" icon="el-icon-edit">
                                        编辑
                                    </el-button>
                                    <el-button size="small" plain v-show="scope.row.del"
                                               @click="delPosition(scope.$index, scope.row)" type="danger" title="删除该职位"
                                               icon="el-icon-delete">
                                        删除
                                    </el-button>
                                    <el-button size="small" plain v-show="scope.row.del && control.e_"
                                               @click="changePositionStatus(scope.$index, scope.row,1)" type="success"
                                               title="发布该职位" icon="el-icon-s-promotion">
                                        发布
                                    </el-button>
                                    <el-button size="small" plain v-show="scope.row.del && control.e_"
                                               @click="changePositionStatus(scope.$index, scope.row,0)" type="warning"
                                               title="撤回（下线）该职位" icon="el-icon-refresh-left">
                                        撤回
                                    </el-button>
                                </el-button-group>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="clear: both"
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
            <el-footer>
                <component :is="footerComponent"/>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    // 引入组件
    import u_footer from "./subComponents/u_footer";
    const loginURL = '/isLogged';
    //字符
    const ch = '#';
    import backTop from "./subComponents/backTop";
    import u_header from "./subComponents/u_header";
    export default {
        // 注册组件
        components: {
            backTop,
            "u_header": u_header,
            "u_footer": u_footer
        },
        name: "e_positionList",
        mounted() {
            let _this = this;
            _this.commitData.currentPage = _this.pageBean.currentPage;
            _this.commitData.pageSize = _this.pageBean.pageSize;
            //接收的数据
            let action = _this.$route.query.action;
            //用户版用户访问该页面
            if (action == 'u_see') {
                // 用户id
                _this.commitData.id = _this.$route.query.userId;
                _this.loadUrl = '/postList';
                //控制
                _this.control.e_ = false;
                _this.control.offset = 18;
            }
            //企业版用户访问该页面
            else if (action == 'e_see') {
                // 公司id
                _this.commitData.id = _this.$route.query.companyId;
                _this.loadUrl = '/getPositionList';
                //我公司职位名称列表
                _this.$ajax.post('/positionNameList', _this.commitData, {emulateJSON: true}).then((res) => {
                    let temp = res.data;
                    _this.positionNameList = [];
                    for (let i = 0; i < temp.length; i++) {
                        _this.positionNameList.push({
                            value: temp[i]
                        });
                    }
                });
            }
            _this.whenMountedRequestLength();
            _this.whenMountedRequest();
        },
        watch: {
            search_content: {
                handler: function (newVal, oldVal) {
                    let _this = this;
                    if (newVal.length == 0) {
                        console.log('搜索框' + newVal);
                        _this.whenMountedRequestLength();
                        _this.whenMountedRequest();
                    }
                }
            }
        },
        data() {
            return {
                //搜索内容
                search_content: '',
                //不同使用场景的页面控制
                control: {
                    //当前该列表是否为企业版
                    e_: true,
                    //间隔
                    offset: 0,
                },
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
                //职位列表
                positionList: [],
                //职位名称列表
                positionNameList: [{value: ''}],
                //工作地点 该地点需求人数内存前端数据结构
                cityAndNum: [{
                    //工作地点
                    city: '',
                    //该地点需求人数
                    num: '',
                }],
                // 职位列表表格复选框选中的职位列表
                selectedPositionList: [],
                //表格加载数据
                loading: true,
                //过滤职位列表
                filterItem: '全部',
                //过滤职位选项
                filter_web: ['全部', '已发布', '有投递'],
                //步骤条当前步骤
                currentStep: 1,
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
                //mount 加载该页面时请求的地址
                loadUrl: '',
                //mount 加载该页面时提交的数据 向后端发的数据 发送到后端的数据
                commitData: {
                    //用户id 或 公司id
                    id: '',
                    currentPage: '',
                    pageSize: '',
                    //职位状态 为空 代表查询所有职位
                    status: '',
                    //投递状态（求职者版）
                    postStatus: 0
                }
            };
        },
        methods: {
            //搜索职位 只有回车才发请求
            searchPosition() {
                let _this = this;
                if (_this.commitData.id == '') {
                    return;
                }
                let map = {"searchContent": _this.search_content, "companyId": _this.commitData.id};
                _this.$ajax.post('/searchPosition', map, {emulateJSON: true}).then((res) => {
                    _this.positionList = res.data;
                    _this.positionListProcess();
                });
            },
            //获取该职位的工作地点及其人数
            getCityAndNum(index) {
                let _this = this;
                _this.cityAndNum = [];
                console.log(index);
                //城市数组
                let cityArray = _this.positionList[index].city.split(ch);
                //需求人数数组
                let numArray = _this.positionList[index].needNum.split(ch);
                for (let i = 0; i < cityArray.length; i++) {
                    if (cityArray[i] != '') {
                        _this.cityAndNum.push({
                            city: cityArray[i],
                            num: numArray[i]
                        });
                    }
                }
            },
            //企业版-该公司已发布的职位列表
            filterPositionList(filterArg) {
                let _this = this;
                _this.filterItem = filterArg;
                if (filterArg == '全部') {
                    //这时设置status为空 （status还原置空的时机）
                    _this.$set(_this.commitData, 'status', '');
                    _this.whenMountedRequestLength();
                    _this.whenMountedRequest();
                } else if (filterArg == '已发布') {
                    //这时设置status为 1
                    _this.$set(_this.commitData, 'status', '1');
                    _this.whenMountedRequestLength();
                    _this.whenMountedRequest();
                } else if (filterArg == '有投递') {
                }
            },
            //企业版-进入添加新职位页面
            e_position() {
                this.$router.push({path: '/e_position', query: {action: 'e_add'}});
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
            //查看职位
            seePosition(index, rowData) {
                let _this = this;
                console.log(rowData);
                let action = '';
                _this.control.e_ ? action = 'e_see' : action = 'u_see';
                // 对象转字符串
                let position = JSON.stringify(rowData);
                //携带数据
                _this.$router.push({path: '/e_position', query: {position: position, action: action}});
            },
            //编辑职位
            editPosition(index, rowData) {
                console.log(rowData);
                //携带数据
                this.$router.push({path: '/e_position', query: {position: rowData, action: 'e_edit'}});
            },
            //删除职位 参数：index没有使用 rowData某一行职位
            delPosition(index, rowData) {
                let _this = this;
                console.log(rowData);
                //选中的要删除的职位id
                let positionIds = [];
                //请求的url、提交的数据
                let requestUrl,
                    commitdata;
                // 是批量删除
                if (typeof (rowData) == 'undefined') {
                    if (_this.selectedPositionList.length == 0) {
                        _this.$message({
                            type: 'error',
                            message: '请选择要删除的职位'
                        });
                        return;
                    }
                    for (let i = 0; i < _this.selectedPositionList.length; i++) {
                        positionIds[i] = _this.selectedPositionList[i].id;
                    }
                }
                // 是删除一条
                else {
                    positionIds[0] = rowData.id;
                }
                //求职者-投递箱
                if (_this.control.e_ == false) {
                    requestUrl = '/deletePost';
                    commitdata = {
                        "userId": _this.commitData.id,
                        "positionIds": positionIds
                    };
                }
                //企业版-职位列表
                else {
                    requestUrl = '/delPosition';
                    commitdata = positionIds;
                }
                _this.$ajax.post(requestUrl, commitdata, {emulateJSON: true}).then((res) => {
                    _this.$message({type: 'info', message: res.data});
                });
            },
            //发布/撤回职位
            changePositionStatus(index, rowData, status) {
                let _this = this;
                console.log('职位id');
                console.log(rowData.id);
                let map = {
                    "positionId": rowData.id,
                    "status": status
                };
                _this.$ajax.post('/changePositionStatus', map, {emulateJSON: true}).then((res) => {
                    _this.$message({
                        type: 'info',
                        message: res.data
                    });
                });
            },
            // 点击职位列表表格复选框时
            handleSelectionChange(val) {
                // console.log(val);
                this.selectedPositionList = val;
            },
            //投递进度
            postStep(step) {
                let _this = this;
                _this.currentStep = step;
                _this.commitData.postStatus = step - 1;
                _this.whenMountedRequestLength();
                _this.whenMountedRequest();
            },
            //加背景色
            addStyle({row, column, rowIndex, columnIndex}) {
                if ((rowIndex % 2) == 1) {
                    return "background:#f0f9eb;";
                }
            },
            //职位列表数据处理
            positionListProcess() {
                let _this = this;
                for (let i = 0; i < _this.positionList.length; i++) {
                    _this.positionList[i].status = _this.positionList[i].status == '0' ? '未发布' : '已发布';
                    _this.positionList[i].del = false;
                }
                _this.loading = false;
            },
            //mounted时 发的请求
            whenMountedRequest() {
                let _this = this;
                _this.$ajax.post(_this.loadUrl, _this.commitData, {emulateJSON: true}).then((res) => {
                    _this.positionList = res.data;
                    _this.positionListProcess();
                });
            },
            whenMountedRequestLength() {
                let _this = this;
                //请求的职位列表总长度
                _this.$ajax.post(_this.loadUrl + 'Length', _this.commitData, {emulateJSON: true}).then((res) => {
                    _this.pageBean.currentListLength = res.data;
                    _this.pageBean.tip = '职位总数 ' + _this.pageBean.currentListLength + ' 个';
                });
            },
            //分页相关
            //改变每页显示的条数时
            handleSizeChange(val) {
                let _this = this;
                console.log('每页' + val + ' 条');
                _this.$set(_this.pageBean, 'pageSize', val);
                console.log(_this.pageBean);
                _this.commitData.currentPage = _this.pageBean.currentPage;
                _this.commitData.pageSize = _this.pageBean.pageSize;
                _this.whenMountedRequest();
            },
            //当前页改变时
            handleCurrentChange(val) {
                let _this = this;
                console.log('当前页: ' + val);
                _this.$set(_this.pageBean, 'currentPage', val);
                console.log(_this.pageBean);
                _this.commitData.currentPage = _this.pageBean.currentPage;
                _this.commitData.pageSize = _this.pageBean.pageSize;
                _this.whenMountedRequest();
            },

            //搜索框相关
            querySearch(queryString, cb) {
                var restaurants = this.positionNameList;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                console.log(item);
            }
        }
    }
</script>

<style scoped>
    /*280px是header+footer的高度之和*/
    .el-main {
        min-height: calc(100vh - 280px)
    }
    .el-pagination {
        margin: 15px;
    }
    .el-col {
        margin-bottom: 10px;
    }
    .el-step {
        cursor: pointer;
    }
    .userPostList .el-col {
        text-align: right;
    }
</style>
