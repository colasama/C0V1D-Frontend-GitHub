<template>
  <div id="public0">
    <!--切换按钮-->
    <div class="mapSwitch">
      <a-button-group>
        <a-button :type="buttonType.china" @click="switchToChina"
          >国内</a-button
        >
        <a-button :type="buttonType.global" @click="switchToGlobal"
          >全球</a-button
        >
      </a-button-group>
    </div>
    <!--大地图 Part-->
    <GlobalMap
      v-if="mapOptions.isGlobal == true"
      :data="globalMapData"
      :flightData="travelData"
      :mapOptions="mapOptions"
      @getCountrySearch="searchCountry"
      @showModal="selectNative"
    />
    <!--搜索框 Part-->
    <div style="margin-top: -18px" v-if="mapOptions.isGlobal == true">
      <a-auto-complete
        :data-source="searchDataSource"
        size="large"
        :filter-option="filterOption"
        @select="changeArea"
      >
        <a-input
          size="large"
          style="width: 800px"
          :value="isoTransform(countryISO)"
          :placeholder="inputPlaceholder"
        >
          <a-icon slot="prefix" type="search" />
        </a-input>
      </a-auto-complete>
    </div>

    <!--具体数据 Part-->
    <div
      style="
        float: left; /*position: fixed*/
        margin-left: 30px;
        margin-top: 24px;
        text-align: left;
      "
    >
      <a-anchor
        v-if="mapOptions.isGlobal"
        :offsetTop="400"
        style="margin-left: 32px; margin-right: 16px"
      >
        <a-anchor-link class="anchor" href="#public0">
          <template>
            <span class="menu" slot="title">全球地图</span>
          </template>
        </a-anchor-link>
        <a-anchor-link class="anchor" href="#global1">
          <template>
            <span class="menu" slot="title">详细数据</span>
          </template>
        </a-anchor-link>
        <a-anchor-link class="anchor" href="#global2">
          <template>
            <span class="menu" slot="title">全球统计</span>
          </template>
        </a-anchor-link>
        <a-anchor-link class="anchor" href="#global3">
          <template>
            <span class="menu" slot="title">病例数据</span>
          </template>
        </a-anchor-link>
        <a-anchor-link class="anchor" href="#global4">
          <template>
            <span class="menu" slot="title">疫苗统计</span>
          </template>
        </a-anchor-link>
        <a-anchor-link class="anchor" href="#global5">
          <template>
            <span class="menu" slot="title">死亡人数</span>
          </template>
        </a-anchor-link>
        <a-anchor-link class="anchor" href="#global6">
          <template>
            <span class="menu" slot="title">疫情轨迹</span>
          </template>
        </a-anchor-link>
      </a-anchor>
      <a-anchor
        v-if="!mapOptions.isGlobal"
        :offsetTop="200"
        style="margin-left: 32px; margin-right: 16px"
      >
        <a-anchor-link class="anchor" href="#native1">
          <template>
            <span class="menu" slot="title">详细数据</span>
          </template>
        </a-anchor-link>
        <a-anchor-link class="anchor" href="#native2">
          <template>
            <span class="menu" slot="title">省市统计</span>
          </template>
        </a-anchor-link>
        <a-anchor-link class="anchor" href="#native3">
          <template>
            <span class="menu" slot="title">疫情轨迹</span>
          </template>
        </a-anchor-link>
        <a-anchor-link class="anchor" href="#native4">
          <template>
            <span class="menu" slot="title">疫情订阅</span>
          </template>
        </a-anchor-link>
      </a-anchor>
    </div>
    <!--国内 Part-->
    <div class="homeContentBox" v-if="!mapOptions.isGlobal">
      <a-row
        type="flex"
        justify="center"
        :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }"
      >
        <a-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
          <ProvinceStatistics
            id="native1"
            :data="chinaData"
            class="figurePart"
            :provinceName="provinceName"
          />
          <div style="text-align: left; margin-top: -72px; margin-left: 24px">
            <a-auto-complete
              :data-source="searchDataSource"
              :filter-option="filterOption"
              style="margin-bottom: 40px"
              @select="changeArea"
            >
              <a-input
                style="width: 360px"
                :value="isoTransform(countryISO)"
                :placeholder="inputPlaceholder"
              >
                <a-icon slot="prefix" type="search" />
              </a-input>
            </a-auto-complete>
          </div>
          <ProvincesFigure
            id="native2"
            :data="chinaData"
            class="figurePart"
            @Subscribe="Subscribe"
            :provinceName="provinceName"
          />
          <TravelAttention id="native3" :data="travelData" class="figurePart" />
          <Subscribe
            id="native4"
            v-if="this.$store.state.username"
            :data="chinaData"
            ref="subscribe"
            class="figurePart"
          />
        </a-col>
        <a-col :xs="0" :sm="0" :md="0" :lg="8" :xl="8">
          <NativeMap
            v-if="mapOptions.isGlobal == false"
            :data="chinaData"
            :mapOptions="mapOptions"
            :location="locationData"
            @getProvince="searchProvince"
            class="figurePart"
          />
          <LocalStatistics
            :data="chinaData"
            :location="locationData"
            @getLoc="getLocation"
            class="figurePart"
          />

          <RiskAttention :data="chinaData.risk" class="figurePart" />
          <News :area="newsArea" class="figurePart" />
        </a-col>
      </a-row>
    </div>
    <!--国际 Part-->
    <div class="homeContentBox" v-if="mapOptions.isGlobal">
      <a-row
        type="flex"
        justify="center"
        :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }"
      >
        <a-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
          <MainStatistics
            :data="data"
            :updateTime="globalUpdatedTime"
            class="figurePart"
            id="global1"
          />
          <CountriesFigure id="global2" :data="rankData" class="figurePart" />
          <CasesFigure id="global3" :data="data" class="figurePart" />
          <Vaccines id="global4" :data="data" class="figurePart" />
          <DeathFigure id="global5" :data="data" class="figurePart" />
          <TravelAttention id="global6" :data="travelData" class="figurePart" />
        </a-col>
        <a-col :xs="0" :sm="0" :md="0" :lg="8" :xl="8">
          <News :area="newsArea" />
        </a-col>
      </a-row>
    </div>

    <Chat />

    <!--    <div class="bottomButton">-->
    <!--      <a-button type="primary" size="large" icon="aliwangwang">-->
    <!--      </a-button>-->
    <!--    </div>-->
  </div>
