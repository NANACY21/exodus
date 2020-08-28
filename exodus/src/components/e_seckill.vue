<!--[秒杀活动]卡片-->
<template>
    <div>
        <el-container>
            <!--头部-->
            <el-header height="100px">
                <component :is="headerComponent"/>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="24" class="title">
                        <el-button-group>
                            <el-button type="primary" icon="el-icon-plus" @click="addSeckill">确定</el-button>
                            <el-button type="warning" icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
                            <el-button type="info" icon="el-icon-close" @click="cancel">取消</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
<!--                [秒杀活动]表单-->
                <el-form :model="seckill" :rules="seckillRule" ref="seckill">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="name" label="活动名称" :label-width="labelWidth2">
                                <el-input
                                    placeholder="秒杀活动名称"
                                    v-model="seckill.name"
                                    clearable/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="商品图片" :label-width="labelWidth2">
                                <el-image></el-image>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="productName" label="商品名称" :label-width="labelWidth2">
                                <el-input v-model="seckill.productName"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item prop="beginTime" label="活动开始" :label-width="labelWidth2">
                                <el-date-picker
                                    v-model="seckill.beginTime"
                                    type="date"
                                    placeholder="活动开始时间"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="endTime" label="活动结束" :label-width="labelWidth2">
                                <el-date-picker
                                    v-model="seckill.endTime"
                                    type="date"
                                    placeholder="活动结束时间"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="秒杀单价" :label-width="labelWidth2">
                                <el-input type="number" clearable
                                          v-model="seckill.price"
                                          placeholder="设置秒杀单价（人民币）"
                                          step="10"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="秒杀库存" :label-width="labelWidth2">
                                <el-input placeholder="商品库存件数" clearable type="number" v-model="seckill.stock"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="payLimit" label="订单取消" :label-width="labelWidth2">
                                <el-input clearable v-model="seckill.payLimit" placeholder="付款时限">
                                    <template slot="prepend">买家</template>
                                    <template slot="append">分钟内未付款，自动取消订单</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">
                            <el-form-item prop="openLimit" label="开启限购" :label-width="labelWidth2">
                                <el-switch
                                    v-model="seckill.openLimit"
                                    active-color="#13ce66"
                                    inactive-color="#8c939d">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="limit" label="每人限购" :label-width="labelWidth2">
                                <el-input clearable v-model="seckill.limit" placeholder="单位/件">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-main>
            <el-footer>
                <component :is="footerComponent"/>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import u_header from "./subComponents/u_header";
    import u_footer from "./subComponents/u_footer";

    export default {
        name: "e_seckill",
        components: {
            "u_header": u_header,
            "u_footer": u_footer,
        },
        data() {
            return {
                labelWidth1: '60px',
                labelWidth2: '90px',
                //头部组件
                headerComponent: 'u_header',
                //底部组件
                footerComponent: 'u_footer',
                //[秒杀活动]
                seckill: {
                    // id
                    id: '',
                    //名称
                    name: '',
                    //活动开始时间
                    beginTime: '',
                    //活动结束时间
                    endTime: '',
                    //秒杀商品单价
                    price: '',
                    //全局秒杀库存
                    stock: '',
                    //付款时限（分钟）
                    payLimit: '',
                    //是否开启限购
                    openLimit: '',
                    //每人限购商品件数
                    limit: '',
                    //商品名称
                    productName: ''
                },
                //[秒杀活动]数据校验
                seckillRule: {

                }
            };
        },
        methods: {
            //确定新增[秒杀活动]
            addSeckill() {

            },
            //重置表单
            resetForm() {

            },
            //取消新增[秒杀活动]
            cancel() {

            }
        }
    }
</script>

<style scoped>
    .title {
        text-align: right;
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>
