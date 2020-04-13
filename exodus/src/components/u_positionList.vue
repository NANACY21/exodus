<!--求职者的职位列表-->
<template>
    <div>
        <el-container>
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <!--职位筛选-->
                <div>
                    <el-row v-for="(value,key,index) in filter" v-if="index<3" :key="key">
                        <el-col :span="2">
                            <el-button class="titBut" type="text">{{filterTitle[index]}}</el-button>
                        </el-col>
                        <el-col class="contentAtLeft" v-for="(item,subIndex) in value" :span="2" :key="item">
                            <el-checkbox-button v-model="filterChecked[key][subIndex]" @change="chooseFilter(key,index,item,subIndex)" :label="item">{{item}}</el-checkbox-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="2">
                            <el-button class="titBut" type="text">选择职位：</el-button>
                        </el-col>
                        <el-col :span="4" class="contentAtLeft">
                            <el-cascader
                                :options="allTradeTreeRoot"
                                :props="{ expandTrigger: 'hover' }"
                                @change="handleChange"
                                clearable>
                            </el-cascader>
                        </el-col>
                        <el-col :span="2">
                            <el-button class="titBut" type="text">{{filterTitle[3]}}</el-button>
                        </el-col>
                        <el-col :span="3">
                            <el-select clearable v-model="currentFilter.salary">
                                <el-option v-for="sw in filter.salary_web" :key="sw" :label="sw" :value="sw"/>
                            </el-select>
                        </el-col>
                        <el-col :span="2">
                            <el-button class="titBut" type="text">{{filterTitle[4]}}</el-button>
                        </el-col>
                        <el-col :span="3">
                            <el-select clearable v-model="currentFilter.worktype">
                                <el-option v-for="ww in filter.worktype_web" :key="ww" :label="ww" :value="ww"/>
                            </el-select>
                        </el-col>
                    </el-row>
                </div>
                <component v-if="updatePositionListComponent" v-bind:currentFilter="currentFilter" :is="positionListComponent"/>
            </el-main>
            <el-footer height="180px">
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
        name: "u_positionList",
        components: {
            backTop,
            "u_header": u_header,
            "u_footer": u_footer,
            "positionList": positionList
        },
        mounted() {
            let _this = this;
            //加载供搜索的行业、职位
            _this.$ajax.get('/getAllTradeTreeRoot').then(function (res) {
                _this.allTradeTreeRoot = res.data;
            });
        },

        watch: {
            //监听职位列表当前查询条件
            currentFilter: {
                deep: true,
                handler: function (newVal, oldVal) {
                    // console.log(newVal);
                    // console.log(oldVal.city);
                }
            }
        },

        data() {
            return {
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
                //职位列表组件
                positionListComponent: 'positionList',

                //所有行业树根节点
                allTradeTreeRoot: [],
                //过滤条件
                filter: {
                    //工作地点
                    city: ['全国', '北京', '上海', '广州', '深圳', '杭州'],
                    //工作经验
                    workExp: ['不限', '应届毕业生', '3年及以下', '3-5年', '5-10年', '10年以上', '不要求'],
                    //学历要求
                    eduBg: ['不限', '大专', '本科', '硕士', '博士', '不要求'],
                    //月薪
                    salary_web: ['不限', '2k以下', '2k-5k', '5k-10k', '10k-15k', '15k-25k', '25k-50k', '50k以上'],
                    //工作性质
                    worktype_web: ['不限', '全职', '兼职', '实习']
                },
                filterChecked: {
                    //工作地点
                    city: [true, false, false, false, false, false],
                    //工作经验
                    workExp: [true, false, false, false, false, false, false],
                    //学历要求
                    eduBg: [true, false, false, false, false, false]
                },
                filterTitle: ['工作地点：', '工作经验：', '学历要求：', '月薪：', '工作性质：'],
                //当前的查询条件
                currentFilter: {
                    //工作地点
                    city: ['全国'],
                    //工作经验
                    workExp: ['不限'],
                    //学历要求
                    eduBg: ['不限'],
                    //月薪
                    salary: '不限',
                    //工作性质
                    worktype: '不限'
                },
                //强制刷新子组件数据 重新渲染 默认加载这个子组件
                updatePositionListComponent: true
            };
        },
        methods: {
            //选择职位 级联选择器选中值变化时触发
            handleChange(val) {
                console.log(val);
            },
            //点击过滤条件
            chooseFilter: function (key, index, value, subIndex) {
                let _this = this;
                console.log('key:' + key);
                console.log('index:' + index);
                console.log('value:' + value);
                console.log('subIndex:' + subIndex);

                if (subIndex == 0) {
                    _this.filterChecked[key][0] = true;
                    for (let i = 1; i < _this.filterChecked[key].length; i++) {
                        _this.filterChecked[key][i] = false;
                    }
                    _this.currentFilter[key] = [];
                    _this.currentFilter[key].push(value);
                } else if (_this.currentFilter[key].indexOf(value) != -1) {
                    _this.currentFilter[key].splice(_this.currentFilter[key].indexOf(value), 1);
                    // ！！！
                    if (_this.filterChecked[key][0] == false && _this.currentFilter[key].length == 0) {
                        _this.currentFilter[key].push(index == '0' ? '全国' : '不限');
                        _this.filterChecked[key][0] = true;
                    }
                } else {
                    _this.currentFilter[key].push(value);
                    // ！！！
                    if (_this.filterChecked[key][0] == true) {
                        _this.currentFilter[key].splice(0, 1);
                        _this.filterChecked[key][0] = false;
                    }
                }
                //这时上色/除色 复选框无需手动上色
                console.log('######职位列表当前查询条件');
                console.log(_this.currentFilter);

                //职位列表查询条件变更 向子组件传递的数据变更 需要刷新子组件
                _this.refreshPositionListComponent();
            },

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
    /*120px是header+footer的高度之和 有变化再改（按实际情况改）*/
    .el-main {
        min-height: calc(100vh - 120px);
        width: 1410px;
        margin-left: auto;
        margin-right: auto;
    }
    .titBut {
        font-weight: bold;
        color: #475669;
    }
    .contentAtLeft {
        text-align: left;
    }
</style>
