<template>
  <div>
    <a-card class="dataCard">
      <h2 style="margin-bottom: 15px">全球统计数据</h2>
      <span style="font-size:18px">数据类型</span>
      &emsp;
      <a-button-group>
        <a-button
          :type="mode == 'cases' ? 'primary' : ''"
          @click="ch_mode('cases')"
        >
          病例数据
        </a-button>
        &emsp;
        <a-button
          :type="mode == 'cases' ? '' : 'primary'"
          @click="ch_mode('vaccines')"
        >
          疫苗数据
        </a-button>
      </a-button-group>
      <a-table
        :columns="columnsForCases"
        :data-source="dataForCases"
        :pagination="false"
        :scroll="{ y: 400 }"
        v-if="mode == 'cases'"
      >
        <template slot="country" slot-scope="record, text">
          <a-icon
            style="margin-top: -5px"
            class="w_icon"
            type="global"
            v-if="text.iso == 'OWID_WRL'"
          /><country-flag
            v-if="text.iso !== 'OWID_WRL'"
            :country="iso3to2(text.iso)"
            size="small"
          />
          {{ isoTransform(text.iso) }}
        </template>
      </a-table>
      <a-table
        :columns="columnsForVaccines"
        :data-source="dataForVaccines"
        :pagination="false"
        :scroll="{ y: 400 }"
        v-if="mode == 'vaccines'"
      >
        <template slot="country" slot-scope="record, text">
          <a-icon
            style="margin-top: -5px"
            class="w_icon"
            type="global"
            v-if="text.iso == 'OWID_WRL'"
          /><country-flag
            v-if="text.iso !== 'OWID_WRL'"
            :country="iso3to2(text.iso)"
            size="small"
          />
          {{ isoTransform(text.iso) }}
        </template>
        <template slot="vaccinesRate" slot-scope="record, text">
          <a-progress
                v-if="text.vaccinesRate!=='无数据'"
                :percent="parseFloat(text.vaccinesRate)"
                style="width: 90%"
                :stroke-color="{
                  '0%': 'rgb(100,112,234)',
                  '100%': 'rgb(21,182,107)',
                }"
          />
          <span v-if="text.vaccinesRate=='无数据'">无数据</span>
        </template>
      </a-table>
      <div
        style="
          color: grey;
          font-size: 8px;
          margin-top: 12px;
          margin-bottom: -12px;
          text-align: right;
        "
      >
        数据来源：<a
          href="https://ourworldindata.org/"
          target="_blank"
          style="color: grey"
          ><u>Our World In Data</u></a
        >
      </div>
    </a-card>
  </div>
</template>

<script>
import CountryFlag from "vue-country-flag";

const columnsForCases = [
  {
    title: "位置",
    dataIndex: "country",
    key: "country",
    scopedSlots: { customRender: "country" },
  },
  {
    title: "病例总数",
    dataIndex: "totalCases",
    key: "totalCases",
    scopedSlots: { customRender: "totalCases" },
    sorter: (a, b) => a.totalCases - b.totalCases,
  },
  {
    title: "新增病例数(1天)",
    dataIndex: "newCases",
    key: "newCases",
    scopedSlots: { coustomRender: "newCases" },
    sorter: (a, b) => a.newCases - b.newCases,
  },
  {
    title: "每百万人中的病例数",
    dataIndex: "totalCasesPerMillion",
    key: "totalCasesPerMillion",
    scopedSlots: { coustomRender: "totalCasesPerMillion" },
    sorter: (a, b) => a.totalCasesPerMillion - b.totalCasesPerMillion,
  },
  {
    title: "死亡总人数",
    dataIndex: "deathCases",
    key: "deathCases",
    scopedSlots: { coustomRender: "deathCases" },
    sorter: (a, b) => a.deathCases - b.deathCases,
  },
];

