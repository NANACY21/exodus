<!--一家企业的信息-->
<template>
    <div>
        <el-container>
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-container>
                <el-main>
                    <el-row>
                        <el-col :span="2" offset="1">
                            <el-avatar shape="square" v-if="companyId" :size="70"
                                       :src="require('../assets/companyLogo/'+companyId+'.jpg')"/>
                        </el-col>
                        <el-col :span="21">
                            <span>{{company.name}}</span>
                            <el-popover
                                placement="top-start"
                                width="200"
                                trigger="hover"
                                content="已完成资质认证，并完善了更优质的公司主页信息（以上信息由天眼查提供技术支持）">
                                <el-button slot="reference" icon="el-icon-document-checked">繁星认证</el-button>
                            </el-popover>
                            <br/>
                            <el-link target="_blank" type="success" :title="company.website"
                                     :href="company.website">
                                企业官网
                            </el-link>
                        </el-col>
                    </el-row>
                    <h3>公司简介</h3>
                    <p>{{company.introduction.summary}}</p>
                    <h3>公司地点</h3>
                    <p>{{company.introduction.location}}</p>
                    <h3>公司产品</h3>
                    <dl v-for="item in company.productList">
                        <dt>{{item.name}}</dt>
                        <dd>{{item.summary}}</dd>
                    </dl>
                    <h3>公司福利待遇</h3>
                    <dl v-for="item in company.welfareList">
                        <dt>{{item.name}}</dt>
                        <dd>{{item.summary}}</dd>
                    </dl>
                </el-main>
                <el-aside width="400px">
                    <el-divider content-position="left" class="sideTitle">公司基本信息</el-divider>
                    <ul>
                        <li title="企业id">序号 {{companyId}}</li>
                        <li>
                            <i class="el-icon-wind-power"/>
                            {{company.financingStage}}
                        </li>
                        <li>
                            <i class="el-icon-office-building"/>
                            {{company.scale}}
                        </li>
                    </ul>
                    <el-divider content-position="left" class="sideTitle">工商信息</el-divider>
                    <dl>
                        <dt><i class="el-icon-user"/>工商信息</dt>
                        <dd>{{company.businessInfo.name}}</dd>
                        <dt><i class="el-icon-date"/>成立时间</dt>
                        <dd>{{company.businessInfo.establishDate}}</dd>
                        <dt><i class="el-icon-shopping-cart-full"/>注册资本</dt>
                        <dd>{{company.businessInfo.registerMoney}}</dd>
                        <dt><i class="el-icon-user"/>法人代表</dt>
                        <dd>{{company.businessInfo.ceo}}</dd>
                    </dl>
                    <el-divider content-position="left" class="sideTitle">联系我们</el-divider>
                    <ul>
                        <li><i class="el-icon-chat-round"/>{{company.telephone}}</li>
                        <li><i class="el-icon-message"/>{{company.email}}</li>
                    </ul>
                    <el-divider content-position="left" class="sideTitle">公司标签</el-divider>
                    <ul>
                        <li class="tag" v-for="(item,index) in company.tagList">
                            <el-tag :style="randomRgbaColor(index)">{{item}}</el-tag>
                        </li>
                    </ul>
                </el-aside>
            </el-container>
            <el-footer height="180px">
                <component :is="footerComponent"/>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import backTop from "./subComponents/backTop";
    import u_header from "./subComponents/u_header";
    //加载json文件
    import c1 from "../assets/e_data/1.json"
    import u_footer from "./subComponents/u_footer";
    export default {
        // 注册组件
        components: {
            backTop,
            "u_header": u_header,
            "u_footer": u_footer,
        },
        name: "e_company",
        mounted() {
            let _this = this;
            if (_this.companyId == null) {
                _this.companyId = '你尚未加入任何企业！';
                return;
            }
            _this.$ajax.post('/readJSONFile', _this.companyId + "", {emulateJSON: true}).then((res) => {
                _this.company = res.data;
                console.log("我的企业信息");
                console.log(_this.company);
            });
        },
        data() {
            return {
                //显示该公司的信息 接收数据 为String类型时 刷新页面数据不丢失，对象则丢失
                companyId: this.$route.query.companyId,
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
                //公司信息
                company: {},
                //标签颜色
                companyTag: {
                    tagBgColor: ['#EFF9FF', '#F4FDE9', '#FFFAEC', '#FAF0FB', '#F2EFEC', '#FDEAF2', '#FAEDD6'],
                    tagBorderColor: ['#BDD4E5', '#B0CDAC', '#F7AC93', '#F0B9D9', '#D6CCC0', '#F39CC2', '#E9B858'],
                    tagColor: ['#4C79A6', '#55964A', '#CA663C', '#C46AAB', '#AA9881', '#EB5696', '#8E6313']
                }
            };
        },
        methods: {
            //随机生成RGB颜色
            randomRgbaColor(tagIndex) {
                let _this = this;
                console.log('标签个数' + _this.company.tagList.length);
                console.log('tag index' + tagIndex);
                var r = Math.floor(Math.random() * 255); //随机生成255以内r值
                var g = Math.floor(Math.random() * 255); //随机生成255以内g值
                var b = Math.floor(Math.random() * 255); //随机生成255以内b值
                return 'background-color: ' + _this.companyTag.tagBgColor[tagIndex % 7] + ';' +
                    'border-color: ' + _this.companyTag.tagBorderColor[tagIndex % 7] + ';' +
                    'color: ' + _this.companyTag.tagColor[tagIndex % 7] + ';';
            },
        }
    }
</script>

<style scoped>
    li,dd {
        height: 40px;
    }
    li {
        list-style: none;
    }
    i,.tag{
        margin-right: 10px;
    }
    dl,li {
        text-align: left;
    }
    dl {
        padding-left: 40px;
    }
    .tag {
        float: left;
    }
    p {
        text-align: left;
        padding-left: 40px;
    }
    dt {
        color: darkcyan;
    }
    h3,.el-col span {
        color: #475669;
        text-shadow: 5px 0px 10px #ffb3cc;
    }
    .el-col span {
        font-size: 30px;
    }
    h3 {
        text-align: left;
        padding-left: 40px;
    }
    .el-col {
        text-align: left;
    }
    .el-tag {
        font-size: 14px;
        border-radius: 32px;
    }
    .sideTitle {
        text-shadow: 5px 0px 10px #7bff97;
    }
    .el-button {
        position: absolute;
        height: 30px;
        background: #00b38a;
        border: 1px solid #00b38a;
        color: white;
        padding: 0 15px;
        margin-left: 15px;
        top: 5px;
    }
</style>
