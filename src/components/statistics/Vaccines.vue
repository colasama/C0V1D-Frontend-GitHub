<template>
    <div>
        <a-card class="dataCard">
            <h2 style="margin-bottom:16px">疫苗接种剂数</h2>
            <!-- <h4>{{country}}</h4> -->
            <span style="font-size:18px">接种剂数</span>
            &emsp;
            <a-button-group>
                <a-button size="small" :type="mode=='new'?'primary':''" @click="change('new')">
                    新增
                </a-button>
                &emsp;
                <a-button size="small" :type="mode=='new'?'':'primary'" @click="change('sum')">
                    合计
                </a-button>
            </a-button-group>
            <div id="vmap" class="chart"></div>
        </a-card>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import * as cityList from '../../assets/iso2name.json'

export default {
    name: "Vaccine",
    components: {
        
    },
    data() {
        return {
            type: "primary",
            mode : "new",
            chart: null,
            myChart: undefined,
            Options: {
                title: { // 标题配置
                    text: '',
                    show: false
                },
                tooltip: { // 提示框配置
                    trigger: 'axis',
                    formatter: function(data){
                        return '<b>' + data[0].axisValueLabel.split(' ')[0] + 
                            '</b><br>新增的疫苗接种数：' + data[0].data.newV + 
                            '千次<br>当前接种合计：' + data[0].data.totalV + '千次'
                    }
                },
                grid: {
                    left: '15%'
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        saveAsImage: {}
                    }
                },
                dataset: {
                    // 用 dimensions 指定了维度的顺序。直角坐标系中，
                    // 默认把第一个维度映射到 X 轴上，第二个维度映射到 Y 轴上。
                    // 如果不指定 dimensions，也可以通过指定 series.encode
                    // 完成映射，参见后文。
                    dimensions: ['date', 'newV'],
                    source: []
                },
                xAxis: {
                    type:'time',
                    axisLabel: {
                        // formatter: function(value) { // 坐标轴文字展示样式处理
                        //     const date = new Date(value)
                        //     const texts = [date.getFullYear(), (date.getMonth() + 1)]
                        //     return texts.join('/')
                        // },
                        rich: {
                            year: {
                                color: '#000',
                                fontWeight: 'bold'
                            },
                            month: {
                                color: '#999'
                            }
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '千次',
                    // axisLabel: {
                    //     formatter:'{value}k'
                    // }
                },
                series: [{
                    type: 'bar',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal:{
                            color: '#A2D48A'
                        }
                    }
                }]
            }
        };
    },
    props: {
        data: Array,
        default: []
    },
    created() {
        //this.refreshData();
    },
    mounted() {
        var chartDom = document.getElementById('vmap');
        this.myChart = echarts.init(chartDom);
        this.myChart.setOption(this.Options);
    },
    watch: {
        data(){
            this.refreshData();
        }
    },
    computed: {
        country: function(){
            if(this.data == null || this.data.length == 0)
                return '中国大陆'
            else
                return this.isoTransform(this.data[0].attributes.iso_code)
        }
    },
    methods: {
        change(Pmode){
            this.mode = Pmode
            if( Pmode == 'new'){
                this.Options.dataset.dimensions = ['date', 'newV']
                this.Options.series = {
                    type: 'bar',
                    itemStyle: {
                        normal:{
                            color: '#A2D48A'
                        }
                    }
                }
                this.myChart.setOption(this.Options)
            }
            else {
                this.Options.dataset.dimensions = ['date', 'totalV']
                this.Options.series = {
                    type: 'line',
                    symbol: 'none', 
                    connectNulls: true,
                    lineStyle: {
                        normal:{
                            color: '#A2D48A'
                        }
                    }
                }
                this.myChart.setOption(this.Options)
            }
        },
        refreshData(){
            var that = this
            if (that.data == null || that.data == undefined)
                return ;
            const query = that.data.findIndex((val)=>{
                return val.attributes['new_vaccinations'] !== undefined
            })
            const queryDate = that.data.findIndex((val)=>{
                return val.attributes['date'].split('-')[0] < 2021
            })
            var res = that.data.slice(query,queryDate)
            let lastV = 0
            res = res.map((val)=>{
                lastV = (val.attributes.total_vaccinations==undefined)?lastV:val.attributes.total_vaccinations
                return {
                    date: val.attributes.date,
                    newV: (val.attributes.new_vaccinations==undefined)?0:val.attributes.new_vaccinations/1000,
                    totalV: lastV/1000
                }
            })
            this.Options.dataset.source = res
            that.myChart.setOption(this.Options)
        },
        isoTransform(iso) {
            return cityList.default[iso];
        },
    }
}
</script>

<style>
.chart {
  height: 350px;
}

.dataCard {
  text-align: left;
}
</style>