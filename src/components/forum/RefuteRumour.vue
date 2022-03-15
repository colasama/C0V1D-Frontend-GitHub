<template>
  <div>
    <a-card class="newsCard">
      <div>
        <a-tabs default-active-key="1" size="large" style="margin-top: -16px">
          <a-tab-pane key="1" tab="辟谣">
            <a-list item-layout="horizontal" :data-source="data" style="margin-top: -8px">
              <a-list-item slot="renderItem" slot-scope="item">
                <a-skeleton :loading="loading" active>
                  <div v-if="!loading">
                    <a-list-item-meta>
                      <a slot="title" :href="item.url" target="_blank"><a-tag size="small" color='#f50'>谣言</a-tag><b
                          style="font-size: 15px">{{ item.title.replace("谣言", "") }}</b></a>
                    </a-list-item-meta>
                    {{ item.source }}
                  </div>
                </a-skeleton>
              </a-list-item>
            </a-list>
            
            <a-button type="link" style="float: right" @click="nextPage">下一页</a-button>
            <a-button type="link" style="float: right" @click="lastPage">上一页</a-button>
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
  data() {
    return {
      rumour: null,
      start: 0,
      stop: 8,
    };
  },
  computed: {
    loading() {
      return this.rumour == null;
    },
    data() {
      return this.rumour != null ? this.rumour.slice(this.start, this.stop) : [];
    }
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    refreshData() {
      const query = new this.$AV.Query("Rumor");
      query.find().then((data) => {
        this.rumour = data.map(val => val.attributes);
      });
    },
    lastPage() {
      if(this.start != 0){
        this.start -= 8;
        this.stop -= 8;
      }
    },
    nextPage() {
      if(this.stop < this.rumour.length){
        this.start += 8;
        this.stop += 8;
      }
    }
  },
};
</script>