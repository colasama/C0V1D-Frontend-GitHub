<template>
  <div class="home" style="min-height: calc(100% - 64px);">
    <a-row type="flex" style="min-height: 100%">
      <a-col :span="6" style="background-color: rgb(240, 242, 245); min-height: 100%">
        <RefuteRumour style="margin:24px 0px 24px 24px"/>
      </a-col>
      <a-col :span="18" style="background-color: rgb(240, 242, 245)">
      <div style="margin: 24px; padding: 12px;" class="handmakeWhiteCard">
        <a-row type="flex" style="margin: 24px auto" justify="center">
          <div class="typeButton" v-for="item in items" :key="item.key" @click="click(item)"
            :style="item.style"><b>{{ item.text }}</b></div>
        </a-row>
        <div style="font-weight: 600; font-size: 28px; text-align: left; margin-left: 3%">{{this.showText}}</div>
        <div class="forumBox">
          <div v-if="isPost" style="margin-top: 12px">
            <Post />
            <Question />
          </div>
          <KList v-if="!isPost && knowledges != {}" :data="knowledges[type]"/>
        </div>
        </div>
      </a-col>
    </a-row>

    <!--      <a-button key="1" type="primary" @click="test">-->
    <!--          test-->
    <!--      </a-button>-->

  </div>
</template>
<style scoped>
.handmakeWhiteCard {
  border: solid 1px #dadce0;
  border-radius: 8px;
  background: white;
}

.forumBox {
  margin: 0px 3% 0 3%;
  text-align: left;
}

.typeButton {
  border: solid 0 ;
  margin: 8px;
  padding: 24px;
  font-size: 24px;
  cursor: pointer;
}
</style>

<script>
import Post from "../components/forum/Post.vue";
import KList from "../components/forum/KList.vue";
import Question from '../components/forum/Question.vue';
import RefuteRumour from "../components/forum/RefuteRumour.vue";

const items2items = {
  "无症状者": "日常防护",
  "密切接触者": "密接自查",
  "疑似感染者": "疑似感染",
  "确诊感染者": "就医必备",
  "其他小知识": "其他知识",
  "问题咨询": "问题咨询",
}

const items = [
  {
    key: "无症状者",
    style: "background-color: #ecf7e6; color:#89cb61;",
    text: "日常防护",
  },
  {
    key: "密切接触者",
    style: "background-color: #eaf3f8; color:#79b9df;",
    text: "密接自查",
  },
  {
    key: "疑似感染者",
    style: "background-color: #fbf2e1; color:#e8ab8c;",
    text: "疑似感染",
  },
  {
    key: "确诊感染者",
    style: "background-color: #ffe9dc; color:#f09590;",
    text: "就医必备",
  },
  {
    key: "其他小知识",
    style: "background-color: #fbe1f6; color:#d987e2;",
    text: "其他知识",
  },
  {
    key: "问题咨询",
    style: "background-color: #e6f6f7; color:#4dc6c5;",
    text: "问题咨询",
  },
];
export default {
  name: "QA",
  components: {
    Post,
    KList,
    Question,
    RefuteRumour,
  },
  data() {
    return {
      posts: null,
      knowledges: {},
      items,
      type: "",
      showText: "",
    };
  },
  created() {
    this.refreshData();
  },
  mounted() {},
  watch: {},
  computed: {
    isPost() {
      return this.type == '问题咨询';
    }
  },
  methods: {
    changeToQuestion() {
      this.$router.push({
        path: "/knowledge/question",
      });
    },
    refreshData() {
      //   帖子表：用户uid 标题title 内容content
      //   回复表：用户uid 内容content 帖子postid
      //   防控知识表：标题title 内容content

      const query = new this.$AV.Query("Post"); // 表名分别是Post, Reply, Knowledge，字段名自己添加即可
      query.descending("createdAt");
      query.limit(100);
      query.find().then((data) => {
        this.posts = data;
      });
      this.getKnowledge();
    },
    /**
     * TODO 分tag获取数据
     */
    getKnowledge() {
      const query = new this.$AV.Query("Knowledge");
      query.descending("createdAt");
      query.limit(1000);
      query.find().then((data) => {
        data
          .map((val) => {
            const {
              createdAt,
              updatedAt,
              id,
              attributes: { question, answer, tag, type },
            } = val;
            return {
              id,
              type,
              question,
              answer,
              tag,
              createdAt,
              updatedAt,
            };
          })
          .forEach((val) => {
            const type = val.type;
            if (this.knowledges[type] == undefined) {
              this.knowledges[type] = [];
            }
            this.knowledges[type].push(val);
            
            if(!this.$route.query.type){
              this.type = "无症状者";
              this.showText = items2items["无症状者"]+"板块";
            }
            else{
              this.type = this.$route.query.type;
              this.showText = items2items[this.$route.query.type]+"板块";
            }
               
          });
      });
    },
    click(val) {
      this.type = val.key;
      this.showText = val.text+"板块";
      this.$router.push({path: "/knowledge/index?type="+this.type});
    },
  },
};
</script>
