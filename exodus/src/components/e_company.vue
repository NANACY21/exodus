<!--一家企业的信息-->
<template>
    <div>
        <el-container>
            <el-header>
                <component :is="headerComponent"/>
            </el-header>
            <el-container>
                <el-main>
                    <h2>{{company.name}}</h2>
                    <el-divider content-position="left"><h3>公司简介</h3></el-divider>
                    <p>{{company.introduction.summary}}</p>
                    <el-divider content-position="left"><h3>公司地点</h3></el-divider>
                    <p>{{company.introduction.location}}</p>
                    <el-divider content-position="left"><h3>公司产品</h3></el-divider>
                    <dl v-for="item in company.productList">
                        <dt>{{item.name}}</dt>
                        <dd>{{item.summary}}</dd>
                    </dl>
                    <el-divider content-position="left"><h3>公司福利</h3></el-divider>
                    <dl v-for="item in company.welfareList">
                        <dt>{{item.name}}</dt>
                        <dd>{{item.summary}}</dd>
                    </dl>
                </el-main>
                <el-aside width="400px">
                    <el-divider content-position="left">公司基本信息</el-divider>
                    <ul>
                        <li>ID {{companyId}}</li>
                        <li>
                            <i class="el-icon-s-marketing"></i>
                            {{company.financingStage}}
                        </li>
                        <li>
                            <i class="el-icon-office-building"></i>
                            {{company.scale}}
                        </li>
                    </ul>
                    <el-divider content-position="left">工商信息</el-divider>
                    <dl>
                        <dt><i class="el-icon-user-solid"></i>工商信息</dt>
                        <dd>{{company.businessInfo.name}}</dd>
                        <dt><i class="el-icon-date"></i>成立时间</dt>
                        <dd>{{company.businessInfo.establishDate}}</dd>
                        <dt><i class="el-icon-shopping-cart-full"></i>注册资本</dt>
                        <dd>{{company.businessInfo.registerMoney}}</dd>
                        <dt><i class="el-icon-user-solid"></i>法人代表</dt>
                        <dd>{{company.businessInfo.ceo}}</dd>
                    </dl>
                    <el-divider content-position="left">联系我们</el-divider>
                    <ul>
                        <li><i class="el-icon-phone-outline"></i>{{company.telephone}}</li>
                        <li><i class="el-icon-message"></i>{{company.email}}</li>
                    </ul>
                    <el-divider content-position="left">公司标签</el-divider>
                    <ul>
                        <li class="tag" v-for="item in company.tagList">
                            <el-tag type="success">{{item}}</el-tag>
                        </li>
                    </ul>
                </el-aside>
            </el-container>
            <el-footer>

            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import backTop from "./subComponents/backTop";
    import u_header from "./subComponents/u_header";
    //加载json文件
    import c1 from "../assets/e_data/1.json"
    export default {
        // 注册组件
        components: {
            backTop,
            "u_header": u_header
        },
        name: "e_company",
        mounted() {
            let _this = this;
            if (_this.companyId == null) {
                _this.companyId = '你尚未加入任何企业！';
                return;
            }
            console.log("我的企业id");
            console.log(_this.companyId);
            _this.$ajax.post('/readJSONFile', _this.companyId, {emulateJSON: true}).then((res) => {
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
                //公司信息
                company: {}
            };
        }
    }
</script>

<style scoped>
    li {
        list-style: none;
    }
    li,dd {
        height: 40px;
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
</style>
