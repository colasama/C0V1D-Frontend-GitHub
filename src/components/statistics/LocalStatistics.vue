<template>
  <div>
    <a-card class="dataCard">
      <h2 style="margin-bottom: 16px">本地疫情</h2>
      <div v-if="isDataLoaded">
        <h2 style="margin-bottom: 16px">{{ statistics.name }}</h2>
        <a-row type="flex" justify="space-around" align="top">
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="现存确诊"
                :value="statistics.now_confirm"
                :value-style="{
                  'font-weight': '600',
                  'font-size': '30px',
                }"
              />
            </p>
          </a-col>
          <a-divider type="vertical" style="height: 75px" />
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="新增确诊"
                :value="statistics.new_cases"
                :value-style="{
                  'font-weight': '600',
                  'font-size': '30px',
                }"
              />
            </p>
          </a-col>
          <a-divider type="vertical" style="height: 75px" />
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="累计确诊"
                :value="statistics.total_cases"
                :value-style="{
                  'font-weight': '600',
                  'font-size': '30px',
                }"
              />
            </p>
          </a-col>
        </a-row>
        <a-divider />
        <a-row type="flex" justify="space-around" align="top">
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="累计治愈"
                :value="statistics.total_cure"
                :value-style="{
                  'font-weight': '600',
                  'font-size': '30px',
                }"
              />
            </p>
          </a-col>
          <a-divider type="vertical" style="height: 75px" />
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="累计死亡"
                :value="statistics.total_deaths"
                :value-style="{ 'font-weight': '600', 'font-size': '30px' }"
              />
            </p>
          </a-col>
          <a-divider type="vertical" style="height: 75px" />
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="现存无症状"
                :value="statistics.now_wzz"
                :value-style="{ 'font-weight': '600', 'font-size': '30px' }"
              />
            </p>
          </a-col>
        </a-row>
      </div>
      <div v-if="!isDataLoaded">
        <a-button
          :loading="loading"
          type="primary"
          style="border-radius: 3px"
          block
          size="large"
          @click="getLocation"
        >
          获取当前定位
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<style>
.dataCard {
  text-align: left;
}
</style>

<script>
export default {
  data() {
    return {
      statistics: null,
      provinceName: null,
      city: null,
      loading: false,
    };
  },
  props: {
    data: Object,
    location: Object,
  },
  computed: {
    isDataLoaded() {
      return this.city != null;
    },
  },
  mounted() {
    this.refresh();
  },
  watch: {
    location() {
      this.refresh();
    },
    data() {
      this.refresh();
    },
  },
  methods: {
    refresh() {
      if (this.location != undefined) {
        if (!this.location.country || this.location.country !== "中国") {
          return;
        }
        this.city = this.location.city;
        this.provinceName = this.location.province;
      }
      if (
        this.data == undefined ||
        this.data.dataSourceUpdateTime == undefined
      ) {
        return;
      }
      const children = this.data.provinceArray[this.provinceName].children;
      let source = null;
      for (let index = 0; index < children.length; index++) {
        const element = children[index];
        let name = element.name;
        if (this.city.indexOf(name) !== -1) {
          source = element;
        }
      }
      if (source === null) {
        this.statistics = {
          name: this.city,
          now_confirm: "无数据",
          new_cases: "无数据",
          total_cases: "无数据",
          total_cure: "无数据",
          total_deaths: "无数据",
          now_wzz: "无数据",
        };
        this.loading = false;
        return;
      }
      const {
        total: {
          confirm: totalConfirmed,
          dead: totalDeath,
          heal: totalHeal,
          wzz: nowWzz,
          nowConfirm: nowConfirm,
        },
        today: { confirm: newConfirmed },
      } = source;

      this.statistics = {
        name: this.city,
        now_confirm: nowConfirm,
        new_cases: newConfirmed,
        total_cases: totalConfirmed,
        total_cure: totalHeal,
        total_deaths: totalDeath,
        now_wzz: nowWzz,
      };
      this.loading = false;
    },
    getLocation() {
      this.loading = true;
      this.$emit("getLoc");
    },
  },
};
</script>