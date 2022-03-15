<template>
  <div>
    <a-card class="dataCard">
      <h2 v-show="this.location == '全国'" style="margin-bottom: 15px">
        各省统计数据
      </h2>
      <a-table
        :columns="columnsForProv"
        :data-source="dataSource"
        :pagination="false"
        :scroll="{ y: 400 }"
        v-if="this.location == '全国'"
      >
        <!-- <template slot="vaccinesRate" slot-scope="record, text">
          {{text.vaccinesRate}}<span v-if="text.vaccinesRate!=='无数据'">%</span>
        </template> -->
        <template slot="vaccinesRate" slot-scope="record, text">
          <a-progress
                v-if="text.vaccinesRate!=='无数据'"
                :percent="parseInt(text.vaccinesRate)"
                :width="40"
                :stroke-color="{
                  '0%': 'rgb(100,112,234)',
                  '100%': 'rgb(21,182,107)',
                }"
          />
          <span v-if="text.vaccinesRate=='无数据'">无数据</span>
        </template>
        <template slot="subscribe" slot-scope="record, text">
          <a-button
            class="b_icon"
            v-if="ifSubscribe(text)"
            size="small"
            style="border-radius: 3px"
            type="primary"
            @click="addSubscribe(text)"
          >
            订阅
          </a-button>
          <div v-if="ifSubscribe(text) !== true">已订阅</div>
        </template>
      </a-table>
      <h2 v-show="this.location != '全国'" style="margin-bottom: 15px">
        各市(区)统计数据
      </h2>
      <a-table
        :columns="columnsForCity"
        :data-source="dataSource"
        :pagination="false"
        :scroll="{ y: 400 }"
        v-if="this.location != '全国'"
      >
        <template slot="subscribe" slot-scope="record, text">
          <a-button
            class="b_icon"
            v-if="ifSubscribe(text)"
            size="small"
            style="border-radius: 3px"
            type="primary"
            @click="addSubscribe(text)"
          >
            订阅
          </a-button>
          <div v-if="ifSubscribe(text) !== true">已订阅</div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
