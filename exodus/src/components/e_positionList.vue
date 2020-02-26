<!--职位列表 使用场景：企业版用户查看职位列表、用户版用户的投递箱-->
<template>
    <div>
        <el-container>
            <!--头部 每个页面都包含头部子组件-->
            <el-header>
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-row v-show="!control.e_">
                    <el-col :span="24">
                        <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
                            <el-step @click.native="postStep('投递成功')" title="投递成功"></el-step>
                            <el-step @click.native="postStep('被查看')" title="被查看"></el-step>
                            <el-step @click.native="postStep('待沟通')" title="待沟通"></el-step>
                            <el-step @click.native="postStep('邀请面试')" title="邀请面试"></el-step>
                            <el-step @click.native="postStep('不合适')" title="不合适"></el-step>
                            <el-step @click.native="postStep('删除记录')" title="删除记录"></el-step>
                        </el-steps>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col v-show="control.e_" :span="1.5" offset="16">
                        <el-dropdown>
                            <el-button plain type="success">
                                {{this.filterItem}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="filterPositionList('all')" title="公司已新增的职位">全部</el-dropdown-item>
                                <el-dropdown-item @click.native="filterPositionList('release')" title="公司已发布的职位">已发布</el-dropdown-item>
                                <el-dropdown-item @click.native="filterPositionList('has')">有投递</el-dropdown-item>
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
                        <el-input suffix-icon="el-icon-search" @keyup.enter.native="" placeholder="职位名称"></el-input>
                    </el-col>
                </el-row>
                <el-table
                    v-loading="loading"
                    ref="positionList"
                    :data="positionList"
                    @cell-mouse-enter="atRow"
                    @cell-mouse-leave="atLeave"
                    tooltip-effect="dark"
                    style="width: 100%"
                    row-style="height:80px"
                    :cell-style="addStyle"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        label="职位名称"
                        width="110">
                        <template slot-scope="scope">
                            <el-link @click="seePosition(scope.$index, scope.row)" :underline="false">{{ scope.row.name }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        prop="detail"
                        label="职位详情"
                        width="110">
                    </el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        prop="city"
                        label="工作地点"
                        width="110">
                    </el-table-column>
                    <el-table-column
                        prop="workExp"
                        label="工作经验"
                        width="110">
                    </el-table-column>
                    <el-table-column
                        prop="eduBg"
                        label="学历"
                        width="110">
                    </el-table-column>
                    <el-table-column
                        prop="salary"
                        label="最高月薪"
                        width="110">
                    </el-table-column>
                    <el-table-column
                        prop="salaryFloat"
                        label="月薪浮动"
                        width="110">
                    </el-table-column>
                    <el-table-column
                        prop="worktype"
                        label="工作性质"
                        width="110">
                    </el-table-column>
                    <el-table-column
                        prop="faceto"
                        label="校招/社招"
                        width="110">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态"
                        width="110">
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div>
                                <el-button-group>
                                    <el-button plain v-show="scope.row.del && control.e_" @click="editPosition(scope.$index, scope.row)" type="primary" title="编辑该职位" icon="el-icon-edit">编辑</el-button>
                                    <el-button plain v-show="scope.row.del" @click="delPosition(scope.$index, scope.row)" type="danger" title="删除该职位" icon="el-icon-delete">删除</el-button>
                                    <el-button plain v-show="scope.row.del && control.e_" @click="releasePosition(scope.$index, scope.row)" type="success" title="发布该职位" icon="el-icon-s-promotion">发布</el-button>
                                    <el-button plain v-show="scope.row.del && control.e_" @click="withdrawPosition(scope.$index, scope.row)" type="warning" title="撤回该职位" icon="el-icon-refresh-left">撤回</el-button>
                                </el-button-group>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    // 引入组件
    const loginURL = '/isLogged';
    //字符
    const ch = '#';
    import backTop from "./subComponents/backTop";
    import u_header from "./subComponents/u_header";
    export default {
        // 注册组件
        components: {
            backTop,
            "u_header": u_header
        },
        name: "e_positionList",
        mounted() {
            let _this = this;
            let url;
            //向后端发的数据
            let data;
            //用户版用户访问该页面
            if (_this.$route.query.action == 'u_see') {
                _this.userId = _this.$route.query.userId;
                url = '/postList';
                data = _this.userId;
                //控制
                _this.control.e_ = false;
                _this.control.offset = 18;
                _this.companyId = '';
            }
            //企业版用户访问该页面
            else if (_this.$route.query.action == 'e_see') {
                _this.companyId = _this.$route.query.companyId;
                url = '/getPositionList';
                data = _this.companyId;
                _this.userId = '';
            }
            _this.$ajax.post(url, data, {emulateJSON: true}).then((res) => {
                console.log('后端数据：');
                console.log(res.data);
                _this.positionList = res.data;
                //数据处理
                for (var i = 0; i < _this.positionList.length; i++) {
                    //城市数组
                    let cityArray = _this.positionList[i].city.split(ch);
                    //需求人数数组
                    let numArray = _this.positionList[i].needNum.split(ch);
                    _this.positionList[i].city = '';
                    for (var j = 0; j < cityArray.length; j++) {
                        if (cityArray[j] != '') {
                            _this.positionList[i].city = _this.positionList[i].city + cityArray[j] + '(' + numArray[j] + ')';
                        }
                    }
                    if (_this.positionList[i].status == '0') {
                        _this.positionList[i].status = '未发布';
                    } else if (_this.positionList[i].status == '1') {
                        _this.positionList[i].status = '已发布';
                    }
                    _this.positionList[i].del = false;
                }
                _this.loading = false;
            });
        },

        data() {
            return {
                //不同使用场景的页面控制
                control: {
                    //当前该列表是否为企业版
                    e_: true,
                    //间隔
                    offset: 0,
                },
                headerComponent: 'u_header',
                //用户id
                userId: '',
                //公司id
                companyId: '',
                //职位列表
                positionList: [],
                // 职位列表表格复选框选中的
                multipleSelection: [],
                //表格加载数据
                loading: true,
                //过滤职位列表
                filterItem: '全部'
            };
        },
        methods: {
            //企业版-该公司已发布的职位列表
            filterPositionList(filterArg) {
                console.log(filterArg);
                let _this = this;
                if (filterArg == 'all') {
                    console.log('全部职位');
                    _this.filterItem = '全部';
                    _this.$ajax.post('/getPositionList', _this.companyId, {emulateJSON: true}).then((res) => {
                        console.log('后端数据：');
                        console.log(res.data);
                        _this.positionList = res.data;
                        //数据处理
                        for (var i = 0; i < _this.positionList.length; i++) {
                            //城市数组
                            let cityArray = _this.positionList[i].city.split(ch);
                            //需求人数数组
                            let numArray = _this.positionList[i].needNum.split(ch);
                            _this.positionList[i].city = '';
                            for (var j = 0; j < cityArray.length; j++) {
                                if (cityArray[j] != '') {
                                    _this.positionList[i].city = _this.positionList[i].city + cityArray[j] + '(' + numArray[j] + ')';
                                }
                            }
                            if (_this.positionList[i].status == '0') {
                                _this.positionList[i].status = '未发布';
                            } else if (_this.positionList[i].status == '1') {
                                _this.positionList[i].status = '已发布';
                            }
                            _this.positionList[i].del = false;
                        }
                        _this.loading = false;
                    });
                } else if (filterArg == 'release') {
                    console.log('已发布');
                    _this.filterItem = '已发布';
                    for (var i = 0; i < _this.positionList.length; i++) {
                        if (_this.positionList[i].status == '未发布') {
                            //删除数组中一项
                            _this.positionList.splice(i, 1);
                            i--;
                        }
                    }
                    console.log(_this.positionList);
                } else if (filterArg == 'has') {
                    console.log('有投递');
                    _this.filterItem = '有投递';
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
                let action = 'e_see';
                if (_this.userId != '' && _this.companyId == '') {
                    action = 'u_see';
                }
                //携带数据
                _this.$router.push({path: '/e_position', query: {position: rowData, action: action}});
            },
            //编辑职位
            editPosition(index, rowData) {
                console.log(rowData);
                //携带数据
                this.$router.push({path: '/e_position', query: {position: rowData, action: 'e_edit'}});
            },
            //删除职位
            delPosition(index, rowData) {
                let _this = this;
                // console.log(index);
                // console.log(rowData);
                //选中的职位id
                var positionIds = [];
                if (typeof (rowData) == 'undefined') {
                    console.log('批量删除');
                    if (_this.multipleSelection.length == 0) {
                        _this.$message({
                            type: 'error',
                            message: '请选择职位'
                        });
                        return;
                    }
                    for (var i = 0; i < _this.multipleSelection.length; i++) {
                        console.log(_this.multipleSelection[i].id);
                        positionIds[i] = _this.multipleSelection[i].id;
                    }
                } else {
                    console.log('删除一条');
                    console.log(rowData.id);
                    positionIds[0] = rowData.id;
                }
                console.log('要删除的职位id');
                console.log(positionIds);
                _this.$ajax.post('/delPosition', positionIds, {emulateJSON: true}).then((res) => {
                    _this.$message({
                        type: 'info',
                        message: res.data
                    });
                });
            },
            //发布职位
            releasePosition(index, rowData) {
                let _this = this;
                console.log('职位id：');
                console.log(rowData.id);
                _this.$ajax.post('/releasePosition', rowData.id, {emulateJSON: true}).then((res) => {
                    console.log(res.data);
                    _this.$message({
                        type: 'info',
                        message: res.data
                    });
                });
            },
            //撤回职位
            withdrawPosition(index, rowData) {
                let _this = this;
                console.log('职位id：');
                console.log(rowData.id);
                _this.$ajax.post('/withdrawPosition', rowData.id, {emulateJSON: true}).then((res) => {
                    console.log(res.data);
                    _this.$message({
                        type: 'info',
                        message: res.data
                    });
                });
            },
            // 点击职位列表表格复选框时
            handleSelectionChange(val) {
                // console.log(val);
                this.multipleSelection = val;
            },
            //投递进度
            postStep(info) {
                let _this = this;
                _this.$message({
                    type: 'success',
                    message: info
                });
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
