<template>
    <a-row type="flex" style="min-height: 100%">
        <a-col :span="24" style=" background-color: rgb(240, 242, 245)">
            <div>
                <a-row :gutter="64" type="flex" justify="center">
                    <a-col :span="14" style="text-align: left;padding:48px; margin:24px" class="handmakeWhiteCard">
                        <a-page-header
                                @back="() => $router.go(-1)"
                                style="margin-left: -24px"
                        >
                            <span slot="title" style="font-size: 28px">问题：{{this.contentData.attributes.title}}</span>
                        </a-page-header>
                        <div style="color: grey;">
                            由 {{ this.contentData.attributes.uname }} 于 {{ this.contentData.createdAt.toLocaleString() }} 发表
                        </div>
                        <div style=""><a-divider/></div>
                        <div style="margin-bottom: 24px">
                            {{ this.contentData.attributes.content }}
                        </div>
                    </a-col>
                    <a-col :span="8" style="padding: 48px; margin:24px 24px 0 0" class="handmakeWhiteCard">

                        <!--评论部分-->
                        <div style="font-weight: 600; font-size: 28px; text-align: left;">
                            回复
                        </div>
                        <!--div style="font-weight: 600; font-size: 28px; text-align: left; margin: 96px 3% 12px 0">发表回复</div>
                            <a-textarea
                                v-model="newReplyContent"
                                placeholder="对这个问题发表自己的见解"
                                :auto-size="{ minRows: 12, maxRows: 12 }"
                            />
                        <div>
                            <a-button @click="replyAPost" block type="primary" style="border-radius: 3px; margin-top: 24px">发表回复</a-button>
                        </div-->

                        <a-button @click="clickButton" block type="primary" style="border-radius: 3px; margin-top: 24px">发表回复</a-button>
                        <a-modal
                                title="发表回复"
                                :visible="replyVisible"
                                :confirm-loading="confirmLoading"
                                @ok="handleOk1()"
                                @cancel="handleCancel"
                        >
                            <p>回复内容</p>
                            <a-textarea
                                    v-model="newReplyContent"
                                    placeholder="对这个问题发表自己的见解"
                                    :auto-size="{ minRows: 5, maxRows: 7 }"
                            />
                        </a-modal>
                        <a-list
                                item-layout="vertical"
                                :data-source="this.officialReply"
                                :locale = "{emptyText: '官方暂未回复'}"
                        >
                            <a-list-item slot="renderItem" slot-scope="item">
                                <a-card class="cardClass">
                                    <a-comment>
                                        <div slot="author" style="font-weight: 600; font-size: 16px">{{item.attributes.uname.replace("Official", "")}} <a-tag color="blue">官方</a-tag></div>
                                        <div @click="showModal2(item.attributes.uname)" class="pointer" style="font-size: 14px; text-align: right">
                                            回复评论
                                        </div>
                                        <a-modal
                                                title="发表回复"
                                                :visible="visible2"
                                                :confirm-loading="confirmLoading"
                                                @ok="handleOk2()"
                                                @cancel="handleCancel"
                                        >
                                            <p>{{ ModalText }}</p>
                                            <a-textarea
                                                    v-model="ReplyReplyContent"
                                                    placeholder="对这个问题发表自己的见解"
                                                    :auto-size="{ minRows: 5, maxRows: 7 }"
                                            />
                                        </a-modal>
                                        <p slot="content" style="font-size: 16px">{{ item.attributes.content }}</p>
                                        <span slot="datetime"  style="font-size: 14px">
                                                {{ item.createdAt.toLocaleString() }}
                                            </span>
                                    </a-comment>
                                </a-card>
                            </a-list-item>
                        </a-list>
                        <!--用户评论-->
                        <a-list
                                item-layout="vertical"
                                :data-source="this.replys"
                                :pagination="pagination"
                                :locale = "{emptyText: '暂无网友回复'}"
                        >
                            <a-list-item slot="renderItem" slot-scope="item">
                                <a-card class="cardClass">
                                    <a-comment >
                                        <div slot="author" style="font-weight: 600; font-size: 20px">{{item.attributes.uname}} </div>
                                        <div @click="showModal(item.attributes.uname)" class="pointer" style="font-size: 14px; text-align: right">
                                            回复评论
                                        </div>
                                        <a-modal
                                                title="Title"
                                                :visible="visible"
                                                :confirm-loading="confirmLoading"
                                                @ok="handleOk3()"
                                                @cancel="handleCancel"
                                        >
                                            <p>{{ ModalText }}</p>
                                            <a-textarea
                                                    v-model="ReplyReplyContent"
                                                    placeholder="对这个问题发表自己的见解"
                                                    :auto-size="{ minRows: 5, maxRows: 5 }"
                                            />
                                        </a-modal>
                                        <p slot="content" style="font-size: 16px">{{ item.attributes.content }}</p>

                                        <span slot="datetime"  style="font-size: 14px">
                                                {{ item.createdAt.toLocaleString() }}
                                            </span>
                                    </a-comment>
                                </a-card>
                            </a-list-item>
                        </a-list>
                    </a-col>
                </a-row>
            </div>
        </a-col>
    </a-row>


