<template>
    <div>
        <img :src="'https://api.mz-moe.cn/img/img'+item+'.jpg'"/>
        <div>
            {{item}}.jpg
            <el-button @click="replacePicture('prev')">上一张</el-button>
            <el-button @click="replacePicture('next')">下一张</el-button>
            <el-input v-model="jumpTo" @keyup.enter.native="jump" placeholder="输入数字"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "m_picture",
        data() {
            return {
                jumpTo: 0,
                item: 492
            };
        },
        methods: {
            //更换图片
            replacePicture(action) {
                let _this = this;
                action == 'prev' ? _this.item-- : _this.item++;
            },
            //跳转
            jump() {
                let _this = this;
                _this.item = _this.jumpTo;
            }
        }
    }
</script>

<style scoped>
    img {
        height: 700px;
        width: auto;
    }
    .el-input {
        width: 100px;
    }
    .el-input__inner {
        height: 25px !important;
        line-height: 25px !important;
    }
</style>
