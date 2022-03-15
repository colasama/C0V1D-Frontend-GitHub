<template>
    <div>
        <a-card class="dataCard">
        <h2 style="margin-bottom:24px">病例数据</h2>
        <!--h4 style="margin-bottom:15px; ">{{country}}</h4-->
            <span style="font-size:18px">病例数</span>&emsp;
            <a-button-group>
                <a-button :type="botton_type_new" size="small" @click="show_new()">新增</a-button>&emsp;<a-button :type="botton_type_tot" size="small" @click="show_tot()">合计</a-button>
            </a-button-group>
        <div id="casesFigureMap" class="chart"></div>
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
            botton_type_new: "primary",
            botton_type_tot: "default",
            mode:"new",
            mychart:undefined,
            map_data_source:[],
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
                    dimensions: ['date', 'new_cases'],
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
        show_new() {
			this.botton_type_new="primary";
            this.botton_type_tot="default";
            this.mode="new";
            var that=this
            const query = that.data.findIndex((val)=>{
                return val.attributes['new_cases'] !== undefined
            })
            var res = that.data.slice(query);
            if (this.mode=="new") {
                res = res.map((val)=>{
                    return {
                        date: val.attributes.date,
                        new_cases: val.attributes.new_cases,
                    }
                })
            }
            this.Options.dataset.dimensions=['date', 'new_cases'];
            this.Options.series=[{name:'每日新增(人)', type:'bar'}];
            this.Options.dataset.source = res;
            this.mychart.setOption(this.Options);
		},
        show_tot() {
            this.mode="total";
            this.botton_type_new="default";
            this.botton_type_tot="primary";
            var that=this
            const query = that.data.findIndex((val)=>{
                return val.attributes['new_cases'] !== undefined
            })
            var res = that.data.slice(query);
            if (this.mode=="total") {
                res = res.map((val)=>{
                    return {
                        date: val.attributes.date,
                        total_cases: val.attributes.total_cases,
                    }
                })
            }
            this.Options.dataset.dimensions=['date', 'total_cases'];
            this.Options.series=[{name:'合计(人)', type: 'line', showSymbol: false}];
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
                return val.attributes['new_cases'] !== undefined
            })
            var res = that.data.slice(query)
            if (this.mode=="new") {
                res = res.map((val)=>{
                    return {
                        date: val.attributes.date,
                        new_cases: val.attributes.new_cases,
                    }
                })
            }
            else if(this.mode=="total"){
                res = res.map((val)=>{
                    return {
                        date: val.attributes.date,
                        total_cases: val.attributes.total_cases,
                    }
                })
            }
            this.Options.dataset.source = res
            this.mychart.setOption(this.Options)
        }
    },
    mounted() {
        var chartDom = document.getElementById('casesFigureMap');
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