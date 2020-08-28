<!--
通用主页子组件[已登录]
本组件的父组件是u_header
-->
<template id="logged">
    <div>
        <!--求职者-->
        <el-dropdown v-show="findJob">
            <!--确定users不为空才渲染-->
            <el-avatar class="el-dropdown-link" v-if="users" :size="60" :src="avatarUrl"/>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-refresh" @click.native="refreshCurrentPage" class="user" title="刷新当前页">
                    {{users.username}}
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-house" @click.native="homePage(users.username)">
                    回到主页
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-bell" @click.native="gochat">
                    <!--消息通知 登录系统后有未读消息，消息源之一：投递记录-->
                    <el-badge :value="msgNum">所有消息通知</el-badge>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-chat-round" @click.native="gochat">
                    聊天
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-notebook-2" @click.native="u_resume" title="填写简历 制作简历">
                    我的简历
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-shopping-cart-2" title="我投递过的职位" @click.native="u_postList">
                    投递箱
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-star-off" title="收藏的职位、公司都在这里"  @click.native="myCollect">
                    我的收藏
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-setting" @click.native="accountSetting(users.username)">
                    账号设置
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-switch-button" @click.native="logout" title="注销">
                    退出登录
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <!--企业版-->
        <el-dropdown v-show="EE">
            <!--确定users不为空才渲染-->
            <el-avatar class="el-dropdown-link" v-if="users" :size="60" :src="avatarUrl"/>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-refresh" @click.native="refreshCurrentPage" class="user" title="刷新当前页">
                    {{users.username}}
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-house" @click.native="homePage(users.username)">
                    回到主页
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-bell" @click.native="gochat" title="所有消息通知">
                    <el-badge :value="msgNum">消息通知</el-badge>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-document" @click.native="drawer = true" title="提醒事项">
                    提醒事项
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-sort-down" @click.native="resumeList" title="投递的简历">
                    简历列表
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-sort-down" @click.native="positionList" title="职位列表">
                    职位管理
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-sort-down" @click.native="u_positionList" title="求职者的职位列表">
                    当前职位
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-monitor" target="_blank" @click.native="myCompany" title="企业需要宣传">
                    我的企业
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-star-off" title="收藏的简历都在这里"  @click.native="">
                    我的收藏
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-setting" @click.native="accountSetting(users.username)">
                    账号设置
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-document-add" title="创建空的用于存储公司概要信息的JSON文件" @click.native="createJSONFile">
                    创建文件
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-apple" title="商品管理" @click.native="productlist">
                    商品管理
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-scissors" title="商品秒杀活动" @click.native="seckilllist">
                    秒杀活动
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-switch-button" @click.native="logout" title="注销">
                    退出登录
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <!--管理员-->
        <el-dropdown v-show="admin">
            <el-avatar class="el-dropdown-link" v-if="users" :size="60" :src="avatarUrl"/>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-refresh" @click.native="refreshCurrentPage" class="user" title="刷新当前页">
                    {{users.username}}
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-house" @click.native="homePage(users.username)">
                    回到主页
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-bell" @click.native="gochat">
                    <el-badge :value="msgNum">所有消息通知</el-badge>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-chat-round" @click.native="gochat">
                    聊天
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-setting" @click.native="accountSetting(users.username)">
                    账号设置
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-switch-button" @click.native="logout" title="注销">
                    退出登录
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <!--抽屉-->
        <el-drawer
            title="我要做的事"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleClose">
            <span>我来啦!</span>
        </el-drawer>
    </div>
</template>

