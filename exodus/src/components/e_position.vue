<!--职位卡片 使用场景：企业版用户增改查职位、用户版用户查看职位-->
<template>
    <div>
        <el-container>
            <el-header>
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="10" offset="14">
                        <el-button-group>
                            <el-button plain :disabled="true">{{this.control.title}}</el-button>
                            <el-button v-show="control.e_" plain type="primary" icon="el-icon-plus" @click="addCity" :disabled="control.isSee">工作地点</el-button>
                            <el-button v-show="control.e_" plain type="success" icon="el-icon-plus" @click="submitForm('position')" :disabled="control.isSee">{{control.submitButtonInfo}}</el-button>
                            <el-button v-show="control.e_" plain type="warning" icon="el-icon-refresh-right" @click="resetForm('position')" :disabled="control.isSee">重置</el-button>
                            <el-button v-show="!control.e_" plain type="success" icon="el-icon-message" @click="postResume" title="不能重复投递">投递</el-button>
                            <el-button v-show="!control.e_" plain type="success" icon="el-icon-star-off">收藏</el-button>
                            <el-button plain type="info" icon="el-icon-close" @click="cancel">取消</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-form :model="position" :rules="positionRule" ref="position" :disabled="control.isSee">
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="" :label-width="0" prop="name">
                                <el-cascader
                                    placeholder="选择职位"
                                    title="点击以选择职位名称"
                                    v-model="position.name"
                                    :options="allTradeTreeRoot"
                                    :props="{ expandTrigger: 'hover' }"
                                    @change="handleChange"
                                    clearable>
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" offset="1">
                            <el-form-item label="" :label-width="0" prop="releaseTime">
                                <el-input :disabled="true" :placeholder="'发布时间'+position.releaseTime"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-show="!control.e_">
                        <el-col :span="7">
                            <el-form-item label="" :label-width="0" prop="companyName">
                                <el-input :placeholder="'公司名称：'+position.companyName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16" offset="1">
                            <el-form-item label="" :label-width="0" prop="companyInfo">
                                <el-input :placeholder="'公司简介'+position.companyInfo"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="" :label-width="0" prop="detail">
                                <el-input class="textarea" placeholder="职位详细信息" type="textarea" :rows="8" v-model="position.detail" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-for="(item, index) in cityAndNum" :key="item.key">
                        <el-col :span="5">
                            <el-form-item label="" :label-width="0">
                                <el-input clearable suffix-icon="el-icon-office-building" v-model="item.city" placeholder="工作地点"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" offset="1">
                            <el-form-item label="" :label-width="0">
                                <el-input placeholder="该工作地点的人数" clearable type="number" v-model="item.num"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" offset="1" v-show="!control.e_">
                            <el-form-item label="" :label-width="0">
                                <el-input :placeholder="'已投递：'+item.num"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" offset="1">
                            <el-form-item :label-width="0">
                                <el-button plain type="danger" icon="el-icon-delete" @click.prevent="removeCity(item)">删除</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="" :label-width="0" prop="workExp">
                                <el-select clearable v-model="position.workExp" placeholder="工作年限要求">
                                    <el-option v-for="item in workExp_web" :key="item" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" offset="1">
                            <el-form-item label="" :label-width="0" prop="eduBg">
                                <el-select clearable v-model="position.eduBg" placeholder="学历要求">
                                    <el-option v-for="item in eduBg_web" :key="item" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" offset="1">
                            <el-form-item :label-width="0" prop="salary">
                                <el-input type="number" suffix-icon="el-icon-upload2" clearable v-model="position.salary" placeholder="最高月薪"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" offset="1">
                            <el-form-item :label-width="0" prop="salaryFloat">
                                <el-input clearable type="number" v-model="position.salaryFloat" placeholder="月薪浮动"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item :label-width="0" prop="worktype">
                                <el-select clearable v-model="position.worktype" placeholder="工作性质">
                                    <el-option v-for="item in worktype_web" :key="item" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" offset="1">
                            <el-form-item label="" :label-width="0" prop="faceto">
                                <el-select clearable v-model="position.faceto" placeholder="面向">
                                    <el-option v-for="item in faceto_web" :key="item" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import u_header from "./subComponents/u_header";
    const loginURL = '/isLogged';
    //字符
    const ch = '#';
    export default {
        components: {
            "u_header": u_header
        },
        name: "e_position",
        mounted() {
            let _this = this;
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                if (res.data.username == null) {
                    _this.$router.push('/');
                    _this.$message({
                        message: '请先登录',
                        type: 'warning'
                    });
                    return;
                }
                _this.users = res.data;
                console.log('当前用户');
                console.log(_this.users);
            });

            //加载供选择的职位
            _this.$ajax.get('/getAllTradeTreeRoot').then(function (res) {
                _this.allTradeTreeRoot = res.data;
            });

            //进入该卡片的动作
            var action = _this.$route.query.action;
            //传到该页面的数据
            var tempPosition = _this.$route.query.position;

            //企业版 添加职位
            if (action == 'e_add' && typeof (tempPosition) == 'undefined') {
                _this.control.e_ = true;
                _this.control.isSee = false;
                console.log('这是添加态页面，没有要显示的职位');
            } else {
                console.log('有要显示的职位');
                console.log(tempPosition);
                //填充数据 这种赋值方式以解决填充数据不能编辑输入框的问题
                _this.$set(_this.position, 'name', tempPosition.name);
                _this.$set(_this.position, 'detail', tempPosition.detail);
                //北京(10)上海(5) -> 北京#上海#
                var tempCity = tempPosition.city.replace(/\([^\)]*\)/g, "#");
                var cities = tempCity.split('#');
                var nums = tempPosition.needNum.split('#');
                console.log('城市数组');
                console.log(cities);
                console.log('人数数组');
                console.log(nums);
                //删除数组初始的一项
                _this.cityAndNum.splice(0, 1);
                for (var i = 0; i < cities.length - 1; i++) {
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
                }
                else if (action == 'u_see') {
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

                //发布该职位的人
                users: {},
                headerComponent: 'u_header',
                //选择职位名称时 所有行业树根节点
                allTradeTreeRoot: [],
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
                    releaseTime: ''
                },
                //前端数据结构
                workExp_web: ['不限', '一年', '二年'],
                //前端数据结构
                eduBg_web: ['博士', '硕士', '本科', '大专'],
                worktype_web: ['全职', '实习', '兼职'],
                faceto_web: ['社招', '校招'],
                //工作地点 该地点需求人数内存前端数据结构----
                cityAndNum: [{
                    //工作地点
                    city: '',
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
        methods:{
            //选择职位名称 级联选择器选中值变化时触发
            handleChange(value) {
                console.log(value);
                //新增的职位名称
                this.position.name = value[2];
            },
            //新增/编辑职位
            submitForm: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var _this = this;
                        // 职位已发布不能修改
                        if (_this.position.status == '1' && _this.position.id != '' && _this.control.submitButtonInfo=='保存修改') {
                            _this.$message({
                                showClose: true,
                                message: '该职位已经发布不能修改',
                                type: 'error'
                            });
                            return;
                        }
                        _this.position.companyId = _this.users.companyId;
                        _this.position.userId = _this.users.id;
                        // 遍历数组
                        _this.position.city = '';
                        _this.position.needNum = '';
                        _this.cityAndNum.forEach(item => {
                            console.log("每个工作地点：");
                            console.log(item);
                            _this.position.city = _this.position.city + item.city + ch;
                            _this.position.needNum = _this.position.needNum + item.num + ch;
                        });
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
                        _this.$ajax.post('/savePosition', _this.position, {emulateJSON: true}).then((res) => {
                            console.log(res.data);
                            let result = res.data;
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
                    } else {
                        console.log('error submit!!');
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
                    city: '',
                    key: Date.now()
                });
            },
            //检查填写的信息
            checkForm: function () {
                if (this.position.city == '' || this.position.needNum == '') {
                    this.$message.error('填写工作地点、人数');
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
                console.log(this.position.id);
                let _this = this;
                var job_apply = {userId: _this.users.id, positionId: _this.position.id};
                _this.$ajax.post('/postResume', job_apply, {emulateJSON: true}).then((res) => {
                    _this.$message({type: 'info', message: res.data});
                });
            }
        }
    }
</script>

<style scoped>
    .el-form {
        width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }
    .el-form-item {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
    }
    /*职位卡片-文本域字体大小*/
    .textarea >>> .el-textarea__inner{
        font-family:"Microsoft" !important;
        font-size:16px !important;
    }
</style>
