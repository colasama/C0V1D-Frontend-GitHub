<template>
    <div>
        <a-card style="width:300px;text-align:left">
        <h2 style="margin-bottom:16px">北京</h2>
        <a-statistic title="疫苗接种比例" :value="11.28" suffix="%"/>
        </a-card>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
        };
    },
    props: ['data'],
    computed: {
    },
    created() {
        this.refreshData();
    },
    watch: {
    },
    methods: {
        // refreshData(){
        //     const that = this;
        //     const query = new this.$AV.Query('WorldData');
        //     query.find().then((data) =>{
        //         that.data = data;
        //     });
        // },
    }
}
</script>