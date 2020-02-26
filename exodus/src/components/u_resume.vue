<!--
用户版简历卡片-增改查
企业版简历卡片-查-->
<template>
    <div>
        <el-container>
            <el-header>
                <component :is="headerComponent"/>
            </el-header>
            <el-container ref="entirePage">
                <el-aside>
                    <el-upload
                        class="avatar-uploader"
                        action="http://localhost:8088/uploadPhoto"
                        multiple
                        title="点击以上传或更换简历照片"
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :data="uploadCarryData"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"/>
                    </el-upload>
                    <el-divider/>
                    <el-menu
                        default-active="1"
                        class="el-menu-vertical-demo">
                        <el-menu-item index="0">
                            <el-progress title="简历完整度" :text-inside="true" :stroke-width="26" :percentage="resumeIntegrity" status="success"/>
                        </el-menu-item>
                        <el-menu-item index="1" @click="goAppointForm('#resumePart')">
                            <i class="el-icon-user"/>
                            <span slot="title">基本信息</span>
                        </el-menu-item>
                        <el-menu-item index="2" @click="goAppointForm('#edu_expPart')">
                            <i class="el-icon-notebook-2"/>
                            <span slot="title">教育经历</span>
                        </el-menu-item>
                        <el-menu-item index="3" @click="goAppointForm('#project_expPart')">
                            <i class="el-icon-cpu"/>
                            <span slot="title">项目经历</span>
                        </el-menu-item>
                        <el-menu-item index="4" @click="goAppointForm('#work_expPart')">
                            <i class="el-icon-monitor"/>
                            <span slot="title">工作经历</span>
                        </el-menu-item>
                        <el-menu-item index="5">
                            <i class="el-icon-upload2"/>
                            <span slot="title">上传附件简历</span>
                        </el-menu-item>
                        <el-menu-item index="6" v-print="'#pdf'">
                            <i class="el-icon-download"/>
                            <span slot="title">导出为PDF</span>
                        </el-menu-item>
                    </el-menu>
                    <el-divider/>
                </el-aside>
                <!--生成pdf的部分-->
                <el-main id="pdf">
                    <!--第一部分-->
                    <el-row id="resumePart">
                        <el-col :span="24">
                            <el-button-group>
                                <el-button title="个人介绍" plain :disabled="true" icon="el-icon-arrow-down">基本信息</el-button>
                                <el-button plain type="success" icon="el-icon-edit" @click="editForm(resume,'resume')">编辑</el-button>
                                <el-button plain type="success" icon="el-icon-check" @click="submitForm(resume,'resume')">保存</el-button>
                                <el-button plain type="success" icon="el-icon-delete" @click="resetForm('resume')">清空</el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                    <el-form :model="resume" :rules="resumeRule" ref="resume" :disabled="!resume.canEdit">
                        <el-row>
                            <el-col :span="5">
                                <el-form-item prop="name">
                                    <el-input title="姓名" v-model="resume.name" placeholder="真实姓名" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11" offset="1">
                                <el-form-item prop="jobIntent">
                                    <el-input title="求职意向 求职目标" v-model="resume.jobIntent" placeholder="求职意向" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3" offset="1">
                                <el-form-item prop="sex">
                                    <el-radio-group fill="#67C23A" v-model="resume.sex" title="性别">
                                        <el-radio-button label="男"/>
                                        <el-radio-button label="女"/>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <el-tag title="年龄" type="success">{{resume.age_web+'岁'}}</el-tag>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5">
                                <el-form-item prop="telephone">
                                    <el-input title="手机号" v-model="resume.telephone" placeholder="手机号" clearable type="number"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5" offset="1">
                                <el-form-item prop="email">
                                    <el-input title="邮箱" v-model="resume.email" placeholder="邮箱" clearable type="email"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5" offset="1">
                                <el-form-item prop="location">
                                    <el-input title="现居地 现住址" v-model="resume.location" placeholder="现居地" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5" offset="1">
                                <el-form-item prop="birthday">
                                    <el-date-picker
                                        v-model="resume.birthday"
                                        type="date"
                                        title="生日"
                                        placeholder="生日"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="23">
                                <el-form-item prop="skill">
                                    <el-input :autosize="{ minRows: 4, maxRows: 10}" :rows="10" maxlength="600"
                                              show-word-limit title="个人专业技能" class="textarea" type="textarea"
                                              v-model="resume.skill" placeholder="个人技能" clearable/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="23">
                                <el-form-item prop="selfeval">
                                    <el-input :autosize="{ minRows: 3, maxRows: 6}" :rows="6" maxlength="400"
                                              show-word-limit title="自我评价" class="textarea" type="textarea"
                                              v-model="resume.selfeval" placeholder="自我评价" clearable/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-divider content-position="right">基本信息End</el-divider>
                    <!--第二部分-->
                    <el-row id="edu_expPart">
                        <el-col :span="24">
                            <el-button-group>
                                <el-button title="教育背景" plain :disabled="true" icon="el-icon-arrow-down">教育经历</el-button>
                                <el-button plain type="success" icon="el-icon-edit" @click="editForm(edu_expList[edu_expCurrentIndex],'edu_exp')">编辑</el-button>
                                <el-button plain type="success" icon="el-icon-check" @click="submitForm(edu_expList[edu_expCurrentIndex],'edu_exp')">保存</el-button>
                                <el-button plain type="success" icon="el-icon-delete" @click="resetForm('edu_exp')">清空</el-button>
                                <el-button plain type="success" icon="el-icon-plus" @click="addEdu_exp">教育经历</el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-tabs v-model="edu_expCurrentIndex" type="card" closable @tab-remove="removeEdu_exp">
                                <el-tab-pane v-for="(item, index) in edu_expList" :key="index" :label="'教育经历'+index" :name="index">
                                    <el-form :model="item" :rules="edu_expRule" ref="edu_exp" :disabled="!item.canEdit">
                                        <el-row>
                                            <el-col :span="5">
                                                <el-form-item prop="eduBg">
                                                    <el-select title="学历学位" clearable v-model="item.eduBg" placeholder="学历">
                                                        <el-option v-for="it in eduBg_web" :key="it" :label="it" :value="it"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="5" offset="1">
                                                <el-form-item prop="school">
                                                    <el-input title="学校名称" clearable v-model="item.school" placeholder="学校名称"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="5" offset="1">
                                                <el-form-item prop="major">
                                                    <el-input title="专业名称" clearable v-model="item.major" placeholder="专业"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="5" offset="1">
                                                <el-form-item prop="ranking">
                                                    <el-select title="专业学习排名" clearable v-model="item.ranking" placeholder="学习排名">
                                                        <el-option
                                                            v-for="it in ranking_web"
                                                            :key="it"
                                                            :label="it"
                                                            :value="it">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="5">
                                                <el-form-item prop="begindate">
                                                    <el-date-picker
                                                        title="入学时间"
                                                        v-model="item.begindate"
                                                        type="date"
                                                        placeholder="开始日期"
                                                        format="yyyy 年 MM 月 dd 日"
                                                        value-format="yyyy-MM-dd">
                                                    </el-date-picker>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="5" offset="1">
                                                <el-form-item prop="enddate">
                                                    <el-date-picker
                                                        title="毕业时间"
                                                        v-model="item.enddate"
                                                        type="date"
                                                        placeholder="结束日期"
                                                        format="yyyy 年 MM 月 dd 日"
                                                        value-format="yyyy-MM-dd">
                                                    </el-date-picker>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="23">
                                                <el-form-item prop="award">
                                                    <el-input maxlength="400" show-word-limit title="在校期间主要获得奖项 获奖情况" class="textarea" type="textarea" v-model="item.award" :rows="8" placeholder="主要获得奖项"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-row>
                    <el-divider content-position="right">教育经历End</el-divider>
                    <!--第三部分-->
                    <el-row id="project_expPart">
                        <el-col :span="24">
                            <el-button-group>
                                <el-button plain :disabled="true" icon="el-icon-arrow-down">项目经历</el-button>
                                <el-button plain type="success" icon="el-icon-edit" @click="editForm(project_expList[project_expCurrentIndex],'project_exp')">编辑</el-button>
                                <el-button plain type="success" icon="el-icon-check" @click="submitForm(project_expList[project_expCurrentIndex],'project_exp')">保存</el-button>
                                <el-button plain type="success" icon="el-icon-delete" @click="resetForm('project_exp')">清空</el-button>
                                <el-button plain type="success" icon="el-icon-plus" @click="addProject_exp">项目经历</el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-tabs v-model="project_expCurrentIndex" type="card" closable @tab-remove="removeProject_exp">
                                <el-tab-pane v-for="(item, index) in project_expList" :key="index" :label="'项目经历'+index" :name="index">
                                    <el-form :model="item" ref="project_exp" :rules="project_expRule" :disabled="!item.canEdit">
                                        <el-row>
                                            <el-col :span="5">
                                                <el-form-item prop="name">
                                                    <el-input title="项目名称" clearable v-model="item.name" placeholder="项目名称"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="23">
                                                <el-form-item prop="detail">
                                                    <el-input maxlength="1000" show-word-limit title="项目描述介绍" v-model="item.detail" class="textarea" type="textarea" placeholder="项目描述" :rows="8"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-row>
                    <el-divider content-position="right">项目经历End</el-divider>
                    <!--第四部分-->
                    <el-row id="work_expPart">
                        <el-col :span="24">
                            <el-button-group>
                                <el-button plain :disabled="true" icon="el-icon-arrow-down">工作经历</el-button>
                                <el-button plain type="success" icon="el-icon-edit" @click="editForm(work_expList[work_expCurrentIndex],'work_exp')">编辑</el-button>
                                <el-button plain type="success" icon="el-icon-check" @click="submitForm(work_expList[work_expCurrentIndex],'work_exp')">保存</el-button>
                                <el-button plain type="success" icon="el-icon-delete" @click="resetForm('work_exp')">清空</el-button>
                                <el-button plain type="success" icon="el-icon-plus" @click="addWork_exp">工作经历</el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-tabs v-model="work_expCurrentIndex" type="card" closable @tab-remove="removeWork_exp">
                                <el-tab-pane v-for="(item, index) in work_expList" :key="index" :label="'工作经历'+index" :name="index">
                                    <el-form :model="item" :rules="work_expRule" ref="work_exp" :disabled="!item.canEdit">
                                        <el-row>
                                            <el-col :span="5">
                                                <el-form-item prop="company">
                                                    <el-input title="公司名称" clearable v-model="item.company" placeholder="公司名称"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="5" offset="1">
                                                <el-form-item prop="department">
                                                    <el-input title="工作部门" clearable v-model="item.department" placeholder="所在部门"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="5" offset="1">
                                                <el-form-item prop="position">
                                                    <el-input title="所在岗位" clearable v-model="item.position" placeholder="职位"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="5" offset="1">
                                                <el-form-item prop="worktype">
                                                    <el-select title="实习 or 工作" clearable v-model="item.worktype" placeholder="工作类型">
                                                        <el-option v-for="it in worktype_web" :key="it" :label="it" :value="it"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="5">
                                                <el-form-item prop="begindate">
                                                    <el-date-picker
                                                        title="入职时间"
                                                        v-model="item.begindate"
                                                        type="date"
                                                        placeholder="开始日期"
                                                        format="yyyy 年 MM 月 dd 日"
                                                        value-format="yyyy-MM-dd">
                                                    </el-date-picker>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="5" offset="1">
                                                <el-form-item prop="enddate">
                                                    <el-date-picker
                                                        title="离职时间"
                                                        v-model="item.enddate"
                                                        type="date"
                                                        placeholder="结束日期 未结束不用填"
                                                        format="yyyy 年 MM 月 dd 日"
                                                        value-format="yyyy-MM-dd">
                                                    </el-date-picker>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="1">
                                                <el-tag v-show="item.toNow_web" type="success">至今</el-tag>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="23">
                                                <el-form-item prop="detail">
                                                    <el-input title="具体工作详情" maxlength="600" show-word-limit class="textarea" type="textarea" :rows="8" clearable v-model="item.detail" placeholder="具体工作详情"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-row>
                    <el-divider content-position="right">工作经历End</el-divider>

                    <back-top/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import u_header from "./subComponents/u_header";
    import backTop from "./subComponents/backTop";
    const loginURL = '/isLogged';
    export default {
        components: {
            backTop,
            "u_header": u_header
        },
        name: "u_resume",
        // html加载完成后执行。执行顺序：子组件-父组件
        mounted() {
            let _this = this;
            // 获取浏览器可视区域高度 F12会变
            _this.clientHeight = document.documentElement.clientHeight;
            console.log('浏览器可视区域高度');
            console.log(_this.clientHeight);
            window.onresize = function temp() {
                _this.clientHeight = document.documentElement.clientHeight;
            };
        },

        // html加载完成之前，执行。执行顺序：父组件-子组件
        created() {
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
                //当前用户
                _this.users = res.data;
                //上传文件携带的数据
                _this.uploadCarryData.username = _this.users.username;

                // 加载简历照片
                var map = {
                    "username": _this.users.username,
                    //请求的原因
                    "reason": "resumephoto"
                };
                _this.$ajax.post('/loadPhoto', map, {emulateJSON: true}).then((res) => {
                    var pictureName = res.data;
                    //有简历照片则加载简历照片
                    _this.imageUrl = require('../assets/resumePhoto/' + pictureName);
                });

                //加载简历基本信息 简历基本信息不写教育经历等都删除
                let userId = res.data.id;
                console.log('用户id');
                console.log(userId);
                //这很关键！！
                _this.resume.userId = userId;
                _this.$ajax.post('/getResumeByUserId', userId, {emulateJSON: true}).then((res) => {
                    console.log('该用户的简历基本信息');
                    console.log(res.data);
                    //后端返回null时
                    if (res.data == '') {
                        _this.$message({type: 'warning', message: '简历完整度' + _this.resumeIntegrity});
                        return;
                    }
                    if (_this.resumeIntegrity != 100) {
                        _this.resumeIntegrity = _this.resumeIntegrity + 25;
                    }
                    var tempResume = res.data;
                    //填充数据
                    _this.$set(_this.resume, 'id', tempResume.id);
                    _this.$set(_this.resume, 'userId', tempResume.userId);
                    _this.$set(_this.resume, 'name', tempResume.name);
                    _this.$set(_this.resume, 'sex', tempResume.sex);
                    _this.$set(_this.resume, 'telephone', tempResume.telephone);
                    _this.$set(_this.resume, 'email', tempResume.email);
                    _this.$set(_this.resume, 'birthday', tempResume.birthday);
                    _this.$set(_this.resume, 'location', tempResume.location);
                    _this.$set(_this.resume, 'jobIntent', tempResume.jobIntent);
                    _this.$set(_this.resume, 'selfeval', tempResume.selfeval);
                    _this.$set(_this.resume, 'skill', tempResume.skill);

                    //这时试图加载教育经历
                    _this.$ajax.post('/getEdu_expListByResumeId', _this.resume.id, {emulateJSON: true}).then((res) => {
                        if (res.data.length != 0) {
                            console.log('有教育经历');
                            if (_this.resumeIntegrity != 100) {
                                _this.resumeIntegrity = _this.resumeIntegrity + 25;
                            }
                            console.log(res.data);
                            //！！！这样赋值把edu_expList canEdit初始值冲掉了！！！
                            _this.edu_expList = res.data;
                            for (var i = 0; i < _this.edu_expList.length; i++) {
                                _this.$set(_this.edu_expList[i], 'canEdit', false);
                            }
                        } else {
                            _this.edu_expList[_this.edu_expCurrentIndex].resumeId = _this.resume.id;
                        }
                    });

                    //这时候试图加载项目经历
                    _this.$ajax.post('/getProject_expListByResumeId', _this.resume.id, {emulateJSON: true}).then((res) => {
                        if (res.data.length != 0) {
                            console.log('有项目经历');
                            if (_this.resumeIntegrity != 100) {
                                _this.resumeIntegrity = _this.resumeIntegrity + 25;
                            }
                            console.log(res.data);
                            _this.project_expList = res.data;
                            for (var i = 0; i < _this.project_expList.length; i++) {
                                _this.$set(_this.project_expList[i], 'canEdit', false);
                            }
                        } else {
                            _this.project_expList[_this.project_expCurrentIndex].resumeId = _this.resume.id;
                        }
                    });

                    //这时候试图加载工作经历
                    _this.$ajax.post('/getWork_expListByResumeId', _this.resume.id, {emulateJSON: true}).then((res) => {
                        if (res.data.length != 0) {
                            console.log('有工作经历');
                            if (_this.resumeIntegrity != 100) {
                                _this.resumeIntegrity = _this.resumeIntegrity + 25;
                            }
                            console.log(res.data);
                            _this.work_expList = res.data;
                            for (var i = 0; i < _this.work_expList.length; i++) {
                                _this.$set(_this.work_expList[i], 'canEdit', false);
                                if (_this.work_expList[i].enddate == '至今') {
                                    _this.$set(_this.work_expList[i], 'enddate', new Date());
                                    _this.$set(_this.work_expList[i], 'toNow_web', true);
                                }
                            }
                        } else {
                            _this.work_expList[_this.work_expCurrentIndex].resumeId = _this.resume.id;
                        }
                    });
                });
            });
        },

        // 监听一个值的变化，然后执行相对应的函数。
        watch: {
            // 如果clientHeight的值发生改变，这个函数就会运行
            clientHeight: function () {
                this.changeFixed(this.clientHeight);
            },
            //简历基本信息 当生日变化时触发
            birthday(newValue, oldValue) {
                let _this = this;
                console.log('新生日');
                console.log(newValue);
                let age = new Date().getFullYear() - parseInt(newValue.substring(0, 4));
                _this.$set(_this.resume, 'age_web', age);
            },

            enddate(newValue, oldValue) {
                let _this = this;
                console.log('ppo');
                // 新时间
                console.log(newValue);
                let currentDate = new Date();
                let current_date = {
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth() + 1,
                    date: currentDate.getDate(),
                };
                currentDate = current_date.year + '-' + current_date.month + '-' + current_date.date;
                console.log(currentDate);

                var aDate = newValue.split("-");
                var oDate1 = new Date(aDate[0], aDate[1], aDate[2]);
                aDate = currentDate.split("-");
                var oDate2 = new Date(aDate[0], aDate[1], aDate[2]);
                //把相差的毫秒数转换为天数
                var iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
                console.log('相差天数' + iDays);
                if (iDays < 2) {
                    _this.$set(_this.work_expList[_this.work_expCurrentIndex], 'toNow_web', true);
                } else {
                    _this.$set(_this.work_expList[_this.work_expCurrentIndex], 'toNow_web', false);
                }
            }
        },
        // 计算属性，也就是依赖其它的属性计算所得出最后的值
        computed: {
            // 简历基本信息 生日
            birthday() {
                return this.resume.birthday;
            },
            //工作经历 离职时间
            enddate() {
                return this.work_expList[this.work_expCurrentIndex].enddate;
            }
        },

        data() {
            return {
                //上传简历照片时携带到后端的数据
                uploadCarryData: {
                    username: '',
                    reason: 'resumephoto'
                },
                //头像路径
                imageUrl: '',
                users: {},
                //简历完整度 页面加载、保存时更新
                resumeIntegrity: 0,
                //当前教育经历索引
                edu_expCurrentIndex: 0,
                //一个用户的简历-教育经历列表
                edu_expList: [{
                    //教育经历id
                    id: '',
                    //学校名称
                    school: '',
                    //专业
                    major: '',
                    //开始时间
                    begindate: '',
                    //结束时间
                    enddate: '',
                    //学习排名
                    ranking: '',
                    //学历
                    eduBg: '',
                    //奖项
                    award: '',
                    //简历id
                    resumeId: '',
                    //能否编辑
                    canEdit: false
                }],
                //教育经历对象属性集合
                edu_expFieldList: ['school', 'major', 'begindate', 'enddate', 'ranking', 'eduBg', 'award'],


                //当前项目经历索引
                project_expCurrentIndex: 0,
                //一个用户的简历-项目经历列表
                project_expList: [{
                    // 项目经历id
                    id: '',
                    //项目名称
                    name: '',
                    // 项目描述
                    detail: '',
                    //简历id
                    resumeId: '',
                    //能否编辑
                    canEdit: false
                }],


                //当前工作经历索引
                work_expCurrentIndex: 0,
                //一个用户的简历-工作经历列表
                work_expList: [{
                    // 工作经历id
                    id: '',
                    //公司
                    company: '',
                    //部门
                    department: '',
                    //职位
                    position: '',
                    //工作类型
                    worktype: '',
                    //开始日期
                    begindate: '',
                    //结束日期
                    enddate: '',
                    //详情
                    detail: '',
                    //简历id
                    resumeId: '',
                    //能否编辑
                    canEdit: false,
                    //至今
                    toNow_web: false
                }],
                //工作经历对象属性集合
                work_expFieldList: ['company', 'department', 'position', 'worktype', 'begindate', 'enddate', 'detail'],

                //浏览器的高度
                clientHeight: '',
                headerComponent: 'u_header',
                //简历-基本信息
                resume: {
                    //简历基本信息的id
                    id: '',
                    //用户id
                    userId: '',
                    //真实姓名
                    name: '',
                    //性别
                    sex: '',
                    //手机号
                    telephone: '',
                    //邮箱
                    email: '',
                    //生日
                    birthday: '',
                    //现居地
                    location: '',
                    //求职意向
                    jobIntent: '',
                    //自我评价
                    selfeval: '',
                    //个人技能
                    skill: '',
                    //能否编辑
                    canEdit: false,
                    //年龄
                    age_web: 0
                },
                //简历基本信息验证
                resumeRule: {
                    //姓名
                    name: [
                        {required: true, message: '真实姓名', trigger: 'blur'}
                    ],
                    // 性别
                    sex: [
                        {required: true, message: '选择性别', trigger: 'change'}
                    ],
                    //手机号
                    telephone: [
                        {required: true, message: '常用手机号', trigger: 'blur'}
                    ],
                    //邮箱
                    email: [
                        {required: true, message: '常用邮箱', trigger: 'blur'}
                    ],
                    //生日
                    birthday: [
                        {required: true, message: '你的生日', trigger: 'blur'}
                    ],
                    //现居地
                    location: [
                        {required: true, message: '现居地', trigger: 'blur'}
                    ],
                    //求职意向
                    jobIntent: [
                        {required: true, message: '求职意向', trigger: 'blur'}
                    ],
                    //个人技能
                    skill: [
                        {required: true, message: '个人技能', trigger: 'blur'}
                    ]
                },
                //简历-教育经历验证
                edu_expRule: {
                    //学校名称
                    school: [
                        {required: true, message: '学校名称', trigger: 'blur'}
                    ],
                    //专业
                    major: [
                        {required: true, message: '专业', trigger: 'blur'}
                    ],
                    //开始日期
                    begindate: [
                        {required: true, message: '开始日期', trigger: 'blur'}
                    ],
                    //结束日期
                    enddate: [
                        {required: true, message: '结束日期', trigger: 'blur'}
                    ],
                    //学习排名
                    ranking: [
                        {required: true, message: '学习排名', trigger: 'blur'}
                    ],
                    //学历
                    eduBg: [
                        {required: true, message: '学历', trigger: 'blur'}
                    ],
                    //奖项
                    award: [
                        {required: true, message: '奖项', trigger: 'blur'}
                    ]
                },
                //学习排名选项
                ranking_web: ['前5%', '前15%', '前30%', '前50%', '前80%'],
                //学历选项
                eduBg_web: ['博士', '硕士', '本科', '大专'],
                //简历-项目经历验证
                project_expRule: {
                    //项目名称
                    name: [
                        {required: true, message: '项目名称', trigger: 'blur'}
                    ],
                    //项目描述
                    detail: [
                        {required: true, message: '项目描述', trigger: 'blur'}
                    ]
                },
                //简历-工作经历验证
                work_expRule: {
                    //公司
                    company: [
                        {required: true, message: '公司', trigger: 'blur'}
                    ],
                    //部门
                    department: [{required: true, message: '部门', trigger: 'blur'}],
                    //职位
                    position: [{required: true, message: '职位', trigger: 'blur'}],
                    //工作类型
                    worktype: [{required: true, message: '工作类型', trigger: 'blur'}],
                    //开始日期
                    begindate: [{required: true, message: '开始日期', trigger: 'blur'}],
                    //结束日期
                    enddate: [{required: true, message: '结束日期', trigger: 'blur'}],
                    //详情
                    detail: [{required: true, message: '详情', trigger: 'blur'}]
                },
                worktype_web: ['工作', '实习']
            };
        },
        methods: {
            //动态修改样式 头部、侧边固定
            changeFixed(clientHeight) {
                console.log(clientHeight);
                // 滚动区域高度=屏幕高度-60
                this.$refs.entirePage.$el.style.height = clientHeight - 60 + 'px';
            },
            handleAvatarSuccess(res, file) {
                console.log('点击了确认上传');
                console.log(res);
                console.log(file.raw);
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 3;

                if (!isJPG) {
                    // this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 3MB!');
                }
                // return isJPG && isLt2M;
                return isLt2M;
            },
            //新增教育经历
            addEdu_exp() {
                let _this = this;
                _this.edu_expList.push({
                    //教育经历id
                    id: '',
                    //学校名称
                    school: '',
                    //专业
                    major: '',
                    //开始时间
                    begindate: '',
                    //结束时间
                    enddate: '',
                    //学习排名
                    ranking: '',
                    //学历
                    eduBg: '',
                    //奖项
                    award: '',
                    //简历id
                    resumeId: '',
                    //能否编辑
                    canEdit: false
                });
                _this.edu_expCurrentIndex = _this.edu_expList.length - 1;
                //这个简历的教育经历
                _this.edu_expList[_this.edu_expCurrentIndex].resumeId = _this.resume.id;
            },
            //移除一个教育经历 参数：要删的项的索引
            removeEdu_exp(delIndex) {
                let _this = this;
                let list = _this.edu_expList;
                if (list.length == 1) {
                    _this.$message({
                        type: 'error',
                        message: '至少有一个教育经历'
                    });
                    return;
                }
                _this.edu_expCurrentIndex = delIndex;
                if (_this.edu_expCurrentIndex === delIndex) {
                    list.forEach((edu_exp, index) => {
                        if (index === delIndex) {
                            list.splice(index, 1);
                        }
                    });
                }
            },

            //新增项目经历
            addProject_exp() {
                let _this = this;
                _this.project_expList.push({
                    //项目经历id
                    id: '',
                    //项目名称
                    name: '',
                    // 项目描述
                    detail: '',
                    //简历id
                    resumeId: '',
                    //能否编辑
                    canEdit: false
                });
                _this.project_expCurrentIndex = _this.project_expList.length - 1;
                //这个简历的项目经历
                _this.project_expList[_this.project_expCurrentIndex].resumeId = _this.resume.id;
            },
            //移除一个项目经历 参数：要删的项的索引
            removeProject_exp(delIndex) {
                let _this = this;
                let list = _this.project_expList;
                if (list.length == 1) {
                    _this.$message({
                        type: 'error',
                        message: '至少有一个项目经历'
                    });
                    return;
                }
                _this.project_expCurrentIndex = delIndex;
                if (_this.project_expCurrentIndex === delIndex) {
                    list.forEach((project_exp, index) => {
                        if (index === delIndex) {
                            list.splice(index, 1);
                        }
                    });
                }
            },

            //新增工作经历
            addWork_exp() {
                let _this = this;
                _this.work_expList.push({
                    // 工作经历id
                    id: '',
                    //公司
                    company: '',
                    //部门
                    department: '',
                    //职位
                    position: '',
                    //工作类型
                    worktype: '',
                    //开始日期
                    begindate: '',
                    //结束日期
                    enddate: '',
                    //详情
                    detail: '',
                    //简历id
                    resumeId: '',
                    //能否编辑
                    canEdit: false,
                    //至今
                    toNow_web: false
                });
                _this.work_expCurrentIndex = _this.work_expList.length - 1;
                //这个简历的工作经历
                _this.work_expList[_this.work_expCurrentIndex].resumeId = _this.resume.id;
            },
            //移除一个工作经历 参数：要删的项的索引
            removeWork_exp(delIndex) {
                let _this = this;
                let list = _this.work_expList;
                if (list.length == 1) {
                    _this.$message({
                        type: 'error',
                        message: '至少有一个工作经历'
                    });
                    return;
                }
                _this.work_expCurrentIndex = delIndex;
                if (_this.work_expCurrentIndex === delIndex) {
                    list.forEach((work_exp, index) => {
                        if (index === delIndex) {
                            list.splice(index, 1);
                        }
                    });
                }
            },
            //定位到指定表单
            goAppointForm(formId) {
                console.log(formId);
                document.querySelector(formId).scrollIntoView(true);
            },
            // 清空指定表单
            resetForm(ref) {
                let _this = this;
                if (ref == 'edu_exp') {
                    for (var i = 0; i < _this.edu_expFieldList.length; i++) {
                        _this.$set(_this.edu_expList[_this.edu_expCurrentIndex], _this.edu_expFieldList[i], '');
                    }
                } else if (ref == 'resume') {
                    this.$refs[ref].resetFields();
                } else if (ref == 'project_exp') {
                    _this.$set(_this.project_expList[_this.project_expCurrentIndex], 'detail', '');
                } else if (ref == 'work_exp') {
                    for (var i = 0; i < _this.work_expFieldList.length; i++) {
                        _this.$set(_this.work_expList[_this.work_expCurrentIndex], _this.work_expFieldList[i], '');
                    }
                }
            },
            //编辑表单
            editForm(formData, ref) {
                let _this = this;
                //实时改变状态渲染页面
                if (formData.canEdit === false) {
                    _this.$set(formData, 'canEdit', true);
                } else {
                    _this.$set(formData, 'canEdit', false);
                }
            },
            //提交表单
            submitForm(formData, ref) {
                let _this = this;
                if (formData.canEdit == false) {
                    _this.$message.error('无效操作');
                    return;
                }
                if (ref == 'edu_exp' || ref == 'project_exp' || ref == 'work_exp') {
                    if (_this.checkForm(ref) == false) {
                        return;
                    }
                    console.log('提交数据');
                    console.log(formData);
                    _this.$ajax.post('/' + ref, formData, {emulateJSON: true}).then((res) => {
                        _this.$message({type: 'info', message: res.data});
                        formData.canEdit = false;
                    });
                    return;
                }
                //简历基本信息手机号
                if (_this.resume.telephone.toString().length != 11) {
                    _this.$message.error('手机号11位');
                    return;
                }
                //采用这种方式
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        _this.$ajax.post('/' + ref, formData, {emulateJSON: true}).then((res) => {
                            console.log(res.data);
                            _this.$message({
                                type: 'info',
                                message: res.data
                            });
                        });
                        if (ref == 'resume') {
                            _this.resume.canEdit = false;
                        }
                    } else {
                        console.log(ref + '填写的信息有误，不能提交');
                        return false;
                    }
                });
            },
            //教育经历单个表单验证
            checkForm: function (ref) {
                let _this = this;
                if (ref == 'edu_exp') {
                    if (
                        _this.edu_expList[_this.edu_expCurrentIndex].school == '' ||
                        _this.edu_expList[_this.edu_expCurrentIndex].begindate == '' ||
                        _this.edu_expList[_this.edu_expCurrentIndex].enddate == '' ||
                        _this.edu_expList[_this.edu_expCurrentIndex].eduBg == '' ||
                        _this.edu_expList[_this.edu_expCurrentIndex].major == '' ||
                        _this.edu_expList[_this.edu_expCurrentIndex].ranking == '' ||
                        _this.edu_expList[_this.edu_expCurrentIndex].resumeId == ''
                    ) {
                        _this.$message.error('这个教育经历有未输项或者先填写基本信息');
                        return false;
                    }
                    return true;
                } else if (ref == 'project_exp') {
                    if (
                        _this.project_expList[_this.project_expCurrentIndex].detail == ''
                    ) {
                        _this.$message.error('这个项目经历有未输项或者先填写基本信息');
                        return false;
                    }
                    return true;
                } else if (ref == 'work_exp') {
                    if (
                        _this.work_expList[_this.work_expCurrentIndex].begindate == '' ||
                        _this.work_expList[_this.work_expCurrentIndex].detail == '' ||
                        _this.work_expList[_this.work_expCurrentIndex].position == '' ||
                        _this.work_expList[_this.work_expCurrentIndex].company == '' ||
                        _this.work_expList[_this.work_expCurrentIndex].worktype == ''
                    ) {
                        _this.$message.error('这个工作经历有未输项或者先填写基本信息');
                        return false;
                    }
                    return true;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-menu {
        height: 336px;
        overflow-y: auto;
    }
    /*年龄标签*/
    .el-tag {
        height: 45px;
        font-size: 16px;
        line-height: 45px;
        width: 100%;
    }
    .el-form,.el-row,.el-tabs {
        width: 1100px;
        margin-left: auto;
        margin-right: auto;
    }
    .el-form-item {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
    }
    .el-button-group{
        width: 100%;
    }
    .el-divider__text {
        color: coral;
    }
    /*简历-文本域字体大小*/
    .textarea >>> .el-textarea__inner{
        font-family:"Microsoft" !important;
        font-size:16px !important;
    }

    /*简历照片*/
    .avatar-uploader {
        width: 158px;
        height: 230px;
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
        width: 158px;
        height: 230px;
        line-height: 230px;
        text-align: center;
    }
    .avatar {
        width: 158px;
        height: 230px;
        display: block;
    }
    /*禁用时背景色和字体颜色*/
    .el-form :disabled {
        background-color: white;
        color: #475669;
    }
</style>