const columnsForProv = [
  {
    title: "位置",
    dataIndex: "province",
    key: "province",
    scopedSlots: { customRender: "province" },
  },
  {
    title: "新增确诊",
    dataIndex: "newConfirmed",
    key: "newConfirmed",
    scopedSlots: { customRender: "newConfirmed" },
    sorter: (a, b) => a.newConfirmed - b.newConfirmed,
    defaultSortOrder: "descend",
  },
  {
    title: "累积确诊",
    dataIndex: "totalConfirmed",
    key: "totalConfirmed",
    scopedSlots: { customRender: "totalConfirmed" },
    sorter: (a, b) => a.totalConfirmed - b.totalConfirmed,
  },
  {
    title: "疫苗接种率",
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
  {
    title: "累积死亡",
    dataIndex: "totalDeath",
    key: "totalDeath",
    sorter: (a, b) => a.totalDeath - b.totalDeath,
  },
  {
    title: "现存确诊",
    dataIndex: "totalIncrease",
    key: "totalIncrease",
    sorter: (a, b) => a.totalIncrease - b.totalIncrease,
  },
];

const columnsForCity = [
  {
    title: "位置",
    dataIndex: "province",
    key: "province",
    scopedSlots: { customRender: "province" },
  },
  {
    title: "新增确诊",
    dataIndex: "newConfirmed",
    key: "newConfirmed",
    scopedSlots: { customRender: "newConfirmed" },
    sorter: (a, b) => a.newConfirmed - b.newConfirmed,
    defaultSortOrder: "descend",
  },
  {
    title: "累积确诊",
    dataIndex: "totalConfirmed",
    key: "totalConfirmed",
    scopedSlots: { customRender: "totalConfirmed" },
    sorter: (a, b) => a.totalConfirmed - b.totalConfirmed,
  },
  {
    title: "累积治愈",
    dataIndex: "totalCured",
    key: "totalCured",
    sorter: (a, b) => {return a.totalCured - b.totalCured},
  },
  {
    title: "累积死亡",
    dataIndex: "totalDeath",
    key: "totalDeath",
    sorter: (a, b) => a.totalDeath - b.totalDeath,
  },
  {
    title: "现存确诊",
    dataIndex: "totalIncrease",
    key: "totalIncrease",
    sorter: (a, b) => a.totalIncrease - b.totalIncrease,
  },
];

export default {
  props: ["data", "provinceName"],
  components: {},
  mounted() {
    this.refreshdata();
  },
  data() {
    return {
      columnsForProv,
      columnsForCity,
      dataSource: undefined,
      location: undefined,
      subscribeAreaName: undefined,
    };
  },
  methods: {
    ch_mode(mode) {
      this.mode = mode;
    },
    addSubscribe(text) {
      if (text.father_location == "全国") {
        this.$emit("Subscribe", text.province);
      } else {
        this.$emit("Subscribe", text.father_location, text.province);
      }
    },
    isoTransform(iso) {
      const list = require("../../assets/iso2name.json");
      return list[iso];
    },
    iso3to2(iso) {
      const list = require("../../assets/iso3to2.json");
      return list[iso];
    },
    ifSubscribe(text) {
      if (this.location == "全国") {
        let ind = this.subscribeAreaName.findIndex((val) => {
          return val.Dname == text.province && val.Pname == text.province;
        });
        return ind == -1;
      } else {
        let ind = this.subscribeAreaName.findIndex((val) => {
          return (
            val.Dname == text.province && val.Pname == text.father_location
          );
        });
        return ind == -1;
      }
    },
    refreshdata() {
      let res = [];
      this.location = this.provinceName;
      this.subscribeAreaName = this.subscribeArea.map((val) => {
        return {
          Dname: val.attributes.Dname,
          Pname: val.attributes.Pname,
        };
      });
      if (this.location == "全国") {
        for (let key in this.data.provinceArray) {
          let val = this.data.provinceArray[key];
          res.push({
            father_location: this.location,
            province: val.name,
            newConfirmed: val.today.confirm,
            totalConfirmed: val.total.confirm,
            vaccinesRate: val.vaccinesPopulation==undefined ? '无数据' : parseFloat((val.vaccinesPopulation/val.population) 
                                      * 100).toFixed(1),
            totalDeath: val.total.dead,
            totalIncrease: val.total.nowConfirm,
            subscribe: val.name,
          });
        }
      } else {
        res = this.data.provinceArray[this.location].children.map((val) => {
          return {
            father_location: this.location,
            province: val.name,
            newConfirmed: val.today.confirm,
            totalConfirmed: val.total.confirm,
            totalCured: val.total.heal,
            totalDeath: val.total.dead,
            totalIncrease: val.total.nowConfirm,
            subscribe: val.name,
          };
        });
      }
      this.dataSource = res
      if (this.$store.state.token != "" && columnsForProv.length <= 6) {
        columnsForProv.push({
          title: "订阅",
          dataIndex: "subscribe",
          key: "subscribe",
          scopedSlots: { customRender: "subscribe" },
        });
        columnsForCity.push({
          title: "订阅",
          dataIndex: "subscribe",
          key: "subscribe",
          scopedSlots: { customRender: "subscribe" },
        });
      }
    },
  },
  watch: {
    data() {
      this.refreshdata();
    },
    provinceName() {
      this.refreshdata();
    },
    subscribeArea() {
      this.refreshdata();
    },
  },
  computed: {
    subscribeArea() {
      return this.$store.state.subscribedArea;
    },
  },
};
</script>

<style>
.ant-table-thead > tr > th {
  color: #000000;
  background: #ffffff !important;
  font-size: 17px !important;
  font-weight: large;
}

.ant-table-tbody > tr > td {
  color: #000000;
  background: #ffffff !important;
  font-size: 17px !important;
  font-weight: large;
}

.dataCard {
  text-align: left;
}

.b_icon > i,
b_icon > span {
  display: inline-block;
  transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  pointer-events: none;
  font-weight: bold;
  font-size: 25px;
}
</style>