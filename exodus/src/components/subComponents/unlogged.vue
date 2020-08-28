<!--子组件-通用主页未登录-->
<template id="unlogged">
    <div>
        <el-button-group>
            <el-button type="primary" @click="openDialog('login')" icon="el-icon-key">登录</el-button>
            <el-button type="success" @click="openDialog('register')" icon="el-icon-plus">注册</el-button>
        </el-button-group>

        <!--用户登录对话框 三个表单-->
        <el-dialog :visible.sync="loginVisible" center :close-on-click-modal="false">
            <img title="二维码登录" src="../../assets/QRcode.png">
            <el-tabs v-model="loginForm.loginMode"  @tab-click="changeLoginMode('changeLoginMode')" stretch>
                <el-tab-pane name="1" :label="tabTitle[0]">
                    <!--账号密码登录-->
                    <el-form :model="loginForm" :rules="passwordLoginRule" ref="passwordLogin">
                        <el-form-item prop="username">
                            <el-input
                                clearable
                                v-model="loginForm.username"
                                name="username"
                                auto-complete="on"
                                placeholder="用户名"
                                @keyup.enter.native="usernameEnter">
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                type="password"
                                clearable
                                ref="password"
                                v-model="loginForm.password"
                                name="password"
                                auto-complete="on"
                                placeholder="密码"
                                @keyup.enter.native="submitForm('loginForm')">
                                <el-button type="warning" @click="changeLoginMode('forgetPassword')" slot="append">忘记密码</el-button>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane name="2" :label="tabTitle[1]">
                    <!--邮箱验证码登录-->
                    <el-form :model="loginForm" :rules="codeLoginRule" ref="codeLogin" v-show="!showUpdatePw">
                        <el-form-item prop="email">
                            <el-input clearable placeholder="邮箱" v-model="loginForm.email"
                                      @keyup.enter.native="getCode('loginForm')"/>
                        </el-form-item>
                        <el-form-item label="" prop="code">
                            <el-input clearable prop="code" placeholder="验证码" v-model="loginForm.code" ref="code" class="input-with-select">
                                <el-button @click="getCode('loginForm')" slot="append" :disabled="!boolean" title="确保你的电脑已联网">
                                    <span v-show="boolean">获取验证码</span>
                                    <span v-show="!boolean">{{count}} s</span>
                                </el-button>
                            </el-input>
                        </el-form-item>
                    </el-form>

                    <el-form :model="loginForm" :rules="codeLoginRule" ref="showUpdatePw" v-show="showUpdatePw">
                        <el-form-item prop="newPassword">
                            <el-input type="password" clearable placeholder="新密码" v-model="loginForm.newPassword"
                                      @keyup.enter.native="newPasswordEnter"/>
                        </el-form-item>
                        <el-form-item label="" prop="newPasswordConfirm">
                            <el-input type="password" clearable placeholder="新密码确认"
                                      v-model="loginForm.newPasswordConfirm" ref="newPasswordConfirm"/>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>

            <el-row>
                <el-col :span="24" style="text-align: right">
                    <el-button-group>
                        <el-button type="primary" @click="submitForm('loginForm')" icon="el-icon-key"
                                   v-loading.fullscreen.lock="loggingIn">
                            {{loginForm.title}}
                        </el-button>
                        <el-button type="success" @click="openDialog('register')" icon="el-icon-plus">注册</el-button>
                    </el-button-group>
                </el-col>
            </el-row>
        </el-dialog>
        <!--注册对话框-->
        <el-dialog :visible.sync="registerVisible" center :close-on-click-modal="false">
            <el-tabs stretch>
                <el-tab-pane label="用户注册">
                    <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
                        <!--prop和实体类属性一致-->
                        <el-form-item prop="username" label="昵称" :label-width="labelWidth1">
                            <el-input clearable v-model="registerForm.username" placeholder="喜欢的昵称作为用户名"/>
                        </el-form-item>
                        <el-form-item prop="password" label="设置密码" :label-width="labelWidth2">
                            <el-input clearable type="password" v-model="registerForm.password" placeholder="设置登录密码（包含字母、数字）"
                                      name="password" auto-complete="on"/>
                        </el-form-item>
                        <el-form-item prop="passwordConfirm" label="确认密码" :label-width="labelWidth2">
                            <el-input clearable type="password" v-model="registerForm.passwordConfirm"
                                      placeholder="确认登录密码（包含字母、数字）" name="passwordConfirm" auto-complete="on"/>
                        </el-form-item>
                        <el-form-item prop="email" label="邮箱地址" :label-width="labelWidth2">
                            <el-input type="email" clearable v-model="registerForm.email" placeholder="邮箱以确定身份"
                                      name="email" auto-complete="on"/>
                        </el-form-item>
                        <el-form-item prop="code" label="验证码" :label-width="labelWidth2">
                            <el-input clearable prop="code" placeholder="验证码" v-model="registerForm.code" class="input-with-select">
                                <el-button type="primary" @click="getCode('registerForm')" slot="append" :disabled="!boolean" title="确保你的PC已联网">
                                    <span v-show="boolean">获取验证码</span>
                                    <span v-show="!boolean">{{count}} s</span>
                                </el-button>
                            </el-input>
                        </el-form-item>
                        <!--用户类型-->
                        <el-form-item prop="userType" label="你的身份" :label-width="labelWidth2">
                            <el-radio-group v-model="registerForm.userType">
                                <el-radio label="求职者"/>
                                <el-radio label="招聘者（企业版）"/>
                            </el-radio-group>
                        </el-form-item>
                        <!--关注行业-->
                        <el-form-item prop="trade">
                            <el-cascader
                                placeholder="选择感兴趣的行业"
                                filterable
                                v-model="registerForm.trade"
                                :options="positionSelector.options"
                                :props="{ expandTrigger: 'hover' ,multiple: true}"
                                collapse-tags
                                @change="handleChange"
                                clearable/>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>

            <el-row>
                <el-col :span="24" style="text-align: right">
                    <el-button-group>
                        <el-button icon="el-icon-plus" type="success" @click="submitForm('registerForm')">立即注册</el-button>
                        <el-button type="warning" icon="el-icon-refresh-right" @click="resetForm('registerForm')">重置</el-button>
                        <el-button type="primary" @click="openDialog('login')" icon="el-icon-key">登录</el-button>
                    </el-button-group>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    // 设置全局的倒计时的时间
    const TIME_COUNT = 60;
    export default {
        name: "unlogged",
        data() {
            // 注册校验密码
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.registerForm.password) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };

            // 注册验证码校验
            let validateCheckCode = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入验证码'))
                } else {
                    if (value !== '') {
                        let reg = /^[0-9]{6}$/;
                        if (!reg.test(value)) {
                            callback(new Error('6位验证码'))
                        }
                    }
                    callback();
                }
            };

            return {
                //正在登录
                loggingIn: false,
                //布尔值
                boolean: true,
                //登录对话框是否显示
                loginVisible: false,
                //注册对话框是否显示
                registerVisible: false,

                //登录对话框 重置密码表单是否显示
                showUpdatePw: false,

                //标签页标题
                tabTitle: ['密码登录', '邮箱登录'],
                labelWidth1: '60px',
                labelWidth2: '90px',

                //登录表单数据
                loginForm: {
                    //用户id
                    id: '',
                    // 用户名
                    username: '',
                    // 密码
                    password: '',
                    //邮箱
                    email: '',
                    // 验证码
                    code: '',
                    //登录方式 1-密码 2-邮箱 默认1
                    loginMode: '1',
                    //前端-登录表单标题
                    title: '登录',
                    //忘记密码重置密码
                    //新密码
                    newPassword: '',
                    //新密码确认
                    newPasswordConfirm: ''
                },
                //密码登录方式
                passwordLoginRule: {
                    // 用户名
                    username: [
                        {required: true, message: '输入用户名', trigger: 'blur'}
                    ],
                    // 密码
                    password: [
                        {required: true, message: '输入密码', trigger: 'blur'}
                    ]
                },
                //邮箱登录方式
                codeLoginRule: {
                    // 邮箱
                    email: [
                        {required: true, message: '输入邮箱', trigger: 'blur'},
                        {
                            required: true,
                            pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                            message: '邮箱格式错误',
                            trigger: 'blur'
                        }
                    ],
                    // 验证码
                    code: [
                        {required: true, validator: validateCheckCode, trigger: 'blur'}
                    ]
                },
                //注册表单数据
                registerForm: {
                    //用户名
                    username: '',
                    //密码
                    password: '',
                    //确认密码
                    passwordConfirm: '',
                    // 邮箱
                    email: '',
                    // 邮箱验证码
                    code: '',
                    //用户类型
                    userType: '',
                    //感兴趣的行业
                    trade: '',
                },
                //注册时询问感兴趣的行业 显示所有行业名称
                positionSelector: {},

                //验证码倒计时秒数
                count: '',
                timer: null,
                // 用户注册校验规则
                registerRules: {
                    // 用户名
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 6, max: 20, message: '用户名 6 - 20 个字符', trigger: 'blur'}
                    ],
                    // 密码
                    password: [
                        {required: true, message: '请设置密码', trigger: 'blur'},
                        {min: 8, max: 20, message: '密码 8 - 20 个字符', trigger: 'blur'}
                    ],
                    // 确认密码
                    passwordConfirm: [
                        {required: true, validator: validatePass2, trigger: 'blur'}
                    ],
                    // 邮箱
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {
                            required: true,
                            pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                            message: '邮箱格式错误',
                            trigger: 'blur'
                        }
                    ],
                    // 验证码
                    code: [
                        {required: true, validator: validateCheckCode, trigger: 'blur'}
                    ],
                    //用户类型
                    userType: [
                        {required: true, message: '请选择用户类型', trigger: 'change'}
                    ],
                    //感兴趣的行业
                    trade: [
                        {required: false, message: '选择感兴趣的行业', trigger: 'blur'}
                    ],
                }
            };
        },

        methods: {
            handleChange(value) {

            },
            //打开用户注册对话框
            openDialog(which) {
                let _this = this;
                if (which == 'register') {
                    _this.loginVisible = false;
                    _this.registerVisible = true;
                    //页面加载时 加载行业
                    _this.$ajax.post('/readJSONFile', "allTradeTreeRoot").then(function (res) {
                        _this.positionSelector = res.data;
                    });
                } else if (which == 'login') {
                    _this.registerVisible = false;
                    _this.loginVisible = true;
                }
            },

            // 切换登录方式时 点击忘记密码时
            changeLoginMode(reason) {
                let _this = this;
                if (reason == 'changeLoginMode') {
                    _this.loginForm.title = '登录';
                    _this.showUpdatePw = false;
                    if (_this.loginForm.loginMode == '1') {
                        _this.tabTitle[1] = '邮箱登录';
                    } else if (_this.loginForm.loginMode == '2') {
                    }
                }
                //忘记密码时
                else if (reason == 'forgetPassword') {
                    _this.loginForm.loginMode = '2';
                    _this.loginForm.title = '找回';
                    _this.tabTitle[1] = '找回密码';
                    _this.showUpdatePw = false;
                }
            },

            // 重置注册表单
            resetForm(ref) {
                this.$refs[ref].resetFields();
            },

            //提交登录/注册表单
            submitForm(ref) {
                let _this = this;
                let url;
                let data;
                //登录
                if (ref == 'loginForm') {
                    let loginMode = _this.loginForm.loginMode;
                    url = '/login';
                    data = _this.loginForm;
                    if (_this.showUpdatePw == true) {
                        ref = 'showUpdatePw';
                        url = '/updatePassword';
                    } else if (loginMode == '1') {
                        ref = 'passwordLogin';
                    } else if (loginMode == '2') {
                        ref = 'codeLogin';
                    }
                }
                //注册
                else if (ref == 'registerForm') {
                    console.log(_this.registerForm.userType);
                    _this.registerForm.userType == '求职者' ? _this.registerForm.userType = '1' : _this.registerForm.userType = '2';
                    url = '/register';
                    data = _this.registerForm;
                }
                _this.$refs[ref].validate((valid) => {
                    if (valid) {
                        _this.loggingIn = true;
                        _this.$ajax.post(url, data, {emulateJSON: true}).then((res) => {
                            _this.loggingIn = false;
                            let result = res.data;
                            console.log(result);
                            console.log(typeof (result));
                            if (result.includes('成功')) {
                                //机智死我了
                                if (_this.tabTitle[1] == '找回密码') {
                                    //很重要
                                    _this.$ajax.post('/isLogged', {}, {emulateJSON: true}).then(function (res) {
                                        _this.loginForm.id = res.data.id;
                                        _this.loginForm.loginMode = '2';
                                        _this.showUpdatePw = true;
                                        //秒改变标题
                                        _this.tabTitle[1] = '重置密码';
                                        _this.loginForm.title = '确认';
                                    });
                                    return;
                                }
                                _this.$message({
                                    message: result,
                                    type: 'success',
                                });

                                if (result.includes('登录') || result.includes('密码重置')) {
                                    _this.loginVisible = false;
                                    _this.loginForm = {};
                                    _this.$router.go(0);
                                } else if (result.includes('注册')) {
                                    _this.registerVisible = false;
                                    _this.registerForm = {};
                                }
                            } else {
                                _this.$message.error(result);
                            }
                        });
                    } else {
                        console.log(ref + '提交失败');
                        return false;
                    }
                });
            },

            // 向后端发请求的点击事件 获取验证码
            getCode(ref) {
                let _this = this;
                if (_this.boolean == false) {
                    _this.$refs.code.focus();
                    return;
                }
                // 邮箱
                let email;
                if (ref == 'loginForm') {
                    email = _this.loginForm.email;
                } else if (ref == 'registerForm') {
                    email = _this.registerForm.email;
                }
                if (email === '') {
                    _this.$message.error('请填写邮箱');
                } else {
                    _this.$ajax.post('/mail/getCheckCode', {'email': email}, {emulateJSON: true}).then(function (res) {
                        // 用浏览器sessionStorage+md5加密存下来，这不合理，得用redis做缓存
                        // sessionStorage.setItem('checkCode', md5(res.data.data));
                        // res = JSON.stringify(res.data);
                        //超过响应时间则不执行该括号内代码
                        _this.$message({
                            message: res.data,
                            type: 'success',
                        });
                        if (res.data.includes('失败')) {
                            _this.boolean = true;
                            clearInterval(_this.timer);
                            _this.timer = null;
                        }
                    });
                    // 验证码倒计时
                    if (!_this.timer) {
                        _this.count = TIME_COUNT;
                        _this.boolean = false;
                        _this.timer = setInterval(() => {
                            if (_this.count > 0 && _this.count <= TIME_COUNT) {
                                _this.count--;
                            } else {
                                _this.boolean = true;
                                clearInterval(_this.timer);
                                _this.timer = null;
                            }
                        }, 1000)
                    }
                }
            },

            //用户名文本框的回车事件
            usernameEnter() {
                this.$refs.password.focus();
            },
            //新密码回车
            newPasswordEnter() {
                this.$refs.newPasswordConfirm.focus();
            }
        }
    }
</script>

<style scoped>
    .el-tabs,.el-row {
        width: 80%;
        margin-right: auto;
        margin-left: auto;
    }
    .el-row {
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .el-dialog img {
        position: absolute;
        width: 52px;
        height: 52px;
        top: 0px;
        left: 0px;
        cursor: pointer;
    }
</style>
