<template>
    <div>
        <echart :chartData="echartData.user" style="height: 260px"></echart>
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
                    user: {
                        xData: [],
                        series: []
                    },
                }
            }
        },
        methods: {
            getTableData() {
                axis.get('/api/chartdata2/')//axis后面的.get可以省略；
                    .then((res) => {
                            res = res.data
                            // 用户柱状图
                            // 坐标轴初始化
                            this.echartData.user.xData = res.data.userData.map(item => item.date)
                            //数据组
                            this.echartData.user.series.push({
                                name: '新增用户',
                                data: res.data.userData.map(item => item.new),
                                type: 'bar'
                            })
                            this.echartData.user.series.push({
                                name: '活跃用户',
                                data: res.data.userData.map(item => item.active),
                                type: 'bar',
                                barGap: 0
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