const columnsForVaccines = [
  {
    title: "位置",
    dataIndex: "country",
    key: "country",
    scopedSlots: { customRender: "country" },
  },
  {
    title: "疫苗接种总剂数",
    dataIndex: "totalVaccines",
    key: "totalVaccines",
    scopedSlots: { customRender: "totalVaccines" },
    sorter: (a, b) => a.totalVaccines - b.totalVaccines,
  },
  {
    title: "新增疫苗接种剂数(1天)",
    dataIndex: "newVaccines",
    key: "newVaccines",
    scopedSlots: { coustomRender: "newVaccines" },
    sorter: (a, b) => a.newVaccines - b.newVaccines,
  },
  {
    title: "已完整接种的疫苗人数",
    dataIndex: "people",
    key: "people",
    scopedSlots: { coustomRender: "people" },
    sorter: (a, b) => {
      if(b.people == '无数据'){
        return 1
      }
      else if(a.people == '无数据'){
        return -1
      }
      return a.people - b.people
    },
  },
  {
    title: "已完成疫苗人数占总人口百分比",
    dataIndex: "vaccinesRate",
    key: "vaccinesRate",
    scopedSlots: { customRender: "vaccinesRate" },
    sorter: (a, b) => {
      if(b.vaccinesRate == '无数据'){
        return 1
      }
      else if(a.vaccinesRate == '无数据'){
        return -1
      }
      return a.vaccinesRate - b.vaccinesRate
    },
  },
];

export default {
  props: ["data"],
  components: {
    CountryFlag,
  },
  data() {
    return {
      columnsForCases,
      columnsForVaccines,
      mode: "cases",
      dataForCases: undefined,
      dataForVaccines: undefined,
    };
  },
  methods: {
    ch_mode(mode) {
      this.mode = mode;
    },
    isoTransform(iso) {
      const list = require("../../assets/iso2name.json");
      return list[iso];
    },
    iso3to2(iso) {
      const list = require("../../assets/iso3to2.json");
      return list[iso];
    },
  },
  watch: {
    data() {
      var that = this;
      let cases_date = that.data.cases;
      let fileted_data = cases_date.filter((val) => {
        return that.isoTransform(val.attributes["iso_code"]) != undefined;
      });
      //TODO: 记得替换成各个国家的病例数据
      let res = fileted_data.map((val) => {
        return {
          iso: val.attributes.iso_code,
          country: val.attributes.location,
          totalCases:
            val.attributes.total_cases != undefined
              ? val.attributes.total_cases
              : "无数据",
          newCases:
            val.attributes.new_cases != undefined
              ? val.attributes.new_cases
              : "无数据",
          totalCasesPerMillion:
            val.attributes.total_cases_per_million != undefined
              ? val.attributes.total_cases_per_million
              : "无数据",
          deathCases:
            val.attributes.total_deaths != undefined
              ? val.attributes.total_deaths
              : "无数据",
        };
      });
      that.dataForCases = res;
      let vaccines_data = that.data.vaccines;
      fileted_data = vaccines_data.filter((val) => {
        return that.isoTransform(val.attributes["iso_code"]) != undefined;
      });
      res = fileted_data.map((val) => {
        return {
          iso: val.attributes.iso_code,
          country: val.attributes.location,
          totalVaccines:
            val.attributes.total_vaccinations != undefined
              ? val.attributes.total_vaccinations
              : "无数据",
          newVaccines:
            val.attributes.new_vaccinations != undefined
              ? val.attributes.new_vaccinations
              : "无数据",
          people:
            val.attributes.people_fully_vaccinated != undefined
              ? val.attributes.people_fully_vaccinated
              : "无数据",
          vaccinesRate:
            val.attributes.people_fully_vaccinated != undefined
              ? parseFloat(
                  (val.attributes.people_fully_vaccinated /
                    val.attributes.population) *
                    100
                ).toFixed(1)
              : "无数据",
        };
      });
      that.dataForVaccines = res;
    },
  },
};
</script>

<style>
.ant-table-thead > tr > th {
  color: #000000;
  background: #ffffff !important;
  font-size: 5px;
  font-weight: small;
}

.ant-table-tbody > tr > th {
  color: #000000;
  background: #ffffff !important;
  font-size: 5px;
  font-weight: small;
}

.dataCard {
  text-align: left;
}

.w_icon > svg {
  vertical-align: unset;
}
</style>