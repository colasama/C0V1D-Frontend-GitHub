<template>
    <div>
        <a-card class="dataCard">
            <h2 style="margin-bottom:16px">疫情轨迹</h2>
<!--                <a-button-group>-->
<!--                    <a-button type="buttonType.train" @click="changeToTrain" size="small" style="margin-bottom: 10px">患者出行乘坐列车</a-button>&emsp;-->
<!--                    <a-button type="buttonType.flight'" @click="changeToFlight" size="small" style="margin-bottom: 10px">患者出行乘坐航班</a-button>-->
<!--                </a-button-group>-->
<!--            <br><br>-->
<!--            <a-button-group>-->
<!--                <a-button type="buttonType.local" @click="changeToDomestic" size="small" style="margin-bottom: 10px">国内数据</a-button>&emsp;-->
<!--                <a-button type="buttonType.global" @click="changeToGlobal" size="small" style="margin-bottom: 10px">国外数据</a-button>-->
<!--            </a-button-group>-->
            <a-divider/>
            <a-row type="flex" style="margin-bottom: 10px" justify="space-around" align="top">
                <a-col :span="4">
                    <b>日期</b>
                </a-col>
                <a-col :span="4" v-if="ifTrain">
                    <b>列车号</b>
                </a-col>
                <a-col :span="4" v-if="ifFlight">
                    <b>航班号</b>
                </a-col>
                <a-col :span="5">
                    <b>始发地</b>
                </a-col>
                <a-col :span="5">
                    <b>终点</b>
                </a-col>
                <a-col :span="5" v-if="ifTrain">
                    <b>列车类型</b>
                </a-col>
                <a-col :span="5" v-if="ifFlight">
                    <b>航班类型</b>
                </a-col>
            </a-row>
            <a-divider/>
            <a-list size="small"  :grid="{ gutter: 18, column: 1 }" :pagination="pagination" :data-source="trainData" v-if="ifTrain">
                <a-list-item slot="renderItem" slot-scope="trainData, index" :key="index">
                    <a-row type="flex" justify="space-around" align="middle" >
                        <a-icon slot="prefix" type="car" />
                        <a-col :span="4">
                            {{trainData.date}}
                        </a-col>
                        <a-col :span="4">
                            {{trainData.number}}
                        </a-col>
                        <a-col :span="5">
                            {{trainData.src_city}}
                        </a-col>
                        <a-col :span="5">
                            {{trainData.dest_city}}
                        </a-col>
                        <a-col :span="5">
                            境外
                        </a-col>
                    </a-row>
                    <a-divider/>
                </a-list-item>
            </a-list>
            <a-list size="small"  :grid="{ gutter: 16, column: 1 }" :pagination="pagination" :data-source="flightData" v-if="ifFlight">
                <a-list-item slot="renderItem" slot-scope="flightData, index" :key="index">
                    <a-row type="flex" justify="space-around" align="middle" >
                        <a-icon slot="prefix" type="car" />
                        <a-col :span="4">
                            {{flightData.date}}
                        </a-col>
                        <a-col :span="4">
                            {{flightData.number}}
                        </a-col>
                        <a-col :span="5">
                            {{flightData.src_city}}
                        </a-col>
                        <a-col :span="5">
                            {{flightData.dest_city}}
                        </a-col>
                        <a-col :span="5">
                            境外
                        </a-col>
                    </a-row>
                    <a-divider/>
                </a-list-item>
                <div style="color: grey; font-size: 8px; margin-top: -12px; text-align: right">数据截至 {{this.updateDate}}</div>
            </a-list>
        
        </a-card>
    </div>
</template>

<script>
    //const ISO2NAME = require("@/assets/iso2name.json");

    export default {
        name: "TravelAttentions",
        mounted() {
            this.dataInput();
            this.refresh();
            //console.log(this.data);
        },
        components: {},
        // created() {
        //     this.refresh();
        // },
        data() {
            return {
                buttonType: {
                    local: "default",
                    global: "primary",
                    train: "default",
                    flight: "primary",
                },
                //show_mode:"new",
                ifTrain: false,
                ifFlight: true,
                ifLocal: true,
                ifGlobal:true,
                trainData: [],
                trainNum:0,
                trainData2: [],
                flightData2: [],
                flightData: [],
                flightNum: 0,
                updateDate: "",
                testData: null,
                pagination: {
                    onChange: page => {
                    },
                    pageSize: 6,
                },
            };
        },
        props: {
            data: Array,
        },
        computed: {},
        watch:{
            data(){
                this.refresh();
            }
        },
        methods: {
            refresh(){
                var travelData=this.data;
                for(let i=0; i<travelData.length;i++){
                    if(travelData[i].attributes.type=="flight"){
                        this.flightNum+=1;
                        const {
                            date,
                            dest_city,
                            dest_province,
                            number,
                            src_city,
                            src_country,
                        } = travelData[i].attributes;
                        this.flightData.push({
                            date,
                            dest_city,
                            dest_province,
                            number,
                            src_city,
                            src_country,
                        })
                    }else{
                        this.trainNum+=1;
                        const {
                            date,
                            dest_city,
                            dest_province,
                            number,
                            src_city,
                            src_country,
                        } = travelData[i].attributes;
                        this.trainData.push({
                            date,
                            dest_city,
                            dest_province,
                            number,
                            src_city,
                            src_country,
                        })
                    }
                }
                if (this.flightData.length != 0) {
                    this.updateDate = this.flightData[0].date;
                }
            },
            dataInput() {
                for (let i = 0; i < 20; i++) {
                    this.trainData2.push({
                        number: `trainNum${i + 1}`,
                        time:
                            `2020.6.${i + 1}`,
                        startStation:
                            `route ${i + 1}`,
                        destination:
                            `des ${i+1}`,
                    });
                    this.flightData2.push({
                        number: `flightNum${i + 1}`,
                        time:
                            `2020.6.${i + 1}`,
                        startStation:
                            `route ${i + 1}`,
                        destination:
                            `des ${i+1}`,
                    });
                }
            },

            changeToTrain(){
                //console.log(this.trainData);
                //console.log(this.data);
                this.buttonType.train='primary';
                this.buttonType.flight='default';
                this.ifTrain=true;
                this.ifFlight=false;
            },
            changeToFlight(){
                //console.log(this.flightData);
                this.buttonType.flight='primary';
                this.buttonType.train='default';
                this.ifTrain=false;
                this.ifFlight=true;
            },
            changeToDomestic(){
                //console.log(this.trainData);
                this.buttonType.local='primary';
                this.buttonType.global='default';
                this.ifLocal=true;
                this.ifGlobal=false;
            },
            changeToGlobal(){
                //console.log(this.flightData);
                this.buttonType.global='primary';
                this.buttonType.local='default';
                this.ifLocal=false;
                this.ifGlobal=true;
            },
        },
    };
</script>

<style>
    #whole_page {
        margin-top: 5px;
    }

    .dataCard {
        text-align: left;
    }
</style>