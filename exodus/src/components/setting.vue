<!--账号设置页面 显示个人信息-->
<template>
    <div>
        <el-container>
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-container>
                <el-aside>
                    <el-divider/>
                    <el-menu
                        default-active="1"
                        class="el-menu-vertical-demo">
                        <el-menu-item index="1" @click="changeUn">
                            <i class="el-icon-edit"/>
                            <span slot="title">修改用户名</span>
                        </el-menu-item>
                        <el-menu-item index="2" @click="changePw">
                            <i class="el-icon-edit"/>
                            <span slot="title">修改密码</span>
                        </el-menu-item>
                        <el-menu-item index="3" @click="">
                            <i class="el-icon-view"/>
                            <span slot="title">隐藏简历</span>
                        </el-menu-item>
                        <el-menu-item index="4" title="用户身份要认证，如：求职者，hr">
                            <span slot="title">实名认证</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-form :model="users">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item>
                                    <el-upload
                                        title="点击以上传或更换头像"
                                        class="avatar-uploader"
                                        action="http://localhost:8088/uploadPhoto"
                                        multiple
                                        accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :data="uploadCarryData"
                                        :before-upload="beforeAvatarUpload">
                                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"/>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item prop="username" label="用户名" :label-width="labelWidth2">
                                    <el-input @blur="confirmSubmit('/updateUsername','用户名')" v-model="users.username"
                                              :disabled="!users.usernameCanEdit" placeholder="用户名"
                                              clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="password" label="密码" :label-width="labelWidth1">
                                    <el-input v-model="users.password" :disabled="!users.passwordCanEdit"
                                              type="password" placeholder="密码" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col v-show="newPasswordVisible" :span="6">
                                <el-form-item prop="newPassword" label="新密码" :label-width="labelWidth2">
                                    <el-input v-model="users.newPassword" type="password" placeholder="新密码" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col v-show="newPasswordVisible" :span="6">
                                <el-form-item prop="newPasswordConfirm" label="密码确认" :label-width="labelWidth2">
                                    <el-input @blur="confirmSubmit('/updatePassword','密码')"
                                              v-model="users.newPasswordConfirm" type="password" placeholder="新密码确认"
                                              clearable/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-main>
            </el-container>
            <el-footer>
                <component :is="footerComponent"/>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import u_header from "./subComponents/u_header";
    import u_footer from "./subComponents/u_footer";
    const loginURL = '/isLogged';
    export default {
        // 注册组件
        components: {
            "u_header": u_header,
            "u_footer":u_footer
        },
        name: "setting",
        data() {
            return {
                labelWidth1: '60px',
                labelWidth2: '90px',
                //上传头像时携带到后端的数据
                uploadCarryData: {
                    username: '',
                    reason: 'headphoto'
                },
                //点击修改密码
                newPasswordVisible: false,
                //头像路径
                imageUrl: '',
                //用户提交至本网站的个人信息
                users: {
                    //用户id
                    id: '',
                    //用户名
                    username: this.$route.query.username,
                    //密码
                    password: '',
                    //新密码
                    newPassword: '',
                    //新密码确认
                    newPasswordConfirm: '',
                    //登录方式 1-密码 2-邮箱 默认1
                    loginMode: '1',
                    usernameCanEdit: false,
                    passwordCanEdit: false,
                },
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
            };
        },
        mounted() {
            let _this = this;
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                _this.users.id = res.data.id;
            });
            //加载用户个人信息
            console.log('setting页面接收的数据：' + _this.users.username);
            _this.uploadCarryData.username = _this.users.username;
            // 有头像则加载头像
            var map = {
                "username": _this.users.username,
                //请求的原因
                "reason": "headphoto"
            };
            _this.$ajax.post('/loadPhoto', map, {emulateJSON: true}).then((res) => {
                console.log('该用户已有头像：' + res.data);
                var pictureName = res.data;
                //加载上传的头像
                _this.imageUrl = require('../assets/headPhoto/' + pictureName);
            });
        },

        methods: {
            //修改密码
            changePw() {
                let _this = this;
                if (_this.newPasswordVisible === false) {
                    _this.newPasswordVisible = true;
                    _this.users.passwordCanEdit = true;
                } else {
                    _this.newPasswordVisible = false;
                    _this.users.passwordCanEdit = false;
                }
            },
            //修改用户名
            changeUn() {
                let _this = this;
                if (_this.users.usernameCanEdit === false) {
                    _this.users.usernameCanEdit = true;
                    return;
                }
                _this.users.usernameCanEdit = false;
            },
            handleAvatarSuccess(res, file) {
                console.log('点击了确认上传');
                console.log(res);
                console.log(file.raw);
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    // this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                // return isJPG && isLt2M;
                return isLt2M;
            },
            // 确认修改 url 标题
            confirmSubmit(url, hint) {
                let _this = this;
                _this.$confirm('确认修改' + hint + '？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$ajax.post(url, this.users, {emulateJSON: true}).then((res) => {
                        _this.$message({
                            type: 'info',
                            message: res.data
                        });
                        if (hint == '用户名') {
                            _this.changeUn();
                        } else if (hint == '密码') {
                            _this.changePw();
                        }
                    });
                }).catch(() => {
                    _this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .el-form-item,.el-input {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
    }
    /*头像*/
    .avatar-uploader {
        width: 178px;
        height: 178px;
        margin-left: auto;
        margin-right: auto;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    /*120px是header+footer的高度之和 有变化再改（按实际情况改）*/
    .el-main {
        min-height: calc(100vh - 120px)
    }
</style>
