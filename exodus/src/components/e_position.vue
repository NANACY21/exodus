<!--职位卡片
使用场景：
企业版用户增改查职位
用户版用户查看职位
-->
<template>
    <div>
        <el-container>
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="24" class="title">
                        <el-button-group>
                            <el-button class="tit" title="职位名称" plain :disabled="true">{{this.control.title}}</el-button>
                            <el-button v-show="control.e_" type="primary" icon="el-icon-plus" @click="addCity" :disabled="control.isSee">工作地点</el-button>
                            <el-button v-show="control.e_" type="success" icon="el-icon-plus"
                                       @click="submitForm('position')" :disabled="control.isSee"
                                       v-loading.fullscreen.lock="addingPosition">
                                {{control.submitButtonInfo}}
                            </el-button>
                            <el-button v-show="control.e_" type="warning" icon="el-icon-refresh-right" @click="resetForm('position')" :disabled="control.isSee">重置</el-button>
                            <el-button v-show="!control.e_" type="primary" icon="el-icon-message" @click="postResume" title="求职者申请职位，不能重复投递">投递</el-button>
                            <el-button v-show="!control.e_" @click="collectPosition" type="success" :icon="collected>-1?icon1:icon2">{{collected>-1?'已收藏':'收藏'}}</el-button>
                            <el-button type="info" icon="el-icon-close" @click="cancel">取消</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-form :model="position" :rules="positionRule" ref="position" :disabled="control.isSee">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="name" label="职位名称" :label-width="labelWidth2">
                                <el-cascader
                                    placeholder="选择职位"
                                    filterable
                                    v-model="position.name"
                                    :options="positionSelector.options"
                                    :props="{ expandTrigger: 'hover' }"
                                    @change="handleChange"
                                    clearable/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <!--弄成placeholder是为了不可编辑-->
                            <el-form-item prop="releaseTime" label="发布时间" :label-width="labelWidth2">
                                <el-input :disabled="true" v-model="position.releaseTime"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-show="!control.e_">
                        <el-col :span="6">
                            <el-form-item prop="companyName" label="公司名称" :label-width="labelWidth2">
                                <el-input v-model="position.companyName"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24" v-show="!control.e_">
                            <el-form-item prop="companyInfo" label="公司简介" :label-width="labelWidth2">
                                <el-input class="textarea" type="textarea" :rows="12" v-model="position.companyInfo"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item prop="detail" label="职位要求" :label-width="labelWidth2">
                                <el-input class="textarea" type="textarea" :rows="12" placeholder="职位详细信息"
                                          v-model="position.detail" clearable
                                          maxlength="600" show-word-limit/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-for="(item, index) in cityAndNum" :key="item.key">
                        <el-col :span="6">
                            <el-form-item label="工作地点" :label-width="labelWidth2">
                                <el-cascader
                                    placeholder="选择工作城市"
                                    filterable
                                    v-model="item.city"
                                    :options="citySelector.options"
                                    :props="{ expandTrigger: 'hover' }"
                                    @change="handleChange2"
                                    clearable/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="需求人数" :label-width="labelWidth2">
                                <el-input placeholder="该地点需求人数" clearable type="number" v-model="item.num"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-show="!control.e_">
                            <el-form-item label="已投递" :label-width="labelWidth2">
                                <el-input v-model="item.num"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" style="text-align: right">
                            <el-form-item>
                                <el-button plain type="danger" icon="el-icon-delete" @click.prevent="removeCity(item)">删除</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item prop="workExp" label="工作经验" :label-width="labelWidth2">
                                <el-select clearable v-model="position.workExp" placeholder="工作年限要求">
                                    <el-option v-for="item in workExp_web" :key="item" :label="item" :value="item"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="eduBg" label="学历要求" :label-width="labelWidth2">
                                <el-select clearable v-model="position.eduBg" placeholder="学历要求">
                                    <el-option v-for="item in eduBg_web" :key="item" :label="item" :value="item"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="salary" label="最高月薪" :label-width="labelWidth2">
                                <el-input type="number" clearable
                                          v-model="position.salary"
                                          placeholder="单位：人民币"
                                          step="250"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="salaryFloat" label="月薪浮动" :label-width="labelWidth2">
                                <el-input clearable type="number" v-model="position.salaryFloat" placeholder="单位：人民币"
                                          step="250"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item prop="worktype" label="工作性质" :label-width="labelWidth2">
                                <el-select clearable v-model="position.worktype">
                                    <el-option v-for="item in worktype_web" :key="item" :label="item" :value="item"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="faceto" label="面向群体" :label-width="labelWidth2">
                                <el-select clearable v-model="position.faceto">
                                    <el-option v-for="item in faceto_web" :key="item" :label="item" :value="item"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <img v-show="control.e_" src="../assets/ChinaMap.jpg"/>
            </el-main>
            <el-footer>
                <component :is="footerComponent"/>
            </el-footer>
        </el-container>

        <back-top/>
    </div>