<script>
    const loginURL = '/isLogged';
    export default {
        props: {
            // 接收父组件传来的数据
            users: {
                //用户名
                username: '',
                //用户类型
                userType: '',
                type: Object,
                required: true
            }
        },
        name: "logged",
        mounted() {
            let _this = this;
            //加载该用户收到的消息
            _this.$ajax.get('/getAllMsg').then(function (res) {
                _this.msgNum = res.data;
            });
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                let backStage = res.data;
                if (backStage == '') {
                    _this.$router.push('/');
                    return;
                }
                _this.users = backStage;

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
                    _this.avatarUrl = require('../../assets/headPhoto/' + pictureName);
                });
                let userType = _this.users.userType;
                // 前端组件元素 显示出来的关键！！！
                if (userType == '1') {
                    _this.EE = false;
                    _this.admin = false;
                    _this.findJob = true;
                } else if (userType == '2') {
                    _this.admin = false;
                    _this.findJob = false;
                    _this.EE = true;
                } else if (userType == '3') {
                    _this.findJob = false;
                    _this.EE = false;
                    _this.admin = true;
                }
            });
        },

        data() {
            return {
                //头像url
                avatarUrl: '',
                msgNum: '',
                //求职者下拉菜单
                findJob: false,
                //企业版下拉菜单
                EE: false,
                //管理员下拉菜单
                admin: false,
                // 企业版-抽屉
                drawer: false,
                //企业版-抽屉从左往右打开
                direction: 'rtl'
            };
        },

        methods: {
            //去聊天 消息通知列表
            gochat() {
                let _this = this;
                if (_this.$route.path === '/chat') {
                    //刷新页面
                    _this.$router.go(0);
                    return;
                }
                _this.$router.push({path: '/chat'});
            },
            //主页
            homePage(username) {
                let _this = this;
                if (_this.$route.path === '/') {
                    //刷新页面
                    _this.$router.go(0);
                    return;
                }
                _this.$router.push({path: '/'});
            },
            //打开账号设置页面 参数：用户名
            accountSetting(username) {
                let _this = this;
                console.log(username);
                if (_this.$route.path === '/setting') {
                    //刷新页面
                    _this.$router.go(0);
                    return;
                }
                // 跳转到该页面并传值过去
                _this.$router.push({path: '/setting', query: {username: username}});
            },
            //用户版-我的简历
            u_resume() {
                let _this = this;
                if (_this.$route.path === '/u_resume') {
                    _this.$router.go(0);
                    return;
                }
                _this.$router.push({path: '/u_resume'});
            },
            //企业版-进入我的企业的页面
            myCompany() {
                console.log('公司id：' + this.users.companyId);
                this.$router.push({path: '/e_company', query: {companyId: this.users.companyId}});
            },
            //企业版-关闭抽屉
            handleClose(done) {
                console.log('关闭抽屉');
                done();
            },
            //企业版 简历列表
            resumeList() {
                let _this = this;
                console.log('当前路由');
                console.log(_this.$route.path);
                if (_this.$route.path == '/e_main') {
                    //手动刷新页面
                    _this.$router.go(0);
                    return;
                }
                _this.$router.push({path: '/e_main'});
            },
            // 退出登录
            logout() {
                let _this = this;
                _this.$ajax.post('/logout', _this.users.username, {emulateJSON: true}).then((res) => {
                    //！！！
                    localStorage.setItem('dirPath', null);
                    _this.$message({
                        type: 'info',
                        message: res.data
                    });
                    console.log('当前路由');
                    console.log(_this.$route.path);
                    //不能导航到当前位置
                    if (_this.$route.path === '/') {
                        //手动刷新页面
                        _this.$router.go(0);
                        return;
                    }
                    _this.$router.push({path: '/'});
                });
            },
            //投递箱
            u_postList() {
                let _this = this;
                console.log(_this.users.id);
                if (_this.$route.path === '/e_positionList') {
                    _this.$router.go(0);
                    return;
                }
                _this.$router.push({path: '/e_positionList', query: {userId: _this.users.id, action: 'u_see'}});
            },
            //我的收藏
            myCollect() {
                let _this = this;
                if (_this.$route.path === '/myCollect') {
                    _this.$router.go(0);
                    return;
                }
                _this.$router.push({path: '/myCollect', query: {username: _this.users.username}});
            },
            //企业版-职位列表
            positionList() {
                let _this = this;
                console.log('公司id：' + _this.users.companyId);
                if (_this.$route.path == '/e_positionList') {
                    _this.$router.go(0);
                    return;
                }
                _this.$router.push({
                    path: '/e_positionList',
                    query: {companyId: _this.users.companyId, action: 'e_see'}
                });
            },
            // 用户的职位列表
            u_positionList() {
                this.$router.push({path: '/u_positionList'});
            },
            //创建空JSON文件
            createJSONFile() {
                let _this = this;
                console.log(_this.users.companyId);
                _this.$ajax.post('/createJSONFile', _this.users.companyId, {emulateJSON: true}).then((res) => {
                    _this.$message({type: 'info', message: res.data});
                });
            },

            //打开[商品管理]页面
            productlist() {
                this.$router.push({path: '/e_productlist'});
            },
            //打开秒杀活动页面
            seckilllist() {
                this.$router.push({path: '/e_seckilllist'});
            },
            //刷新当前页
            refreshCurrentPage() {
                this.$router.go(0);
            }
        }
    }
</script>

<style scoped>
    .el-dropdown-link {
        cursor: pointer;
    }
    .user {
        color: blue;
        font-weight: bold;
        font-family: "Courier New";
        font-size: 16px;
    }
</style>
