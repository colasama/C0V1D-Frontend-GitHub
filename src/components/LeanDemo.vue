<template>
    <div>
        {{data}}
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            data:null,
        };
    },
    props: ['country'],
    computed: {
    },
    created() {
        this.refreshData();
    },
    watch: {
        // bigid:{
        //     handler(oldvv, newv){
        //         console.log(newv)
        //     }
        // }
    },
    methods: {
        refreshData(){
            const that = this;
            const query = new this.$AV.Query('WorldData');
            query.find().then((data) =>{
                that.data = data;
            });
        },
    }
}
</script>