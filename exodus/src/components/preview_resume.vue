<!--预览简历-->
<template>
    <div>
        <el-container>
            <el-main>
                <el-row>
                    <el-col :span="24" class="contentAtRight">
                        <el-button type="danger" v-print="'#pdf'">导出简历</el-button>
                        <el-button type="success" @click="ExportSavePdf('#pdf','简历_李篪')">导出简历</el-button>
                    </el-col>
                </el-row>
                <!--打印的区域-->
                <div id="pdf">
                    <!--简历基本信息-->
                    <div id="resume">
                        <!--求职者姓名性别等-->
                        <div class="left">
                            <el-row>
                                <el-col :span="24" class="contentAtLeft">
                                    <h1>
                                        {{resume.name}}&emsp;
                                        {{age}}岁&emsp;
                                        求职意向：{{resume.jobIntent}}
                                    </h1>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24" class="contentAtLeft">
                                    {{resume.telephone}}&emsp;
                                    {{resume.email}}&emsp;
                                    {{resume.location}}
                                </el-col>
                            </el-row>
                        </div>
                        <!--简历照片-->
                        <div class="right">
                            <el-image v-if="imageUrl" :src="imageUrl" id="resumeImg" ref="resumeImg"/>
                        </div>
                        <div>
                            <h3 class="contentAtLeft">个人技能</h3>
                            <div class="needProcess manyChar">
                                {{resume.skill}}
                            </div>
                            <h3 v-if="resume.selfeval" class="contentAtLeft">自我评价</h3>
                            <div class="needProcess manyChar">
                                {{resume.selfeval}}
                            </div>
                        </div>
                    </div>
                    <!--教育经历-->
                    <div id="edu_expList">
                        <h3 class="contentAtLeft">教育经历</h3>
                        <div v-for="(item,index) in edu_expList" :key="index">
                            <el-row>
                                <el-col :span="24" class="contentAtLeft">
                                    {{item.begindate}}至{{item.enddate}}&emsp;
                                    {{item.school}}&emsp;
                                    {{item.major}}&emsp;
                                    {{item.eduBg}}
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24" class="contentAtLeft manyChar needProcess">
                                    {{item.award}}
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <!--项目经历-->
                    <div id="project_expList">
                        <h3 class="contentAtLeft">项目经历</h3>
                        <div v-for="(item,index) in project_expList" :key="index">
                            <div>
                                <el-row>
                                    <el-col :span="24" class="contentAtLeft">
                                        （{{index+1}}）{{item.name}}
                                    </el-col>
                                </el-row>
                                <div class="needProcess manyChar">
                                    {{item.detail}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--工作经历-->
                    <div id="work_expList">
                        <h3 class="contentAtLeft">工作经历</h3>
                        <div v-for="(item,index) in work_expList" :key="index">
                            <el-row>
                                <el-col :span="24" class="contentAtLeft">
                                    {{item.begindate}}至{{item.enddate}}&emsp;
                                    {{item.company}}&emsp;
                                    {{item.position}}
                                </el-col>
                            </el-row>
                            <div>
                                <el-row>
                                    <el-col :span="24" class="contentAtLeft">
                                        工作内容：
                                    </el-col>
                                </el-row>
                                <div class="needProcess manyChar">
                                    {{item.detail}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "preview_resume",
        mounted() {
            let _this = this;
            console.log(_this.$route.params.resume);
            console.log(_this.$route.params.edu_expList);
            console.log(_this.$route.params.project_expList);
            console.log(_this.$route.params.work_expList);
            console.log(_this.$route.params.imageUrl);
            console.log(_this.$route.params.age);
            _this.resume = _this.$route.params.resume;
            _this.edu_expList = _this.$route.params.edu_expList;
            _this.project_expList = _this.$route.params.project_expList;
            _this.work_expList = _this.$route.params.work_expList;
            _this.imageUrl = _this.$route.params.imageUrl;
            _this.age = _this.$route.params.age;
            const resumeImg = new Image();
            resumeImg.src = _this.imageUrl;
            //简历照片 要设置成的宽度
            let width;
            resumeImg.onload = function () {
                //获取图片的宽高
                console.log(resumeImg.width);
                console.log(resumeImg.height);
                width = resumeImg.width / resumeImg.height * 200;
                console.log(width);
                //这样一定能缩放图片！！！
                // $('#resumeImg').height(200);
                // $('#resumeImg').width(width);
                _this.$refs.resumeImg.$el.style.height = '200px';
                _this.$refs.resumeImg.$el.style.width = width + 'px';
            };
        },
        data() {
            return {
                //简历基本信息
                resume: {},
                //简历教育经历列表
                edu_expList: [],
                //简历项目经历列表
                project_expList: [],
                //简历工作经历列表
                work_expList: [],
                //简历照片路径
                imageUrl: '',
                //年龄
                age: ''

            };
        },
        methods: {

        }
    };
</script>

<style scoped>
    /*简历基本信息区域*/
    /*px 是像素，相对于屏幕的分辨率，是相对值
    mm 是即毫米，是绝对值，因为，不同屏幕有不同的像素密度比，所以两者是不可转换的。
    A4纸的尺寸是210*297mm。竖向打印，你需要把html页面的内容设置成210mm的宽度。
    */
    #resume,#edu_expList,#project_expList,#work_expList {
        width: 210mm;
        margin-left: auto;
        margin-right: auto;
    }

    .left {
        float: left;
        width: 70%;
    }

    .right {
        float: right;
        width: 30%;
    }
    .left,.right {
        height: 200px;
        background: #66b1ff;
    }
    /*字符串有回车字符 得处理 需要处理的div
    可以把字符串拆分成数组
    还可以回车替换成br
    */
    .needProcess {
        /*white-space: pre-wrap;*/
        white-space: pre-line;
        text-align: left;
    }

    .contentAtLeft {
        text-align: left;
    }
    .contentAtRight {
        text-align: right;
    }

    /*一个段落的文字*/
    .manyChar {
        line-height: 27px;
    }
</style>
