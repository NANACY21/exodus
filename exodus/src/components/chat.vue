<!--使用场景：客户间私聊、系统消息 的消息列表

访问该页面 2种情况 指定聊天对象了 没指定聊天对象！！！

现在完全用Kafka来完成，
文件方式存储聊天记录：
发一条消息，两个client的本地都新增一条消息
每个本地一个目录，该目录下多个文件，每个文件 - 一个人，按人分类，一个文件中存一个List<Message>对象
-->
<template>
    <div>
        <el-container>
            <el-header height="120px">
                <component :is="headerComponent"/>
            </el-header>
            <el-container class="chat">
                <el-aside>
                    <el-row>
                        <el-col :span="24">
                            <el-input type="text" placeholder="搜索用户" prefix-icon="el-icon-search"/>
                        </el-col>
                    </el-row>
                    <el-row class="chatRow" v-for="(value, key, index) in messageList" :id="index" @click.native="switchChatObj(key,index)" :key="key">
                        <el-col :span="6">
                            <el-avatar shape="square" icon="el-icon-user-solid" :size="45" :src="objAvatarUrl[key]"/>
                        </el-col>
                        <el-col :span="10" class="username">
                            {{key}}<br/>
                            <span v-if="value[value.length-1]">
                                {{value[value.length-1].content}}
                            </span>
                        </el-col>
                        <el-col :span="8" class="time">
                            <span v-if="value[value.length-1] && value[value.length-1].time">
                                {{value[value.length-1].time.substring(0,10)}}
                            </span>
                        </el-col>
                    </el-row>
                </el-aside>

                <el-main>
                    <div v-show="currentObj.show">
                        <el-row>
                            <el-col :span="24" class="currentObjUn">
                                <span>{{currentObj.key}}</span>
                            </el-col>
                        </el-row>
                        <div id="msgArea">
                            <!--这一个div就是一行消息 一条消息-->
                            <el-row v-for="(item,index) in currentObj.value" :key="index">
                                <el-col :span="3" :style="item.from == users.username?'float:right':'float:left'">
                                    <el-avatar shape="square" v-if="users" :size="40" :src="item.from == users.username?myAvatarUrl:objAvatarUrl[currentObj.key]"/>
                                </el-col>
                                <el-col class="oneMsg" :span="9" :style="item.from == users.username?'float:right;text-align: right;background: lawngreen;':'float:left;text-align: left;'">
                                    {{item.content}}
                                </el-col>
                            </el-row>
                        </div>
                        <el-row>
                            <el-col :span="18">
                                <el-input @keyup.enter.native="sendMessage" v-model="message.content"
                                          placeholder="说点什么吧"/>
                            </el-col>
                            <el-col :span="6">
                                <el-button :disabled="!sendButton" type="success" plain @click="sendMessage"
                                           icon="el-icon-position">
                                    发送
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
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
        components: {
            "u_header": u_header,
            "u_footer": u_footer,
        },
        name: "chat",
        watch: {
            // 消息区内的滚动条滚动至最底部 https://blog.csdn.net/u014520745/article/details/70241772
            msgNum(newValue, oldValue) {
                this.$nextTick(() => {
                    var msgArea = this.$el.querySelector("#msgArea");
                    msgArea.scrollTop = msgArea.scrollHeight;
                });
            },

            //监听发送的内容
            message: {
                deep: true,
                handler: function (newVal, oldVal) {
                    let _this = this;
                    let content = newVal.content;
                    if (typeof (content) != 'undefined' && content.length != 0) {
                        _this.sendButton = true;
                    } else {
                        _this.sendButton = false;
                    }
                }
            }
        },

        computed: {
            // 信息条数
            msgNum() {
                return this.currentObj.value.length;
            }
        },
        data() {
            return {
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
                //我的头像url
                myAvatarUrl: '',
                //对方头像url map类型
                objAvatarUrl: {},
                //当前聊天对象的聊天内容 消息对象列表
                currentObj: {
                    key: '',
                    value: [],
                    //chatRow 行索引
                    rowindex: 0,
                    //显示吗？
                    show: false
                },
                //连接对象
                webSocket: '',
                //消息列表 消息 聊天记录列表
                messageList: {},
                // 当前用户 我
                users: {},
                message: {
                    // 发送者用户名
                    from: '',
                    // 接收者用户名
                    to: '',
                    //发送的消息内容
                    content: ''
                },
                //发送按钮能否编辑
                sendButton: false,
                //拉取消息 该变量只读
                pullMsg: ''
            };
        },
        mounted() {
            let _this = this;
            //事先指定了聊天对象
            let withUsername = _this.$route.query.withUsername;
            _this.$ajax.post(loginURL, {}, {emulateJSON: true}).then(function (res) {
                _this.users = res.data;
                let username = _this.users.username;
                if (typeof (username) == 'undefined' || username.length == 0) {
                    _this.$message({type: "error", message: '请登录'});
                    _this.$router.go(-1);
                    return;
                }
                //页面加载完成自动连接websocket
                _this.initWebSocket();
                _this.openFullScreen();
                //加载消息通知
                let map = {
                    "username": username,
                    "withUsername": withUsername,
                };
                //这里 没采取 map新增属性（新增key）！！！ 的方式
                _this.$ajax.post('/messageList', map, {emulateJSON: true}).then(function (res) {
                    // _this.users.username的消息列表
                    _this.messageList = res.data;
                    //联系人个数
                    let objCount = 0;
                    //是否指定了聊天对象 起到定位作用
                    if (typeof (withUsername) != 'undefined') {
                        _this.switchChatObj(withUsername, _this.currentObj.rowindex);
                    }
                    //加载每个对方的头像
                    for (let item in _this.messageList) {
                        let tempMap = {
                            "username": item,
                            //请求的原因
                            "reason": "headphoto"
                        };
                        _this.$ajax.post('/loadPhoto', tempMap, {emulateJSON: true}).then((res) => {
                            console.log('该用户已有头像：' + res.data);
                            let pictureName = res.data;
                            let tempUrl = '';
                            if (pictureName == '加载照片失败') {
                                tempUrl = '失败';
                            } else {
                                tempUrl = require('../assets/headPhoto/' + pictureName);
                            }
                            //map新增属性（新增key）！！！
                            _this.objAvatarUrl[item] = tempUrl;
                            console.log('对方头像');
                            console.log(_this.objAvatarUrl);
                        });
                        objCount = objCount + 1;
                    }
                    _this.pullMsg.close();
                    console.log('刷新成功');
                    if (objCount == 0) {
                        _this.$message({type: 'info', message: '暂无消息'});
                    }
                }).catch(function (error) {
                    //关闭加载
                    _this.pullMsg.close();
                    if (_this.$route.path === '/chat') {
                        _this.$message({type: 'error', message: '拉取消息超时'});
                    }
                });

                //加载我的头像
                let myAva = {
                    "username": _this.users.username,
                    //请求的原因
                    "reason": "headphoto"
                };
                _this.$ajax.post('/loadPhoto', myAva, {emulateJSON: true}).then((res) => {
                    let pictureName = res.data;
                    _this.myAvatarUrl = require('../assets/headPhoto/' + pictureName);
                });
            });
        },
        // 当前页面关闭时
        destroyed() {
            // 离开页面时关闭websocket连接
            this.webSocket.onclose(undefined);
            // this.webSocket.close();
            // 关闭加载
            this.pullMsg.close();
        },
        methods: {
            //拉取消息通知时 加载 拉取成功后消息
            openFullScreen() {
                let _this = this;
                _this.pullMsg = _this.$loading({
                    lock: true,
                    text: '正在拉取消息',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                //从现在开始计时2秒后做这件事 定时器
                setTimeout(() => {

                }, 2000);
            },

            // 切换聊天对象 参数 对方的用户名 得先有_this.messageList！！！
            switchChatObj(username, id) {
                let _this = this;
                // 渲染聊天记录！！！
                for (let item in _this.messageList) {
                    if (item == username) {
                        _this.currentObj.key = item;
                        _this.currentObj.value = _this.messageList[item];
                        //！！！
                        $("#" + _this.currentObj.rowindex + "").removeClass('chatRowClick');
                        _this.currentObj.rowindex = id;
                        $("#" + _this.currentObj.rowindex + "").addClass('chatRowClick');
                        _this.currentObj.show = true;
                    }
                }
            },
            // 发送聊天信息
            sendMessage() {
                let _this = this;
                //发送按钮不可用
                if (_this.sendButton == false) {
                    return;
                }
                //向服务器发消息！！！
                _this.message.from = _this.users.username;
                _this.message.to = _this.currentObj.key;
                //对象转json字符串
                _this.webSocket.send(JSON.stringify(_this.message));
                //！！！
                _this.message = {};
            },
            //前端实时显示消息！！！
            addMessage(message) {
                let _this = this;
                let from = message.from,
                    to = message.to;
                //是否是新聊天对象
                let isNewObj = true;
                //非当前聊天对象/当前聊天对象/我方更新聊天内容！！！
                for (let item in _this.messageList) {
                    if (from == item || to == item) {
                        _this.messageList[item].push(message);
                        _this.currentObj.key = item;
                        _this.currentObj.value = _this.messageList[item];
                        isNewObj = false;
                    }
                }
                //from 是新对象！！！
                if (isNewObj == true) {
                    let temp = [];
                    temp.push(message);
                    //map新增属性（新增key）！！！
                    _this.messageList[from] = temp;
                    _this.currentObj.key = from;
                    _this.currentObj.value = _this.messageList[from];
                }
            },

            // 进入页面创建websocket连接
            initWebSocket() {
                let _this = this;
                // 判断页面有没有存在websocket连接
                if ('WebSocket' in window && window.WebSocket) {
                    //连接到服务器
                    let serverHost = window.location.hostname;
                    let url = "ws://" + serverHost + ":8088/chat/" + _this.users.username;
                    _this.webSocket = new WebSocket(url);
                    console.log(_this.webSocket);
                    //成功连接ChatServer时
                    _this.webSocket.onopen = function (e) {
                        console.log('成功连接ChatServer');
                    };
                    //ChatServer连接关闭时
                    _this.webSocket.onclose = function (e) {
                        console.log('ChatServer连接关闭');
                    };
                    // ChatServer向指定客户端推送消息时
                    _this.webSocket.onmessage = function (res) {
                        //json字符串转消息对象
                        let message = JSON.parse(res.data);
                        _this.addMessage(message);
                    };
                    _this.webSocket.onerror = function () {
                        _this.$message({type: 'error', showClose: true, message: "ChatServer连接失败"});
                    };
                } else {
                    _this.$message({type: 'error', showClose: true, message: "当前浏览器不支持聊天"});
                }
            },
        }
    }
</script>

<style scoped>
    /*聊天应用*/
    .chat {
        width: 900px;
        margin-left: auto;
        margin-right: auto;
        border: 1px solid gray;
    }
    /*每个联系人鼠标悬停时、点击时*/
    .chatRow:hover,.chatRowClick,#msgArea {
        background-color: aliceblue;
    }
    .el-row {
        width: 100%;
        /*代替height*/
        min-height: 60px;
    }
    /*！！！*/
    .el-row .el-col {
        margin-top: 7.5px;
    }
    /*每个联系人用户名 最后一条消息 当前用户名*/
    .username,.currentObjUn {
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .currentObjUn {
        margin-top: 15px !important;
    }
    .el-button {
        width: 90%;
    }
    .el-input {
        width: 95%;
    }
    .time {
    }
    .username span,.time span {
        font-size: 14px;
        color: darkgray;
    }
    .currentObjUn span {
        font-size: 22px;
        margin-left: 20px;
    }

    #msgArea {
        width: 100%;
        height: 500px;
        overflow-y: auto;
    }
    /*使页脚在底部 不飘上来 120px是header+footer的高度之和 有变化再改（按实际情况改）*/
    .el-main {
        min-height: calc(100vh - 120px);
        padding: 0;
    }
    .oneMsg {
        background: white;
        padding: 10px;
        border-radius: 5px;
    }
    .oneMsg:hover {
        background: #d3dce6;
    }
</style>