</template>

<style>
    .handmakeCard {
        border: solid 1px #dadce0;
        border-radius: 8px;
    }

    .handmakeWhiteCard {
        border: solid 1px #dadce0;
        border-radius: 8px;
        background: white;
    }
</style>


<script>
    // import Vue from 'vue';

    //import Question from "../components/forum/Question.vue";
    export default {
        components: {
            //Question,
        },
        data() {
            return {
                officialReply:[],
                pagination: {
                    onChange: () => {
                    },
                    pageSize: 3,
                },
                ModalText: '回复内容',
                replyVisible: false,
                visible: false,
                visible2:false,
                confirmLoading: false,
                title: "",
                replys: null,
                testName:"",
                username: "",
                userid: "",
                postid: "",
                newReplyContent: "",
                contentData: null,
                current: 0,
                ReplyReplyContent: "",
            }
        },
        computed: {},
        // created(){
        //     this.postid=this.$route.query.postID;
        // },
        mounted() {
            this.postid = this.$route.query.postID;
            this.refreshData();
            this.getUsernameAndId();
            //this.refreshPostData(this.postid);
        },
        watch: {},
        methods: {
            showModal(e) {
                this.testName=e;
                console.log(e);
                if (this.username === "" || this.$store.state.token === "") {
                    this.$message.error("请先登录");
                    return;
                }
                this.visible = true;
            },
            showModal2(e) {
                this.testName=e;
                console.log(e);
                if (this.username === "" || this.$store.state.token === "") {
                    this.$message.error("请先登录");
                    return;
                }
                this.visible2 = true;
            },
            handleOk1() {
                if (this.username === "" || this.$store.state.token === "") {
                    this.$message.error("请先登录");
                    return;
                }

                if(this.newReplyContent!=''){
                    this.replyAPost();
                    this.ModalText = '回复成功';
                    this.confirmLoading = true;
                }else{
                    this.$message.error("请输入内容");
                    // window.location.reload();
                }
                // setTimeout(() => {
                //     this.replyVisible = false;
                //     this.visible = false;
                //     this.confirmLoading = false;
                // }, 1000);
                // location.reload();
            },
            handleOk2() {
                if (this.username === "" || this.$store.state.token === "") {
                    this.$message.error("请先登录");
                    return;
                }
                if(this.ReplyReplyContent!=''){
                    console.log(this.testName);
                    this.replyAReply(this.testName);
                    this.ModalText = '回复成功';
                    this.confirmLoading = true;
                }else{
                    this.$message.error("请输入内容");
                    // window.location.reload();
                }
                //this.confirmLoading = true;
                // setTimeout(() => {
                //     this.replyVisible = false;
                //     this.visible = false;
                //     this.confirmLoading = false;
                // }, 1000);
                // location.reload();
            },
            handleOk3() {
                //console.log(evn);
                if (this.username === "" || this.$store.state.token === "") {
                    this.$message.error("请先登录");
                    return;
                }

                if(this.ReplyReplyContent!=''){
                    console.log(this.testName);
                    this.replyAReply(this.testName);

                    this.ModalText = '回复成功';
                    this.confirmLoading = true;
                }else{
                    this.$message.error("请输入内容");
                    // window.location.reload();
                }
                // setTimeout(() => {
                //     this.replyVisible = false;
                //     this.visible = false;
                //     this.confirmLoading = false;
                // }, 1000);
                // location.reload();
            },
            replyAReply(e) {
                const Reply = this.$AV.Object.extend('Reply');
                const reply = new Reply();

                if (!this.ReplyReplyContent || this.ReplyReplyContent === "") {
                    this.$message.error("请输入内容");
                    return;
                }


                // 为属性赋值
                reply.set('uid', this.userid);
                reply.set('postid', this.postid);
                reply.set('content', "@" + e + "\n" + this.ReplyReplyContent);
                reply.set('uname', this.username);


                // 将对象保存到云端
                reply.save().then(() => {
                    // 成功保存之后，执行其他逻辑
                    this.$AV.Object.createWithoutData('Post', this.postid).save();
                    this.$message.success(`回复成功`, 1.5).then(() => {
                        location.reload();
                    });
                }, (error) => {
                    console.log(error);
                    this.$message.error("发表回复出错");
                });
            },

            handleCancel() {
                this.visible2 = false;
                this.visible = false;
                this.replyVisible = false;
            },
            refreshData() {
                const firstQuery = new this.$AV.Query("Reply");
                firstQuery.equalTo("postid", this.postid);
                firstQuery.contains('uname','Official');
                firstQuery.descending("createdAt");
                firstQuery.find().then((data)=>{
                    this.officialReply=data;
                })
                const query = new this.$AV.Query("Reply");       // 表名分别是Post, Reply, Knowledge，字段名自己添加即可
                query.equalTo("postid", this.postid);
                const regExp = new RegExp('^((?!Official).)*$', 'i');
                query.matches('uname', regExp);
                query.descending("updatedAt");
                query.limit(1000);
                query.find().then((data) => {
                    this.replys = data;
                    //console.log(data);
                });
                const query2 = new this.$AV.Query("Post");       // 表名分别是Post, Reply, Knowledge，字段名自己添加即可
                query2.equalTo("objectId", this.postid);
                query2.descending("updatedAt");
                query2.limit(1);
                query2.find().then((data) => {
                    this.contentData = data[0];
                    //console.log(this.contentData);
                });
            },

            // refreshPostData(id) {
            //     const query = new this.$AV.Query("Post");       // 表名分别是Post, Reply, Knowledge，字段名自己添加即可
            //     query.equalTo("postid", id);
            //     query.find().then((data) => {
            //         this.contentData = data;
            //         console.log(this.contentData);
            //     });
            // },
            clickButton(){
                console.log(this.username);
                if (this.username === "" || this.$store.state.token === "") {
                    this.$message.error("请先登录");
                    return;
                }
                this.replyVisible=true;
            },
            replyAPost() {
                if (this.username === "") {
                    this.$message.error("请先登录");
                    return;
                } else {
                    // 构建对象
                    const Reply = this.$AV.Object.extend('Reply');
                    const reply = new Reply();

                    if (!this.newReplyContent || this.newReplyContent === "") {
                        this.$message.error("请输入内容");
                        this.visible = false;
                        return;
                    } else {

                        // 为属性赋值
                        reply.set('uid', this.userid);
                        reply.set('postid', this.postid);
                        reply.set('content', this.newReplyContent);
                        reply.set('uname', this.username);


                        // 将对象保存到云端
                        reply.save().then(() => {
                            // 成功保存之后，执行其他逻辑
                            this.$AV.Object.createWithoutData('Post', this.postid).save();
                            this.$message.success(`回复成功`, 1.5).then(() => {
                                location.reload();
                            });
                        }, (error) => {
                            console.log(error)
                            this.$message.error("发表回复出错");
                        });
                    }
                }
            },
            getUsernameAndId() {
                this.username = this.$store.state.username;
                this.userid = this.$store.state.userid;

            },
            testData() {
                this.contentData.push(
                    {
                        title: `帖子标题`,
                        source: `发表用户`,
                        time: `发表时间`,
                        content: `发表内容`,
                    }
                )
            }
        },
    };
</script>

<style>
    .cardClass {
        text-align: left;
        /*width: 600px;*/
    }

    .textAreaClass {
        text-align: left;
        font-size: 1em;
        /*width: 600px;*/
        margin-left: 20%;
        margin-right: 20%;
    }

    .pointer {
        cursor: pointer;
    }

</style>
