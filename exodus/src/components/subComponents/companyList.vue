<!--[公司列表子组件] 使用场景：默认主页-->
<template>
    <div>
        <el-card class="company-card" shadow="hover" v-for="item in companyList" :key="item">
            <div slot="header" class="clearfix">
                <img @click="companyHomePage(item.id)" :src="require('../../assets/companyLogo/'+item.id+'.jpg')" class="image"/>
                <el-row>
                    <el-col :span="24" style="color: darkblue">
                        {{item.name}}
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-popover
                            placement="top-start"
                            title="公司信息"
                            width="200"
                            trigger="click"
                            :content="item.introduction">
                            <el-button type="text" slot="reference">{{item.introduction.substring(0,10)+'...'}}</el-button>
                        </el-popover>
                    </el-col>
                </el-row>
            </div>
            <el-row>
                <el-col :span="8"><span>{{ item.positionNum }}</span></el-col>
                <el-col :span="8"><span>{{ item.positionNum }}</span></el-col>
                <el-col :span="8"><span>{{ item.positionNum }}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="8">在招职位</el-col>
                <el-col :span="8">面试评价</el-col>
                <el-col :span="8">简历处理率</el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "companyList",
        mounted() {
            let _this = this;
            //默认标签页 卡片 公司列表 参数：
            _this.$ajax.post('/companyList', {}, {emulateJSON: true}).then(function (res) {
                _this.companyList = res.data;
                console.log(_this.companyList);
            });
        },
        data() {
            return {
                //公司列表
                companyList: [],
            };
        },
        methods: {
            //前往公司主页
            companyHomePage(companyId) {
                this.$router.push({path: '/e_company', query: {companyId: companyId}});
            }
        }
    }
</script>

<style scoped>
    /*卡片*/
    .clearfix:before, .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .company-card {
        /*这个宽度别变了！！！*/
        width: 320px;
        margin: 10px 10px 10px 10px;
        float: left;
    }

    /*公司概要信息列表卡片*/
    .image {
        cursor: pointer;
        width: 50%;
        display: block;
        margin-right: auto;
        margin-left: auto;
    }
    .el-row {
        height: 30px;
    }
    .el-row .el-col span {
        font-size: 14px;
        color: darkgray;
    }
    .el-button {
        height: 30px;
        padding: 0px 15px;
        color: darkgrey;
    }
    .el-row .el-col {
        margin-top: 4.5px;
        border-left: 1px solid lightgray;
        border-right: 1px solid lightgray;
    }
</style>
