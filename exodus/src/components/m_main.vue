<!--管理员主页-->
<template>
    <div>
        <el-container>
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-container>
                    <el-aside>
                        <el-menu>
                            <el-menu-item index="1" @click="userCount">
                                用户
                            </el-menu-item>
                            <el-menu-item index="2" @click="resumeCount">
                                简历
                            </el-menu-item>
                            <el-menu-item index="3">
                                企业
                            </el-menu-item>
                            <el-menu-item index="4" title="更换首页广告">
                                更换广告
                            </el-menu-item>
                            <el-menu-item index="5" @click="online_count" title="点击刷新">
                                已登录在线用户（{{onlineCount}}）
                            </el-menu-item>
                            <el-submenu index="6">
                                <template slot="title">ES管理与维护</template>
                                <el-menu-item @click="es_createIndex" index="6-1" title="索引名：job_search_website">创建索引</el-menu-item>
                                <el-menu-item @click="es_delIndex" index="6-2" title="索引名：job_search_website">删除索引</el-menu-item>
                            </el-submenu>
                            <el-menu-item index="7" @click="picture">
                                图片
                            </el-menu-item>
                        </el-menu>
                    </el-aside>
                    <el-main>
                        <el-row>
                            <el-col :span="12">
                                <div id="userChart" class="chartArea"></div>
                            </el-col>
                            <el-col :span="12">
                                <div id="resumeChart" class="chartArea"></div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <div class="chartArea" style="overflow-y: scroll">
                                    <el-upload
                                        v-for="item in adNum" :key="item"
                                        title="点击以更换广告图片，最好是1920*1080的"
                                        action="http://localhost:8088/uploadPhoto"
                                        multiple
                                        accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :data="uploadCarryData"
                                        :before-upload="beforeAvatarUpload">
                                        <el-image @click="clickAd(item)" :src="require('../assets/ad/'+item+'.jpg')" lazy/>
                                    </el-upload>
                                </div>
                            </el-col>
                        </el-row>
                    </el-main>
                </el-container>
            </el-main>
            <el-footer>
                <component :is="footerComponent"/>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import backTop from "./subComponents/backTop";
    import u_header from "./subComponents/u_header";
    import u_footer from "./subComponents/u_footer";
    import echarts from 'echarts'
    export default {
        // 注册组件
        components: {
            backTop,
            "u_header": u_header,
            "u_footer": u_footer
        },
        name: "m_main",
        mounted() {
            let _this = this;
            _this.userCount();
            _this.resumeCount();
        },

        data() {
            return {
                //广告图片总数
                adNum: 6,
                //已登录在线用户数量
                onlineCount: '',
                //更换广告图片时携带到后端的数据
                uploadCarryData: {
                    username: '',
                    reason: 'adphoto'
                },
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',

                //已注册的用户的情况图表
                userChart: {
                    //图表的名称
                    name: '',
                    //图表的数据 注册用户情况图表的数据 一般是从后端返回的
                    data: []
                },
                //简历图表
                resumeChart: {
                    //名称
                    name: '',
                    //数据
                    data: []
                }
            };
        },
        methods: {
            picture() {
                this.$router.push({path: '/m_picture'});
            },
            //ES 创建索引
            es_createIndex() {
                let _this = this;
                _this.$ajax.post('/createIndex', {}, {emulateJSON: true}).then((res) => {
                    _this.$message({type: 'success', message: res.data});
                });
            },
            //ES 删除索引
            es_delIndex() {
                let _this = this;
                _this.$ajax.post('/delIndex', {}, {emulateJSON: true}).then((res) => {
                    _this.$message({type: 'success', message: res.data});
                });
            },
            // 已登录在线用户
            online_count() {
                let _this = this;
                _this.$ajax.post('/onlineCount', {}, {emulateJSON: true}).then((res) => {
                    _this.onlineCount = res.data;
                });
            },
            //点击广告图片！！！
            clickAd(item) {
                let _this = this;
                console.log(item);
                _this.uploadCarryData.username = item;
            },
            handleAvatarSuccess(res, file) {
                console.log('点击了确认上传');
                console.log(res);
                console.log(file.raw);
                // this.imageUrl = URL.createObjectURL(file.raw);
            },

            //点击确定上传广告图片之前
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    // this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            //已注册用户
            userCount() {
                let _this = this;
                _this.userChart.data = [];
                _this.$ajax.post('/userCount', {}, {emulateJSON: true}).then((res) => {
                    console.log(res.data);
                    let userActor = ['求职者', '招聘者', '管理员'];
                    for (let i = 0; i < res.data.length; i++) {
                        _this.userChart.data.push({
                            value: res.data[i],
                            name: userActor[i]
                        });
                    }
                    console.log(_this.userChart.data);
                    _this.$nextTick(function () {
                        _this.drawUserChart('userChart');
                    });
                });
            },
            //简历个数
            resumeCount() {
                let _this = this;
                _this.$ajax.post('/resumeCount', {}, {emulateJSON: true}).then((res) => {
                    console.log(res.data);
                    _this.resumeChart.data = res.data;
                    _this.$nextTick(function () {
                        _this.drawResumeChart('resumeChart');
                    });
                });
            },
            //画用户图表
            drawUserChart(id) {
                let _this = this;
                let temp = [];
                for (let i = 0; i < _this.userChart.data.length; i++) {
                    temp.push(_this.userChart.data[i].name)
                }
                _this.userChart.name = echarts.init(document.getElementById(id));
                _this.userChart.name.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a}<br/>{b}:{c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: temp
                    },
                    series: [
                        {
                            name: '已注册用户',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'blod'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: _this.userChart.data
                        }
                    ]
                })
            },
            //画简历图表
            drawResumeChart(id) {
                let _this = this;
                _this.resumeChart.name = echarts.init(document.getElementById(id));
                _this.resumeChart.name.setOption({
                    legend: {},
                    tooltip: {},
                    dataset: {
                        source: [
                            ['product', '总简历数'],
                            ['总简历数', _this.resumeChart.data.length]
                        ]
                    },
                    xAxis: {type: 'category'},
                    //y轴刻度 数值轴
                    yAxis: {minInterval: 1, type: 'value'},
                    series: [
                        //柱状图宽度
                        {type: 'bar', barWidth: 30}
                    ]
                });
            }
        }
    }
</script>

<style scoped>
    /*120px是header+footer的高度之和 有变化再改（按实际情况改）*/
    .el-main {
        min-height: calc(100vh - 120px)
    }
    /*图表区*/
    .chartArea {
        width: 600px;
        height: 400px;
    }
</style>
