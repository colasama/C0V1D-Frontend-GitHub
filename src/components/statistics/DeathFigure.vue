<template>
    <div>
        <a-card class="dataCard">
        <h2 style="margin-bottom:16px">死亡人数</h2>
        <!--h4 style="margin-bottom:15px; ">{{country}}</h4-->
            <span style="font-size:18px">死亡人数</span>
            &emsp;
            <a-button-group>
                <a-button :type="show_mode=='new'?'primary':''" size="small" @click="ch_mode('new')">
                    新增
                </a-button>
                &emsp;
                <a-button :type="show_mode=='new'?'':'primary'" size="small" @click="ch_mode('total')">
                    合计
                </a-button>
            </a-button-group>
        <div id="deathFigureMap" class="chart"></div>
        </a-card>
    </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    components: {
    },
    data() {
        return {
            show_mode:"new",
            mychart:undefined,
            country:"",
            Options: {
                title: { // 标题配置
                    text: '',
                    show: false
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        saveAsImage: {}
                    }
                },
                tooltip: {
                    trigger: 'axis',
                },
                dataset: {
                    dimensions: ['date', 'new_deaths'],
                    source: [],
                },
                xAxis: {type:'time'},
                yAxis: {},
                series: [
                    {name:'每日新增(人)', type: 'bar'}
                ]
            }
        };
    },
    methods: {
        ch_mode(m) {
            this.show_mode=m;
            var that = this;
            const query = that.data.findIndex((val)=>{
                return val.attributes['new_deaths'] !== undefined
            })
            var res = that.data.slice(query)
            if (this.show_mode=="new") {
                res = res.map((val)=>{
                    return {
                        date: val.attributes.date,
                        new_deaths: val.attributes.new_deaths,
                    }
                })
                this.Options.dataset.dimensions=['date', 'new_deaths']
                this.Options.series=[{name:'每日新增(人)', type: 'bar'}]
            }
            else if(this.show_mode=="total"){
                res = res.map((val)=>{
                    return {
                        date: val.attributes.date,
                        total_deaths: val.attributes.total_deaths,
                    }
                })
                this.Options.dataset.dimensions=['date', 'total_deaths']
                this.Options.series=[{name:'合计(人)', type: 'line', showSymbol: false}]
            }
            this.Options.dataset.source = res
            this.mychart.setOption(this.Options)
        },
        isoTransform(iso) {
            const list = require("../../assets/iso2name.json");
            return list[iso];
        },
    },
    props: ['data'],
    computed: {

    },
    watch: {
        data() {
            var that = this
            this.country=this.isoTransform(that.data[0].attributes.iso_code)
            const query = that.data.findIndex((val)=>{
                return val.attributes['new_deaths'] !== undefined
            })
            var res = that.data.slice(query)
            if (this.show_mode=="new") {
                res = res.map((val)=>{
                    return {
                        date: val.attributes.date,
                        new_deaths: val.attributes.new_deaths,
                    }
                })
            }
            else{
                res = res.map((val)=>{
                    return {
                        date: val.attributes.date,
                        total_deaths: val.attributes.total_deaths,
                    }
                })
            }
            this.Options.dataset.source = res
            this.mychart.setOption(this.Options)
            
        },
    },
    mounted() {
        var chartDom = document.getElementById('deathFigureMap');
        this.mychart = echarts.init(chartDom);
        this.mychart.setOption(this.Options);
    },
    created() {

    },
}
</script>


<style>
.chart {
  height: '%50';
}

.dataCard {
  text-align: left;
}
</style>