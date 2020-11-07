<template>
    <div>
        <echart :chartData="echartData.video" style="height: 260px" :isAxisChart="false"></echart>
    </div>
</template>

<script>
    import Echart from '../../components/Echart.vue';
    import axis from "axios";
    export default {
        components: {
            Echart
        },
        data() {
            return {
                msg: '我是一个头部组件',
                echartData: {
                    video: {
                        series: []
                    }
                }
            }
        },
        methods: {
            getTableData() {
                axis.get('/api/chartdata1/')//axis后面的.get可以省略；
                    .then((res) => {
                            res = res.data
                            // 视频饼图
                            this.echartData.video.series.push({
                                data: res.data.videoData,
                                type: 'pie'
                            })
                        })
                    .catch(
                        (error) => {
                            console.log(error);
                        });
            },
        },
        created() {
            this.getTableData()
        }
    }
</script>
<style lang="scss" scoped>

</style>
