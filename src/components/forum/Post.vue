<template>

    <div>
<!--        <a-button-group size="large">-->
<!--            <a-button size="large" :type="this.obutton" @click="changeToOfficial" style="margin-bottom: 20px;">-->
<!--                官方答疑-->
<!--            </a-button>-->
<!--            <a-button size="large" :type="this.ubutton" @click="changeToUser" style="margin-bottom: 20px;">-->
<!--                用户提问-->
<!--            </a-button>-->
<!--        </a-button-group>-->
        <a-list item-layout="vertical" size="large"  :pagination="pagination" :data-source="posts" :split="false"
                style="padding: 0;" >
            <a-list-item slot="renderItem" slot-scope="item" style="padding: 0px">
                <a-card :body-style="{ padding: '1px' }" class="card">
                    <div style="padding: 14px">
                        <div style="margin-bottom: 0px;vertical-align: center">
                            <b style="cursor: pointer; font-size: 18px;"
                               @click="changeToDetail(item.id)">{{ item.attributes.title.length > 40 ? item.attributes.title.substring(0,39) + '....' : item.attributes.title}}</b>
                            <div style="float: right">
                                <a-avatar style="margin-right: 12px;background-color: #7265E6">
                                    {{ item.attributes.uname[0].toUpperCase() }}
                                </a-avatar>
                            </div>
                        </div>
                        <div slot="header">
                            <div style="display: flex; align-items: start; margin-bottom: 6px">
                                <span>{{ item.attributes.content.length > 50 ? item.attributes.content.substring(0,49) + '......' : item.attributes.content}}</span>
                            </div>
                        </div>
                        <div>
            <span style="color: #999;">
              发表于 {{ item.createdAt.toLocaleDateString() + " " + item.createdAt.toLocaleTimeString() }} &emsp;
            </span>
                            <span style="color: #999; margin-right: 20px;" v-if="!item.attributes.uname.match('^((?!Official).)*$')">
              来自 {{item.attributes.uname.replace("Official", "")}} <a-tag color="blue">官方</a-tag>
            </span>
                            <span style="color: #999; margin-right: 20px;" v-if="item.attributes.uname.match('^((?!Official).)*$')">
              来自 {{item.attributes.uname}}
            </span>
                            <div style="float:right;">
                                <a-button @click="changeToDetail(item.id)" type="link">查看评论</a-button>
                            </div>
                            <!--              <div style="float:right;margin-right: 20px"><a-button @click="test">test</a-button></div>-->
                        </div>
                    </div>
                </a-card>
            </a-list-item>
        </a-list>
    </div>
</template>

<style>

</style>


<script>


    const listData = [];
    for (let i = 0; i < 10; i++) {
        listData.push({
            title: `title ${i}`,
            source: `source ${i}`,
            description: `description ${i}`
        })
    }
    export default {
        components: {},
        data() {
            return {
                obutton:'primary',
                ubutton:'default',
                official:true,
                listData,
                posts: [],
                officialPost: [],
                pagination: {
                    onChange: () => {
                    },
                    pageSize: 5,
                },
            }
        },
        created: function () {
            this.refreshData();
        },
        computed: {},
        mounted: function () {

        },
        watch: {},
        methods: {
            changeToOfficial(){
                this.obutton='primary';
                this.ubutton='default';
                this.official=true;
            },
            changeToUser(){
                this.ubutton='primary';
                this.obutton='default';
                this.official=false;
            },
            refreshData() {
                //   帖子表：用户uid 标题title 内容content
                //   回复表：用户uid 内容content 帖子postid
                //   防控知识表：标题title 内容content
                // const firstQuery = new this.$AV.Query("Post");
                // firstQuery.contains('uname', 'Official');
                // firstQuery.descending("createdAt");
                // firstQuery.find().then((data) => {
                //     this.officialPost = data;
                // })
                const query = new this.$AV.Query("Post");
                // 表名分别是Post, Reply, Knowledge，字段名自己添加即可
                //const regExp = new RegExp('^((?!Official).)*$', 'i');
                //query.matches('uname', regExp);
                query.descending("createdAt");
                query.limit(100);
                query.find().then((data) => {
                    this.posts = data;
                });
            },
            changeToDetail(id) {
                this.$router.push({
                    path: '/knowledge/content',
                    query: {
                        postID: id
                    }
                })
            },
        },
    };
</script>

<style>
    .card {
        margin-bottom: 15px;
        height: 90%;
        width: 100%;
        padding-top: 2px;
        text-align: left;
        background-color: rgba(230, 246, 247, 0);
    }
</style>