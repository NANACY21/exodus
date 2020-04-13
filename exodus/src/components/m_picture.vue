<template>
    <div>
        <img :src="'https://api.mz-moe.cn/img/img'+item+'.jpg'">
        <div>
            {{item}}.jpg
            <el-button @click="replacePicture('prev')">上一张</el-button>
            <el-button @click="replacePicture('next')">下一张</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "m_picture",
        data() {
            return {
                item: 492
            };
        },
        methods: {
            //更换图片
            replacePicture(action) {
                let _this = this;
                action == 'prev' ? _this.item-- : _this.item++;
            }
        }
    }
</script>

<style scoped>
    img {
        height: 700px;
        width: auto;
    }
</style>