</template>
<style>
.homeContentBox {
  margin: 24px 3% 0 3%;
  text-align: left;
}

.figurePart {
  margin-bottom: 24px;
}

.mapSwitch {
  max-width: 10px;
  position: absolute;
  top: 18px;
  left: 45%;
  right: 0;
  z-index: 10;
}

.menu {
  font-size: 16px;
}

.anchor {
  margin-bottom: 10px;
}

.bottomButton {
  position: fixed;
  bottom: 24px;
  right: 24px;
}
</style>

<script>
// @ is an alias to /src
import CasesFigure from "../components/statistics/CasesFigure.vue";
import MainStatistics from "../components/statistics/MainStatistics.vue";
import ProvinceStatistics from "../components/statistics/ProvinceStatistics.vue";
import Vaccines from "../components/statistics/Vaccines.vue";
import NativeMap from "../components/NativeMap.vue";
import GlobalMap from "../components/GlobalMap.vue";
import News from "../components/LiveNews.vue";
import DeathFigure from "../components/statistics/DeathFigure.vue";
import TravelAttention from "../components/statistics/TravelAttention.vue";
import CountriesFigure from "../components/statistics/CountriesFigure.vue";
import RiskAttention from "../components/RiskAttention.vue";
import ProvincesFigure from "../components/statistics/ProvincesFigure.vue";
import Subscribe from "../components/statistics/Subscribes.vue";
import Chat from "../components/Chat.vue";
import LocalStatistics from "../components/statistics/LocalStatistics.vue";

