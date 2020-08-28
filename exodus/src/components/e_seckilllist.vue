<!--[企业版][管理员]秒杀活动列表-->
<template>
    <div>
        <el-container>
            <!--头部-->
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="2" offset="16">
                        <el-dropdown>
                            <el-button plain type="success">
                                {{this.filterItem}}
                                <i class="el-icon-arrow-down el-icon--right"/>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in filter_web" @click.native="filterSeckillList(item)"
                                                  :title="'公司'+item+'的秒杀活动'"
                                                  :key="item">
                                    {{item}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                    <el-col :span="3">
                        <el-button-group>
                            <el-button type="primary" plain icon="el-icon-plus" @click="e_seckill"
                                       title="新增[秒杀活动]">
                                新增
                            </el-button>
                            <el-button type="danger" plain icon="el-icon-delete" @click="delSeckill" title="批量删除[秒杀活动]">删除</el-button>
                        </el-button-group>
                    </el-col>
                    <el-col :span="3">
                        <!--搜索时模糊匹配-->
                    </el-col>
                </el-row>
            </el-main>
            <el-footer>
                <component :is="footerComponent"/>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import u_header from "./subComponents/u_header";
    import u_footer from "./subComponents/u_footer";

    export default {
        name: "e_seckilllist",
        components: {
            "u_header": u_header,
            "u_footer": u_footer,
        },
        mounted() {
        },
        data() {
            return {
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
                //过滤[秒杀活动]列表
                filterItem: '所有秒杀',
                //过滤[秒杀活动]选项
                filter_web: ['所有秒杀', '未开始'],
            };
        },
        methods: {
            //企业版-该公司已发布的[秒杀活动]列表
            filterSeckillList(filterArg) {
                let _this = this;
                _this.filterItem = filterArg;
                if (filterArg == '所有秒杀') {

                } else if (filterArg == '未开始') {

                }
            },
            //企业版-进入添加新[秒杀活动]页面
            e_seckill() {
                let _this = this;
                _this.$router.push({path: '/e_seckill'});
            },
            //删除[秒杀活动] 参数：index没有使用 rowData某一行[秒杀活动]
            delSeckill(index, rowData) {
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
        }
    }
</script>

<style scoped>

</style>
