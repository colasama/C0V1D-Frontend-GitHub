<template>
  <div>
      <span slot="title" style="font-size: 28px; font-weight: 600">咨询问题</span>
      <a-input v-model="newPostTitle" placeholder="请输入标题" class="inputStyle"/>
      <a-textarea v-model="newPostContent" placeholder="请在这里输入内容" :auto-size="{ minRows: 10, maxRows: 10 }"/>
      <div style="margin-top: 24px; text-align: right">
        <a-button @click="writeAPost" type="primary" style="border-radius: 3px; width: 200px;">发表</a-button>
      </div>
  </div>
</template>

<style>

</style>



<script>
// import Vue from 'vue';

export default {
  components: {
  },
  data() {
    return {
      newPostContent: null,
      newPostTitle: null,
      username: "",
      userid: "",
    }
  },
  created: function () {
    
  },
  computed: {},
  mounted: function () {
      this.getUsernameAndId();
  },
  watch: {},
  methods: {
      writeAPost(){
          if(this.username === ""){
              this.$message.error("请先登录");
              return;
          }
          else{
              // 构建对象
              const Post = this.$AV.Object.extend('Post');
              const post = new Post();

              // 为属性赋值
              post.set('uid', this.userid);
              post.set('title', this.newPostTitle);
              post.set('content', this.newPostContent);
              post.set('uname',this.username);

              if(!this.newPostTitle || this.newPostTitle === "") {
                  this.$message.error("请输入标题");
                  return;
              }

              if(!this.newPostContent || this.newPostContent === "") {
                  this.$message.error("请输入内容");
                  return;
              }

              // 将对象保存到云端
              post.save().then(() => {
                  // 成功保存之后，执行其他逻辑
                  this.$message.success(`发表成功`, 1.5).then(() => {
                      window.location.reload();
                      this.$store.state.showNav = true;
                  });

              }, (error) => {
                  console.log(error);
                  this.$message.error("发表帖子出错");
              });
          }
      },


      //获取用户名和用户id
      getUsernameAndId(){
          this.username = this.$store.state.username;
          this.userid = this.$store.state.userid;
      },
  },
};
</script>

<style>
    .inputStyle{
        /*width: 1000px;*/
        height: 31px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px 24px 16px 0;
        float: left;
    }
</style>