export default {
  name: "Home",
  components: {
    RiskAttention,
    TravelAttention,
    MainStatistics,
    ProvinceStatistics,
    CasesFigure,
    Vaccines,
    GlobalMap,
    NativeMap,
    News,
    DeathFigure,
    CountriesFigure,
    ProvincesFigure,
    Subscribe,
    Chat,
    LocalStatistics,
  },
  data() {
    return {
      inputPlaceholder: "选择您想了解的省份...",
      globalUpdatedTime: "",
      countryISO: "OWID_WRL",
      provinceName: "全国",
      data: [],
      rankData: {},
      globalMapData: {},
      travelData: [],
      chinaData: {},
      newsArea: "",
      locationData: {},
      searchDataSource: [],
      countryDataSource: [],
      provinceDataSource: [],
      country2Code: {},
      buttonType: {
        china: "default",
        global: "primary",
      },
      highLevelCountry: [],
      mapOptions: {
        isGlobal: false,
      },
      modalVisible: false,
      subscribeVisible: false,
    };
  },
  created() {
    this.getCountry();
    // this.refreshData();
    // this.refreshRank();
    this.refreshTravleData();
    this.refreshChinaData();
    this.getHiglLevelCountry();
  },
  watch: {},
  methods: {
    onSubscribe() {
      this.subscribeVisible = false;
    },
    Subscribe(Pname, Dname) {
      this.$refs.subscribe.Subscribe(Pname, Dname);
    },
    getCountry() {
      const list = require("../assets/iso2name.json");
      for (const key in list) {
        if (Object.hasOwnProperty.call(list, key)) {
          const element = list[key];
          this.countryDataSource.push(element);
          this.country2Code[element] = key;
        }
      }
    },
    // 将isoCode转换为中文国家名称，其中全球对应GLB
    isoTransform(iso) {
      const list = require("../assets/iso2name.json");
      return list[iso];
    },
    // 改变地区
    changeArea(country) {
      if (this.mapOptions.isGlobal) {
        this.searchCountry(this.country2Code[country]);
      } else {
        this.searchProvince(country);
      }
    },
    refreshData() {
      const that = this;
      const query = new this.$AV.Query("WorldData");
      query.equalTo("iso_code", this.countryISO);
      query.descending("date");
      query.limit(1000);
      query.find().then((data) => {
        that.data = data;
      });
    },
    refreshRank() {
      const query = new this.$AV.Query("LatestWorldData");
      query.descending("new_cases");
      query.limit(1000);
      query.find().then((data) => {
        let temp = {};
        for (const key in data) {
          const element = data[key];
          temp[element.attributes.iso_code] = element.attributes;
        }
        this.globalMapData = temp;
        const vac_query = new this.$AV.Query("LatestWorldData");
        vac_query.descending("total_vaccinations");
        vac_query.limit(1000);
        vac_query.find().then((vac_data) => {
          this.rankData = {
            vaccines: vac_data,
            cases: data,
          };
          this.newsArea = "全球";
        });
      });
      const time_query = new this.$AV.Query("UpdatedTime");
      time_query.equalTo("type", "global");
      time_query.find().then((data) => {
        this.globalUpdatedTime = data[0].attributes.updated_time;
      });
    },
    refreshTravleData() {
      const query = new this.$AV.Query("Travel");
      query.descending("date");
      query.limit(1000);
      query.find().then((data) => {
        this.travelData = data;
      });
    },
    refreshChinaData() {
      const query = new this.$AV.Query("ChinaData");
      query.limit(1000);
      query.find().then((res) => {
        res = res[0];
        let temp = res.attributes.data;
        let tempprovinceDataSource = ["全国"];
        for (const key in temp.provinceArray) {
          const element = temp.provinceArray[key];
          tempprovinceDataSource.push(element.name);
        }
        this.provinceDataSource = tempprovinceDataSource;
        this.searchDataSource = this.provinceDataSource;
        this.newsArea = "全国";
        const query = new this.$AV.Query("Risk");
        query.limit(1000);
        query.find().then((data) => {
          temp["risk"] = data;
          const query = new this.$AV.Query("ChinaVaccine");
          query.limit(1000);
          query.find().then((data) => {
            for (const iterator of data) {
              const item = iterator.attributes;
              if (item.name === "全国") {
                temp.country["vaccines"] = item.vaccine;
                temp.country["vaccinesPopulation"] = item.population;
                temp.country["vaccinesDate"] = item.date;
                temp.country["population"] = item.total_population;
              } else {
                temp.provinceArray[item.name]["vaccines"] = item.vaccine;
                temp.provinceArray[item.name]["vaccinesPopulation"] =
                  item.population;
                temp.provinceArray[item.name]["vaccinesDate"] = item.date;
                temp.provinceArray[item.name]["population"] =
                  item.total_population;
              }
            }
            this.chinaData = temp;
          });
        });
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      );
    },
    switchToChina() {
      this.inputPlaceholder = "选择您想了解的省份...";
      this.buttonType.global = "primary";
      this.buttonType.china = "default";
      this.mapOptions.isGlobal = false;
      this.searchDataSource = this.provinceDataSource;
      this.searchProvince("全国");
      window.location.reload();
    },
    switchToGlobal() {
      this.mapOptions.isGlobal = true;
      this.inputPlaceholder = "选择您想了解的国家...";
      this.buttonType.global = "default";
      this.buttonType.china = "primary";
      this.countryISO = "OWID_WRL";
      this.refreshData();
      this.refreshRank();
      this.searchDataSource = this.countryDataSource;
    },
    getHiglLevelCountry() {
      const that = this;
      const query = new this.$AV.Query("WorldData");
      query.descending("date");
      query.limit(1000);
      query.find().then((data) => {
        const highLevelCountry = {};
        data.forEach((x) => {
          const { iso_code, new_cases } = x.attributes;
          if (highLevelCountry[iso_code] == null) {
            highLevelCountry[iso_code] = 0;
          }
          if (highLevelCountry[iso_code] == 0 && new_cases != undefined) {
            highLevelCountry[iso_code] += new_cases;
          }
        });
        that.highLevelCountry = Object.entries(highLevelCountry)
          .filter((x) => !x[0].startsWith("OWID_") && x[1] != 0)
          .sort((a, b) => b[1] - a[1]);
      });
    },
    searchProvince(provinceName) {
      this.provinceName = provinceName;
      this.newsArea = provinceName;
    },
    searchCountry(countryISO) {
      this.countryISO = countryISO;
      this.refreshData();
    },
    selectNative(show) {
      this.mapOptions.isGlobal = show;
      this.switchToChina();
      this.$message.success("切换成功！");
    },
    getLocation() {
      const that = this;
      if ("geolocation" in navigator) {
        const ua = navigator.userAgent;
        if (ua.indexOf("Chrome") != -1 && ua.indexOf("Edg") == -1)
          this.$message.warning(
            "请注意，对于Google Chrome浏览器，可能由于国内无法访问定位服务而产生无限加载。"
          );
        window.navigator.geolocation.getCurrentPosition(function (position) {
          const key = "99d7d17d2400c5ac1845a9f0b99baae0";
          const coordsString =
            String(position.coords.longitude) +
            "," +
            String(position.coords.latitude);
          that
            .$axios({
              method: "get",
              url: "https://restapi.amap.com/v3/geocode/regeo?parameters",
              params: {
                location: coordsString,
                key: key,
              },
            })
            .then((res) => {
              let data = res.data.regeocode.addressComponent;
              if (data.city.length == 0) {
                data.city = data.district;
              }
              data.location = coordsString;
              that.locationData = data;
              that.searchProvince(data.province);
            })
            .catch((res) => {
              console.log(res);
            });
        });
      } else {
        return;
      }
    },
  },
};
</script>

<style>
.ant-statistic-title {
  font-size: 16px !important;
}
</style>
