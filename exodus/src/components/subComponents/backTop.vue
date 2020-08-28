<!--通用组件[返回顶部]-->
<template>
    <div>
        <img class="icons" v-show="visible" @click="handleScrollTop" src="../../assets/backTop.png" title="回到顶部"/>
    </div>
</template>

<script>
    export default {
        name: "backTop",
        data() {
            return {
                //初始化
                scrollTop: null,
                //该组件默认不显示
                visible: false,
            };
        },
        methods: {
            handleScroll() {
                this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if (this.scrollTop > 400) {
                    this.visible = true
                } else {
                    this.visible = false
                }
            },

            handleScrollTop() {
                let timer = null,
                    that = this;
                cancelAnimationFrame(timer);
                timer = requestAnimationFrame(function fn() {
                    if (that.scrollTop > 0) {
                        that.scrollTop -= 50;
                        document.body.scrollTop = document.documentElement.scrollTop = that.scrollTop;
                        timer = requestAnimationFrame(fn);
                    } else {
                        cancelAnimationFrame(timer);
                        that.visible = false;
                    }
                })
            }
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll);
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll)
        }
    }
</script>

<style scoped>
    .icons {
        position: fixed;
        right: 70px;
        bottom: 70px;
        width: 50px;
        height: 50px;
        border-radius: 10%;
        border: 1px solid red;
        cursor: pointer;
    }
</style>
