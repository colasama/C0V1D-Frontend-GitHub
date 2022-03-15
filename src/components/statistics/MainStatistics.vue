<template>
  <div>
    <a-card class="dataCard">
      <a-skeleton active :paragraph="{ rows: 8 }" v-if="!isDataLoaded" />
      <div v-if="isDataLoaded">
        <div style="display: flex">
          <h2 style="margin-bottom: 16px">{{ statistics.name }}</h2>
          <div style="margin-top: 8px">
            <a-icon
              style="margin-left: 8px"
              inline-block
              :style="{ fontSize: '24px' }"
              type="global"
              v-if="statistics.name == '全球'"
            />
          </div>
          <div style="margin-top: 12px; margin-left: 6px">
            <country-flag
              v-if="statistics.name !== '全球'"
              :country="iso3to2(name2iso(statistics.name))"
            />
          </div>
        </div>
        <a-row type="flex" justify="space-around" align="top">
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="新增确诊"
                :value-style="{
                  color: 'rgba(100,112,234)',
                  'font-weight': '600',
                  'font-size': '30px',
                }"
                :value="statistics.new_cases"
              />
            </p>
          </a-col>
          <a-divider type="vertical" style="height: 75px" />
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="新增死亡"
                :value-style="{ 'font-weight': '600', 'font-size': '30px' }"
                :value="statistics.new_deaths"
              />
            </p>
          </a-col>
          <a-divider type="vertical" style="height: 75px" />
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="新增疫苗接种（14天）"
                :value="statistics.new_vaccinations_sum"
                :value-style="{
                  color: 'rgb(21,182,107)',
                  'font-weight': '600',
                  'font-size': '30px',
                }"
              />
              {{ statistics.date }}
            </p>
          </a-col>
        </a-row>
        <a-divider />
        <a-row type="flex" justify="space-around" align="top">
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="累计确诊"
                :value-style="{
                  color: 'rgba(100,112,234)',
                  'font-weight': '600',
                  'font-size': '30px',
                }"
                :value="statistics.total_cases"
              />
            </p>
          </a-col>
          <a-divider type="vertical" style="height: 100px" />
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="累计死亡"
                :value-style="{ 'font-weight': '600', 'font-size': '30px' }"
                :value="statistics.total_deaths"
              />
            </p>
          </a-col>
          <a-divider type="vertical" style="height: 100px" />
          <a-col :span="6">
            <p class="height-100">
              <a-statistic
                title="疫苗接种总剂数"
                :value="statistics.total_vaccinations"
                :value-style="{
                  color: 'rgb(21,182,107)',
                  'font-weight': '600',
                  'font-size': '30px',
                }"
              />
              每百人接种 {{ statistics.total_vaccinations_per_hundred }} 剂次
            </p>
          </a-col>
        </a-row>
        <div
          style="
            color: grey;
            font-size: 14px;
            margin-bottom: -12px;
            text-align: right;
          "
        >
          数据截至 {{ timeString }} · 来源：<a
            href="https://ourworldindata.org/"
            target="_blank"
            style="color: grey"
            ><u>Our World In Data</u></a
          >
        </div>
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
const ISO2NAME = require("@/assets/iso2name.json");
import CountryFlag from "vue-country-flag";

export default {
  data() {
    return {
      statistics: null,
      timeString: "",
    };
  },
  components: {
    CountryFlag,
  },
  props: {
    data: Array,
    updateTime: String,
  },
  computed: {
    isDataLoaded() {
      return this.statistics != null;
    },
  },
  watch: {
    data() {
      this.refresh();
    },
  },
  methods: {
    refresh() {
      var data = this.data.slice(0, 14);
      var {
        iso_code,
        new_cases,
        new_deaths,
        total_cases,
        total_deaths,
        date: dateString,
        total_vaccinations = 0,
        total_vaccinations_per_hundred = 0,
      } = data[0].attributes;

      data = data.filter((x) => x.attributes.new_vaccinations != undefined);
      if (data.length != 0) {
        ({ total_vaccinations, total_vaccinations_per_hundred } =
          data[0].attributes);
      }

      const name = ISO2NAME[iso_code];
      const new_vaccinations_sum = data.reduce(
        (total, x) => total + x.attributes.new_vaccinations,
        0
      );

      const endDate = new Date(dateString);
      const beginDate = new Date(endDate);
      let d = new Date(this.updateTime);
      d.setHours(d.getHours() + 8);
      this.timeString = d.toLocaleString();
      beginDate.setDate(beginDate.getDate() - 13);
      const date = `${beginDate.getMonth() + 1}月${beginDate.getDate()}日至${
        endDate.getMonth() + 1
      }月${endDate.getDate()}日`;

      this.statistics = {
        name,
        new_cases,
        new_deaths,
        total_cases,
        total_deaths,
        total_vaccinations,
        total_vaccinations_per_hundred,
        new_vaccinations_sum,
        date,
      };
    },
    iso3to2(iso) {
      const list = require("../../assets/iso3to2.json");
      return list[iso];
    },
    name2iso(name) {
      const list = require("../../assets/iso2name.json");
      for (const key in list) {
        if (Object.hasOwnProperty.call(list, key)) {
          if (list[key] == name) return key;
        }
      }
    },
  },
};
</script>
