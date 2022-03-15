<template>
  <div>
    <a-card class="newsCard">
      <div>
        <a-tabs default-active-key="1" size="large" style="margin-top: -16px">
          <a-tab-pane key="1" tab="热点新闻">
            <a-list
              item-layout="horizontal"
              :data-source="news"
              style="margin-top: -8px"
            >
              <a-list-item slot="renderItem" slot-scope="item">
                <a-skeleton :loading="loading" active>
                  <div v-if="!loading">
                    <a-list-item-meta
                      :description="item.description.slice(0, 50) + '……'"
                    >
                      <a slot="title" :href="item.url" target="_blank"
                        ><b style="font-size: 15px">{{ item.name }}</b></a
                      >
                    </a-list-item-meta>
                    <img
                      :src="getIcon(item.url)"
                      alt="来源"
                      @error="defImg()"
                      height="16"
                      width="16"
                    />
                    {{ item.provider[0].name }}
                  </div>
                </a-skeleton>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane key="2" tab="疫情通报">
            <a-list
              item-layout="horizontal"
              :data-source="notice"
              style="margin-top: -8px"
            >
              <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta
                  :description="
                    item.summary.replace(/\s*/g, '').slice(0, 50) + '……'
                  "
                >
                  <a slot="title" :href="item.sourceUrl" target="_blank"
                    ><b style="font-size: 15px">{{ item.title }}</b></a
                  >
                </a-list-item-meta>
                <img
                  :src="getIcon(item.sourceUrl)"
                  alt="来源"
                  @error="defImg()"
                  height="16"
                  width="16"
                />
                {{ item.infoSource }}
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<style>
.newsCard {
  text-align: left;
  width: 100%;
  right: 0;
}
</style>

<script>
export default {
  components: {},
  data() {
    return {
      news: [1, 1, 1, 1, 1, 1, 1],
      notice: [1, 1, 1, 1, 1, 1, 1],
      keyWords: "",
      isNews: true,
      loading: true,
    };
  },
  props: {
    area: String,
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    // bigid:{
    //     handler(oldvv, newv){
    //         console.log(newv)
    //     }
    // }
    area() {
      this.refreshData();
    },
  },
  methods: {
    defImg() {
      let img = event.srcElement;
      img.src = require("../assets/news.png");
      img.onerror = null; //防止闪图
    },
    refreshData() {
      if (this.news.length != 10) {
        this.$axios({
          method: "get",
          url: "https://lab.isaaclin.cn/nCoV/api/news",
        })
          .then((res) => {
            this.notice = res.data.results;
          })
          .catch((res) => {
            console.log(res);
          });
      }
      const query = new this.$AV.Query("News");
      query.equalTo("area", this.area);
      query.find().then((data) => {
        this.news = data[0].attributes.data;
        this.loading = false;
      });
    },
    getIcon(url_str) {
      let list = url_str.split("/");
      let url_body = list[2];
      let url = "https://" + url_body + "/favicon.ico";
      return url;
    },
  },
};
</script>