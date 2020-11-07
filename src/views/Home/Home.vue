<template>
    <el-row class="home" :gutter="20">
        <el-col :span="8">
            <el-card shadow="hover">
                <div class="user">
                    <img :src="userImg"/>
                    <div class="userinfo">
                        <p class="name">Nick</p>
                        <p class="access">超级管理员</p>
                    </div>
                </div>
                <div class="login-info">
                    <p>上次登录时间：<span>2019-10-20</span></p>
                    <p>上次登录地点：<span>北京</span></p>
                </div>
            </el-card>
            <el-card shadow="hover" style="height: 522px; margin-top: 20px">
                    <div class="tab-tit">
                            <!--点击设置curId的值  如果curId等于0，第一个a添加cur类名，如果curId等于1，第二个a添加cur类名，以此类推。添加了cur类名，a就会改变样式 @click,:class ,v-show这三个是vue常用的指令或添加事件的方式-->
                            <a href="javascript:;" @click="curId=0" :class="{'cur':curId===0}">学习充电</a>
                            <a href="javascript:;" @click="curId=1" :class="{'cur':curId===1}">工具</a>
                            <a href="javascript:;" @click="curId=2" :class="{'cur':curId===2}">摸鱼视频</a>
                            <a href="javascript:;" @click="curId=3" :class="{'cur':curId===3}">资讯网站</a>
                    </div>
                    <div class="tab-con">
                                <!--根据curId的值显示div,如果curId等于0，第一个div显示，其它三个div不显示。如果curId等于1，第二个div显示，其它三个div不显示。以此类推-->
                            <div v-show="curId===0">
                                <ul class="list-group">
                                  <li v-for="(value, key, index) in urllist.study" class="list-group-item"><a  :href=value>{{ key }}</a></li>
                                </ul>

                            </div>
                            <div v-show="curId===1">
                                <ul class="list-group">
                                  <li v-for="(value, key, index) in urllist.tools" class="list-group-item"><a   :href=value>{{ key }}</a></li>
                                </ul>
                            </div>
                            <div v-show="curId===2">
                                <ul class="list-group">
                                  <li v-for="(value, key, index) in urllist.veido" class="list-group-item"><a   :href=value>{{ key }}</a></li>
                                </ul>
                            </div>
                            <div v-show="curId===3">
                                    <ul class="list-group">
                                  <li v-for="(value, key, index) in urllist.site" class="list-group-item"><a   :href=value>{{ key }}</a></li>
                                </ul>
                            </div>
                    </div>

            </el-card>
        </el-col>
        <el-col :span="16">

            <div class="num">
                <el-card shadow="hover" v-for="item in countData" :key="item.name"
                         :body-style="{ display: 'flex', padding: 0 }">
                    <i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color }"></i>
                    <div class="detail">
                        <p class="num">￥ {{ item.value }}</p>
                        <p class="txt">{{ item.name }}</p>
                    </div>
                </el-card>
            </div>


            <el-card shadow="hover">
                <echart style="height: 280px" :chartData="echartData.order"></echart>
            </el-card>

            <div class="graph">
                <el-card shadow="hover">
                    <echart :chartData="echartData.user" style="height: 260px"></echart>
                </el-card>
                <el-card shadow="hover">
                    <echart :chartData="echartData.video" style="height: 260px" :isAxisChart="false"></echart>
                </el-card>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import Echart from '../../components/Echart.vue';
    export default {
        components: {
            Echart
        },
        data() {
            return {
                curId: 0,
                urllist:{
                    study:{
                        'TED':'https://www.ted.com/',
                        '云海电子图书馆':'http://www.pdfbook.cn',
                        '文泉考试':'https://www.wqkaoshi.com',
                        '猫咪论文':'https://lunwen.im/',
                        'iData':'https://www.cn-ki.net/',
                        '鸠摩搜书':'https://www.jiumodiary.com/',
                        '必看网':'https://www.biikan.com/'
                    },
                    tools:{
                        '云端超级应用空间（PS，PPT，Excel，Ai）':'https://uzer.me/',
                        '在线接口测试（Getman）':'https://getman.cn/',
                        '香当网（年终总结，个人简历，事迹材料，租赁合同，演讲稿）':'https://www.xiangdang.net/',
                        '二维码生成':'https://cli.im/',
                        '搜狗翻译':'fanyi.sogou.com',
                        '熵数（图表制作，数据可视化）':'https://dydata.io/appv2/#/pages/index/home',
                        '拷贝兔':'https://cp.anyknew.com/',
                        '图片无限变放大':'http://bigjpg.com/zh',
                        '幕布（在线大纲笔记工具）':'mubu.com',
                        '在线转换器（在线转换器转换任何测量单位）':'https://zh.justcnw.com/',
                        '调查问卷制作':'https://www.wenjuan.com/',
                        '果核剥壳（软件下载）':'https://www.ghpym.com/',
                        '软件下载':'https://www.unyoo.com/',
                        'MSDN我告诉你（windows10系统镜像下载）':'https://msdn.itellyou.cn/',
                    },
                    veido:{
                        '电影推荐（分类别致）':'http://www.mvcat.com',
                        '去看TV':'https://www.qukantv.net/',
                        '动漫视频网':'http://www.zzzfun.com/',
                        '94神马电影网':'http://www.9rmb.com/',
                        'NO视频官网':'http://www.novipnoad.com/',
                        '蓝光画质电影':'http://www.languang.co/',
                        '在线看剧':'http://dy.27234.cn/',
                        '牛牛TV':'http://www.ziliao6.com/tv/',
                        'VideoFk解析视频':'http://www.videofk.com/',
                        '蓝调网站':'http://lcoc.top/vip2.3/',
                    },
                    site:{

                    },
                },
                userImg: require('../../assets/images/user.png'),
                countData: [
                    {
                        name: '今日支付订单',
                        value: 1234,
                        icon: 'success',
                        color: '#2ec7c9'
                    },
                    {
                        name: '今日收藏订单',
                        value: 210,
                        icon: 'star-on',
                        color: '#ffb980'
                    },
                    {
                        name: '今日未支付订单',
                        value: 1234,
                        icon: 's-goods',
                        color: '#5ab1ef'
                    },
                    {
                        name: '本月支付订单',
                        value: 1234,
                        icon: 'success',
                        color: '#2ec7c9'
                    },
                    {
                        name: '本月收藏订单',
                        value: 210,
                        icon: 'star-on',
                        color: '#ffb980'
                    },
                    {
                        name: '本月未支付订单',
                        value: 1234,
                        icon: 's-goods',
                        color: '#5ab1ef'
                    }
                ],
                tableLabel: {
                    name: '课程',
                    todayBuy: '今日购买',
                    monthBuy: '本月购买',
                    totalBuy: '总购买'
                },
                echartData: {
                    order: {
                        xData: [],
                        series: []
                    },
                    user: {
                        xData: [],
                        series: []
                    },
                    video: {
                        series: []
                    }
                }
            }
        },
        methods: {
            getTableData() {
                this.$http.get('/home/getData').then(res => {
                    res = res.data


                    // 订单折线图
                    const order = res.data.orderData
                    this.echartData.order.xData = order.date
                    // 第一步取出series中的name部分——键名
                    let keyArray = Object.keys(order.data[0])
                    // 第二步，循环添加数据
                    keyArray.forEach(key => {
                        this.echartData.order.series.push({
                            name: key === 'wechat' ? '小程序' : key,
                            data: order.data.map(item => item[key]),
                            type: 'line'
                        })
                    })


                    // 用户柱状图
                    this.echartData.user.xData = res.data.userData.map(item => item.date)

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




                    // 视频饼图
                    this.echartData.video.series.push({
                        data: res.data.videoData,
                        type: 'pie'
                    })


                })
            },

        },
        created() {
            this.getTableData()
        }
    }
</script>

<style lang="scss" scoped>
    @import "src/assets/scss/home";

    .tab-tit {
        font-size: 0;
        width: 345px;
    }

    .tab-tit a {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        width: 25%;
        text-align: center;
        background: #ccc;
        color: #333;
        text-decoration: none;
    }

    .tab-tit .cur {
        background: #09f;
        color: #fff;
    }

    .tab-con div {
        border: 1px solid #ccc;
        height: 450px;
        width: 345px;
        padding-top: 20px;
    }
</style>
