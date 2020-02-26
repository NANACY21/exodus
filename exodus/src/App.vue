<!--入口-->
<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {};
        },
        methods: {},
        mounted() {
        }
    };
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
/*顶部紧贴屏幕上方*/
body {
    margin: 0;
}
</style>
