<template>
  <div>
    <a-card class="newsCard">
        <h2 style="margin-bottom:15px">订阅</h2>
        <a-table
            :columns="columnsForProv"
            :data-source="myProvinces"
            :pagination="false"
            :scroll="{ y: 400 }"
        >
            <template slot="country" slot-scope="record, text">
                {{isoTransform(text.province)}}
            </template>
            <template slot="operation" slot-scope="text, record">
                <span>
                    <a-button class="b_icon" size="small" style="border-radius: 3px" type="danger" @click="() => Cancel(record.distrit,record.province)">
                    取消
                    </a-button>
                </span>
            </template>
        </a-table>
    </a-card>
  </div>
</template>

<style>
</style>

<script>
const columnsForProv = [
    {
        title: '位置',
        dataIndex: 'locate',
        key: 'locate',
        width: '120px',
        scopedSlots: { customRender: 'locate' }
    },
    {
        title: '新增确诊',
        dataIndex: 'newConfirmed',
        key: 'newConfirmed',
        scopedSlots: { customRender: 'newConfirmed' },
        sorter: (a, b) => a.newConfirmed - b.newConfirmed,
        defaultSortOrder: 'descend'
    },
    {
        title: '累积确诊',
        dataIndex: 'totalConfirmed',
        key: 'totalConfirmed',
        scopedSlots: { customRender: 'totalConfirmed' },
        sorter: (a, b) => a.totalConfirmed - b.totalConfirmed
    },
    // {
    //     title: '累积治愈',
    //     dataIndex: 'totalCured',
    //     key: 'totalCured',
    //     scopedSlots: { coustomRender: 'totalCured' },
    //     sorter: (a, b) => a.totalCured - b.totalCured
    // },
    {
        title: '累积死亡',
        dataIndex: 'totalDeath',
        key: 'totalDeath',
        scopedSlots: { coustomRender: 'totalDeath' },
    },
    {
        title: '现存确诊',
        dataIndex: 'totalIncrease',
        key: 'totalIncrease',
        scopedSlots: { coustomRender: 'totalIncrease' },
    },
    {
        title: '取消订阅',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
    },
];

export default {
    components: {},
    data() {
        return {
            columnsForProv,
            myProvinces: [],
        };
    },
    props: {
        data: Object,
        default: {}
    },
    computed: {
        userid() {
            return this.$store.state.userid
        }
    },
    created() {
        
    },
    mounted() {
        // this.Subscribe("安徽省")
        // this.Subscribe("北京市")
        this.refresh(this.userid)
    },
    watch: {
        userid: {
            deep: true,
            hander(val) {
                this.refresh(val)
            }
        },
        data() {
            this.refresh(this.userid)
        }
    },
    methods: {
        updateDate(cList){
            let cityData = this.data.provinceArray
            this.myProvinces = []
            cList.forEach((val) => {
                let Pdata = cityData[val.attributes.Pname]
                let Ddata = cityData[val.attributes.Dname]
                if (Ddata == Pdata){
                    this.myProvinces.push({
                        locate: Pdata.name,
                        province: Pdata.name,
                        distrit: Ddata.name,
                        newConfirmed: Pdata.today.confirm,
                        totalConfirmed: Pdata.total.confirm,
                        totalDeath: Pdata.total.dead,
                        totalIncrease: Pdata.total.nowConfirm
                    })
                }
                else {
                    let data = Pdata.children.find((value)=>{
                        return value.name == val.attributes.Dname
                    })
                    this.myProvinces.push({
                        locate: data.name + '(' + Pdata.name + ')',
                        province: data.name,
                        distrit: Pdata.name,
                        newConfirmed: data.today.confirm,
                        totalConfirmed: data.total.confirm,
                        totalDeath: data.total.dead,
                        totalIncrease: data.total.nowConfirm
                    })
                }
            });
        },
        refresh(userid){
            if(userid !== '' && this.data.provinceArray !== undefined){
                const query = new this.$AV.Query('Subscribe')
                query.equalTo('userid',userid)
                query.limit(1000);
                query.find().then((res)=>{
                    this.updateDate(res)
                    this.$store.state.subscribedArea = res
                })
            }
        },
        Subscribe(Pname,Dname){
            if(this.userid !== ''){
                const Subscribe = this.$AV.Object.extend('Subscribe')
                const subscribe = new Subscribe()
                var that = this
                if(Dname == undefined)
                    Dname = Pname
                subscribe.set('Pname',Pname)
                subscribe.set('userid',this.userid)
                subscribe.set('Dname',Dname)

                const query = new this.$AV.Query('Subscribe')
                query.equalTo('userid',this.userid)
                query.equalTo('Pname',Pname)
                query.equalTo('Dname',Dname)
                query.find().then(async (res)=>{
                    if(res.length == 0){
                        await subscribe.save()
                        await that.refresh(that.userid)
                    }
                })
            }
            else {
                this.$notification["warning"]({
                    message: '订阅失败',
                    description:
                    '在订阅区域疫情状况前请先登录！'
                });
            }
        },
        Cancel(Pname,Dname){
            if(this.userid !== ''){
                const query = new this.$AV.Query('Subscribe')
                query.equalTo('userid',this.userid)
                query.equalTo('Pname',Pname)
                query.equalTo('Dname',Dname)
                var that = this
                query.find().then(async (res)=>{
                    let id = res[0].id
                    if(id != undefined){
                        const delet = this.$AV.Object.createWithoutData('Subscribe', id);
                        await delet.destroy()
                        await that.refresh(this.userid)
                    }
                })
            }
        },
        isoTransform(iso) {
            const list = require("../../assets/iso2name.json");
            return list[iso];
        },
    },
};
</script>
