<template>
    <div>
        <echart :chartData="echartData.order" style="height: 260px" ></echart>
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
                    order: {
                        xData: [],
                        series: []
                    },
                }
            }
        },
        methods: {
            getTableData() {
                axis.get('/api/chartdata3/')//axis后面的.get可以省略；
                    .then((res) => {
                            res = res.data
                             // 订单折线图
                            const order = res.data.orderData
                            this.echartData.order.xData = order.date
                            // 第一步取出series中的name部分——键名
                            let keyArray = Object.keys(order.data[0])
                            // 第二步，循环添加数据
                            keyArray.forEach(key => {
                                this.echartData.order.series.push({
                                    name: key,
                                    data: order.data.map(item => item[key]),
                                    type: 'line'
                                })
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