</template>

<script>
    import u_header from "./subComponents/u_header";
    import u_footer from "./subComponents/u_footer";
    import backTop from "./subComponents/backTop";
    const loginURL = '/isLogged';
    //字符
    const ch = '#';
    export default {
        components: {
            "u_header": u_header,
            "u_footer": u_footer,
            backTop
        },
        name: "e_position",
        mounted() {
            let _this = this;
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                _this.users = res.data;
            });

            //加载供选择的职位
            _this.$ajax.post('/readJSONFile', "allTradeTreeRoot").then(function (res) {
                _this.positionSelector = res.data;
            });
            //城市选择器
            _this.$ajax.post('/readJSONFile', "city", {emulateJSON: true}).then((res) => {
                _this.citySelector = res.data;
            });

            //进入该卡片的动作
            let action = _this.$route.query.action,
                tempPosition;
            //传到该页面的数据！！！
            if (typeof (_this.$route.query.position) != 'undefined') {
                tempPosition = JSON.parse(_this.$route.query.position);
            }
            _this.collected = _this.$route.query.collected;

            //企业版 添加职位
            if (action == 'e_add' && typeof (tempPosition) == 'undefined') {
                _this.control.e_ = true;
                _this.control.isSee = false;
                _this.$message({type: 'success', message: '职位名称来自职位枚举表'});
                console.log('######这是添加态页面，没有要显示的职位');
            } else {
                console.log('有要显示的职位');
                console.log(tempPosition);
                //填充数据 这种赋值方式以解决填充数据不能编辑输入框的问题
                _this.$set(_this.position, 'name', tempPosition.name);
                _this.$set(_this.position, 'detail', tempPosition.detail);
                //北京(10)上海(5) -> 北京#上海#
                // tempPosition.city.replace(/\([^\)]*\)/g, "#");
                let cities = tempPosition.city.split('#');
                let nums = tempPosition.needNum.split('#');
                console.log('城市数组');
                console.log(cities);
                console.log('人数数组');
                console.log(nums);
                //删除数组初始的一项
                // _this.cityAndNum.splice(0, 1);
                _this.cityAndNum = [];
                for (let i = 0; i < cities.length - 1; i++) {
                    //初始化变量以解决未定义问题
                    // _this.cityAndNum[i] = {};
                    // _this.$set(_this.cityAndNum[i], {});
                    _this.cityAndNum.push({
                        city: cities[i],
                        key: Date.now(),
                        num: nums[i]
                    });
                }
                _this.$set(_this.position, 'workExp', tempPosition.workExp);
                _this.$set(_this.position, 'eduBg', tempPosition.eduBg);
                _this.$set(_this.position, 'salary', tempPosition.salary);
                _this.$set(_this.position, 'salaryFloat', tempPosition.salaryFloat);
                _this.$set(_this.position, 'worktype', tempPosition.worktype);
                _this.$set(_this.position, 'faceto', tempPosition.faceto);
                _this.$set(_this.position, 'releaseTime', tempPosition.releaseTime);
                _this.$set(_this.position, 'trade', tempPosition.trade);
                //企业版浏览态
                if (action == 'e_see') {
                    _this.control.e_ = true;
                    _this.control.isSee = true;
                    _this.control.title = _this.position.name;
                }
                //编辑态
                else if (action == 'e_edit') {
                    _this.control.e_ = true;
                    _this.control.isSee = false;
                    _this.position.id = tempPosition.id;
                    _this.control.title = '编辑职位';
                    _this.control.submitButtonInfo = '保存修改';
                    if (tempPosition.status == '已发布') {
                        _this.position.status = '1';
                    }
                } else if (action == 'u_see') {
                    _this.control.e_ = false;
                    _this.control.isSee = true;
                    //可能要投递的职位
                    _this.position.id = tempPosition.id;
                    _this.position.companyName = tempPosition.companyName;
                    _this.position.companyInfo = tempPosition.companyInfo;
                    _this.position.releaseTime = tempPosition.releaseTime;
                    _this.control.title = _this.position.name;
                }
            }
        },

        data() {
            return {
                //正在添加职位
                addingPosition: false,
                labelWidth1: '60px',
                labelWidth2: '90px',
                //已收藏
                icon1: 'el-icon-star-on',
                //未收藏
                icon2: 'el-icon-star-off',
                collected: -1,
                //不同使用场景的页面控制
                control: {
                    //当前是否为浏览态
                    isSee: false,
                    //当前该卡片是否为企业版
                    e_: true,
                    //卡片标题
                    title: '新增职位',
                    //提交按钮文字
                    submitButtonInfo: '确认新增',
                },

                //发布该职位的人 当前用户
                users: {},
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
                //职位选择器 选择职位名称时
                positionSelector: {},
                //城市选择器
                citySelector: {},
                //职位 表单数据封装
                position: {
                    //职位id
                    id: '',
                    //职位名称 选择 不能新创造
                    name: '',
                    //发布该职位的企业id
                    companyId: '',
                    //发布该职位的用户id
                    userId: '',
                    //职位详细信息 职位要求
                    detail: '',
                    //工作地点----
                    city: '',
                    //该职位需求人数----
                    needNum: '',
                    //工作经验年限要求
                    workExp: '',
                    //学历要求
                    eduBg: '',
                    //最高月薪
                    salary: '',
                    //月薪浮动
                    salaryFloat: '',
                    //工作性质 实习/全职/兼职
                    worktype: '',
                    // 面向：社招/校招
                    faceto: '',
                    //状态
                    status: '0',
                    //公司名称
                    companyName: '',
                    //公司详情
                    companyInfo: '',
                    //职位发布时间
                    releaseTime: '',
                    // 该职位所属行业
                    trade: ''
                },
                //前端数据结构
                workExp_web: ['不要求', '应届毕业生', '3年及以下', '3-5年', '5-10年', '10年以上'],
                //前端数据结构
                eduBg_web: ['不要求', '博士', '硕士', '本科', '大专'],
                worktype_web: ['不限', '全职', '兼职', '实习'],
                faceto_web: ['社招', '校招'],
                //工作地点 该地点需求人数内存前端数据结构
                cityAndNum: [{
                    //工作地点
                    city: [],
                    //该地点需求人数
                    num: '',
                }],
                //职位表单验证
                positionRule: {
                    //选择职位
                    name: [
                        {required: true, message: '请选择职位名称', trigger: 'blur'}
                    ],
                    // 职位详情
                    detail: [
                        {required: true, message: '请填写职位详情', trigger: 'blur'}
                    ],
                    //工作经验
                    workExp: [
                        {required: true, message:'请选择工作年限要求', trigger: 'blur'}
                    ],
                    //学历
                    eduBg: [
                        {required: true, message:'请选择学历要求', trigger: 'blur'}
                    ],
                    // 最高月薪
                    salary: [
                        {required: true, message:'请填写最高月薪', trigger: 'blur'}
                    ],
                    // 月薪浮动
                    salaryFloat: [
                        {required: true, message:'请填写月薪浮动', trigger: 'blur'}
                    ],
                    //工作性质
                    worktype: [
                        {required: true, message:'请选择工作性质', trigger: 'blur'}
                    ],
                    //面向
                    faceto: [
                        {required: true, message:'请选择面向群体', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            //选择职位名称 级联选择器选中值变化时触发
            handleChange(value) {
                let _this = this;
                console.log(value);
                //新增的职位名称
                _this.position.name = value[value.length - 1];
                _this.position.trade = '';
                for (let i = 0; i < value.length - 1; i++) {
                    _this.position.trade = _this.position.trade + value[i] + '/';
                }
            },
            //城市选择器 选中值发生变化时
            handleChange2(value) {
                console.log(value);
            },
            //新增/编辑职位
            submitForm: function (formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.position.companyId = _this.users.companyId;
                        _this.position.userId = _this.users.id;
                        // 遍历数组
                        _this.position.city = '';
                        _this.position.needNum = '';
                        // _this.cityAndNum.forEach(item => {
                        // });
                        for (let i = 0; i < _this.cityAndNum.length; i++) {
                            let oneCity = _this.cityAndNum[i];
                            console.log("每个工作地点：");
                            console.log(oneCity);
                            // 把城市存入数据库即可！！！新增直辖市有问题？？？
                            let temp;
                            //如果是字符串
                            if (typeof (oneCity.city) == 'string') {
                                temp = oneCity.city;
                            }
                            // 如果是数组
                            if (Object.prototype.toString.call(oneCity.city) == '[object Array]') {
                                temp = oneCity.city[oneCity.city.length - 1];
                            }
                            _this.position.city = _this.position.city + temp + ch;
                            _this.position.needNum = _this.position.needNum + oneCity.num + ch;
                        }
                        //这是个小毛病
                        if (_this.position.city == '#') {
                            _this.position.city = '';
                        }
                        if (_this.position.needNum == '#') {
                            _this.position.needNum = '';
                        }
                        console.log('最终要提交的职位：');
                        console.log(_this.position);
                        if (_this.checkForm() == false) {
                            return;
                        }
                        //添加/编辑职位
                        _this.$confirm('确定新增该职位？请认真检查月薪', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            _this.addingPosition = true;
                            _this.$ajax.post('/savePosition', _this.position, {emulateJSON: true}).then((res) => {
                                console.log(res.data);
                                let result = res.data;
                                _this.addingPosition = false;
                                if (result.includes('成功')) {
                                    _this.$message({
                                        showClose: true,
                                        message: result,
                                        type: 'success'
                                    });
                                    _this.position = {};
                                    //后退一页
                                    _this.$router.go(-1);
                                } else {
                                    this.$message.error(result);
                                }
                            });
                        }).catch(() => {
                        });
                    } else {
                        console.log('add position fail');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //删除一个工作地点
            removeCity(item) {
                var index = this.cityAndNum.indexOf(item);
                console.log('索引');
                console.log(index)
                if (index == 0) {
                    this.$message({
                        message: '至少有一个工作地点',
                        type: 'warning',
                    });
                    return;
                }
                this.cityAndNum.splice(index, 1);
            },
            //添加一个工作地点
            addCity() {
                this.cityAndNum.push({
                    city: [],
                    num: '',
                    key: Date.now()
                });
            },
            //检查填写的信息
            checkForm: function () {
                let _this = this;
                if (_this.position.city == '' || _this.position.needNum == '') {
                    _this.$message.error('填写工作地点、人数');
                    return false;
                }
                // 这有可能是字符串 转换一下
                _this.position.salary = parseInt(_this.position.salary + '');
                _this.position.salaryFloat = parseInt(_this.position.salaryFloat + '');
                if (_this.position.salaryFloat >= _this.position.salary) {
                    _this.$message.error('月薪浮动 >= 最高月薪');
                    return false;
                }
                return true;
            },
            // 重置职位表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //取消
            cancel() {
                let _this = this;
                if (_this.control.e_ === true) {
                    _this.$message({
                        type: 'info',
                        message: '填写的数据已作废'
                    });
                    _this.$router.push({
                        path: '/e_positionList',
                        query: {companyId: _this.users.companyId, action: 'e_see'}
                    });
                } else {
                    //返回上一层
                    this.$router.go(-1);
                }
            },
            //申请职位，投递简历
            postResume() {
                let _this = this;
                let job_apply = {userId: _this.users.id, positionId: _this.position.id};
                if (_this.users == '' || _this.position.id == '') {
                    _this.$message({type: 'error', message: '请登录'});
                    return;
                }
                _this.$ajax.post('/postResume', job_apply, {emulateJSON: true}).then((res) => {
                    _this.$message({type: 'info', message: res.data});
                });
            },
            //收藏该职位
            collectPosition() {
                let _this = this;
                let map = {
                    "username": _this.users.username,
                    "positionId": _this.position.id
                };
                if (typeof (_this.users.username) == 'undefined') {
                    _this.$message({type: 'error', message: '请登录'});
                    return;
                }
                _this.$ajax.post('/collectPosition', map, {emulateJSON: true}).then((res) => {
                    _this.$message({type: 'success', message: res.data});
                });
            }
        }
    }
</script>

<style scoped>
    .title {
        text-align: right;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    /*标题*/
    .tit {
        color: darkblue !important;
        background: aliceblue !important;
    }
    .el-form,.el-row {
        width: 1200px;
        margin-left: auto;
        margin-right: auto;
        background-color: aliceblue;
    }
    img {
        width: 1200px;
        height: auto;
    }
    .el-form-item,.el-input {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
    }
    /*职位卡片-文本域字体大小*/
    .textarea >>> .el-textarea__inner{
        font-family:"Microsoft" !important;
        font-size:16px !important;
    }
    /*禁用时背景色和字体颜色*/
    .el-form :disabled {
        background-color: white;
        color: #475669;
    }
    /*120px是header+footer的高度之和 有变化再改（按实际情况改）*/
    .el-main {
        min-height: calc(100vh - 120px)
    }
    .el-cascader {
        width: 100%;
    }
</style>
