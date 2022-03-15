<template>
  <div>
    <a-card class="dataCard">
      <a-skeleton active :paragraph="{ rows: 8 }" v-if="!isDataLoaded" />
      <div v-if="isDataLoaded">
        <h2 style="margin-bottom: 24px">{{ statistics.name }}</h2>
        <a-row type="flex" justify="space-around" align="top">
          <div>
            <p class="height-100">
              <a-statistic
                title="现存确诊"
                :value="
                  statistics.total_cases -
                  statistics.total_cure -
                  statistics.total_deaths
                "
                :value-style="{
                  color: 'rgba(100,112,234)',
                  'font-weight': '600',
                  'font-size': '30px',
                }"
              />
            </p>
          </div>
          <a-divider type="vertical" style="height: 75px" />
          <div>
            <p class="height-100">
              <a-statistic
                title="新增确诊"
                :value="statistics.new_cases"
                :value-style="{
                  color: 'rgba(100,112,234)',
                  'font-weight': '600',
                  'font-size': '30px',
                }"
              />
            </p>
          </div>
          <a-divider type="vertical" style="height: 75px" />
          <div>
            <p class="height-100">
              <a-statistic
                title="累计确诊"
                :value="statistics.total_cases"
                :value-style="{
                  color: 'rgb(100,112,234)',
                  'font-weight': '600',
                  'font-size': '30px',
                }"
              />
            </p>
          </div>
        <a-divider type="vertical" style="height: 75px" />
          <div>
            <p class="height-100">
              <a-statistic
                title="累计死亡"
                :value="statistics.total_deaths"
                :value-style="{ 'font-weight': '600', 'font-size': '30px' }"
              />
            </p>
          </div>
          <a-divider type="vertical" style="height: 75px" />
          <div>
            <p class="height-100">
              <a-statistic
                title="疫苗接种总剂数"
                :value="
                  statistics.vaccines == undefined
                    ? '无数据'
                    : statistics.vaccines + '万'
                "
                :value-style="{
                  'font-weight': '600',
                  'font-size': '30px',
                  color: 'rgb(21,182,107)',
                }"
              />
            </p>
          </div>
          <a-divider type="vertical" style="height: 75px" />
          <div style="min-height: 106px"><!--这太邪道了-->
            <p class="height-100">
              <a-statistic
                title="完整接种疫苗人数"
                :value="
                  statistics.vaccinesPopulation == undefined
                    ? '无数据'
                    : statistics.vaccinesPopulation + '万'
                "
                :value-style="{
                  color: 'rgb(21,182,107)',
                  'font-weight': '600',
                  'font-size': '30px',
                }"
              />
              <a-progress
                v-if="!isNaN(statistics.vaccinesRate)"
                :percent="statistics.vaccinesRate"
                style="width: 90%"
                :stroke-color="{
                  '0%': 'rgb(100,112,234)',
                  '100%': 'rgb(21,182,107)',
                }"
              />
            </p>
          </div>
        </a-row>
          <div
            style="
              color: grey;
              font-size: 14px;
              margin-bottom: -12px;
              text-align: right;
            "
          >
            数据截至 {{ this.data.dataSourceUpdateTime.updateTime }} · 来源：<a
              href="https://news.qq.com/zt2020/page/feiyan.htm#/"
              target="_blank"
              style="color: grey"
              ><u>{{ this.data.dataSourceUpdateTime.dataSource }}</u></a
            >
          </div>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.dataCard {
  text-align: left;
}
</style>

<script>
export default {
  data() {
    return {
      statistics: null,
    };
  },
  props: {
    data: Object,
    provinceName: String,
  },
  computed: {
    isDataLoaded() {
      return this.statistics != null;
    },
  },
  mounted() {
    this.refresh();
  },
  watch: {
    provinceName() {
      this.refresh();
    },
    data() {
      this.refresh();
    },
  },
  methods: {
    refresh() {
      if (
        this.data == undefined ||
        this.data.dataSourceUpdateTime == undefined
      ) {
        return;
      }
      const { updateTime, dataSource } = this.data.dataSourceUpdateTime;

      var source = this.data.provinceArray[this.provinceName];
      if (this.provinceName == "全国") {
        source = this.data.country;
      }
      const {
        total: { confirm: totalConfirmed, dead: totalDeath, heal: totalHeal },
        today: { confirm: newConfirmed },
        vaccines: vaccines,
        vaccinesPopulation: vaccinesPopulation,
        population: population,
      } = source;
      let vaccinesRate = parseFloat(((vaccinesPopulation / population) * 100).toFixed(2));
      this.statistics = {
        name: this.provinceName,
        new_cases: newConfirmed,
        total_cases: totalConfirmed,
        total_cure: totalHeal,
        total_deaths: totalDeath,
        vaccines: vaccines,
        vaccinesPopulation: vaccinesPopulation,
        vaccinesRate: vaccinesRate,
        updateTime,
        dataSource,
      };
    },
  },
};
</script>