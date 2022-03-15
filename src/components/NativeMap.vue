<template>
  <div>
    <a-card>
      <h2 style="margin-bottom: 16px">疫情地图</h2>
      <div
        style="
          height: 450px;
          margin-left: -24px;
          margin-right: -24px;
          margin-bottom: -24px;
        "
        id="mapContainer"
      ></div>
      <template slot="actions">
        <a-icon key="compass" @click="onCompass" type="compass" />
        <a-icon key="shrink" @click="onShrink" type="shrink" />
      </template>
    </a-card>
  </div>
</template>
<script>
import * as echarts from "echarts";

import chinaJson from "../assets/china.json";
import provinceCoordMap from "../assets/provinceCoordMap.json";
export default {
  name: "NativeMap",
  components: {},
  props: {
    data: Object,
    mapOptions: Object,
    location: Object,
  },
  data() {
    return {
      myChart: undefined,
      myOption: undefined,
      mapType: chinaJson,
      provinceData: [],
      startZoom: 0.8,
      startCoordinate: [105, 38],
      locationCoordinate: [105, 38],
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.handleData();
        this.drawMultiChart2();
      }, 50);
    });
  },
  watch: {
    data() {
      this.handleData();
      this.drawMultiChart2();
    },
    location() {
      this.handleData();
      this.drawMultiChart2();
    },
  },
  methods: {
    onCompass() {
      if (this.location.location) {
        this.startZoom = 3;
        this.startCoordinate = this.locationCoordinate;
        this.$emit("getProvince", this.location.province);
        this.drawMultiChart2();
      }
    },
    onShrink() {
      this.startZoom = 0.8;
      this.startCoordinate = [105, 38];
      this.$emit("getProvince", "全国");
      this.drawMultiChart2();
    },
    handleData() {
      let temp = [];
      for (const name in this.data.provinceArray) {
        let obj = {};
        obj["name"] = name;
        obj["confirmed"] = this.data.provinceArray[name].total.confirm;
        obj["cured"] = this.data.provinceArray[name].total.heal;
        obj["death"] = this.data.provinceArray[name].total.dead;
        temp.push(obj);
      }
      this.provinceData = temp;
      if (this.location.location) {
        if (!this.location.country || this.location.country !== "中国") {
          return;
        }
        let locationStr = this.location.location.split(",");
        this.locationCoordinate = [
          parseFloat(locationStr[0]),
          parseFloat(locationStr[1]),
        ];
        this.startCoordinate = this.locationCoordinate;
        this.startZoom = 3;
      }
    },
    drawMultiChart2() {
      const countryName = "中华人民共和国";
      const geoCoordMap = provinceCoordMap;
      const midHighLevel = this.data.risk;
      let handleLocation = (location) => {
        if (location.location) {
          if (!location.country || location.country !== "中国") {
            this.$message.info("当前定位未在国内，请重新定位！");
            return [];
          }
          let locationStr = location.location.split(",");
          return [
            {
              name: location.province,
              value: [
                parseFloat(locationStr[0]),
                parseFloat(locationStr[1]),
                location.province,
                location.city,
                location.district,
              ],
            },
          ];
        }
        return [];
      };
      let convertData = (originData) => {
        const res = [];
        if (originData) {
          for (let i = 0; i < originData.length; i++) {
            //let name = originData[i].attributes.city;
            let level =
              originData[i].attributes
                .level; /* level为1 中风险 level为2 高风险 */
            let geo = originData[i].attributes.geopoint;
            res.push({
              name: originData[i].attributes.province,
              value: [
                geo.longitude,
                geo.latitude,
                level,
                originData[i].attributes.province,
                originData[i].attributes.city,
                originData[i].attributes.location,
              ],
            });
          }
        }
        return res;
      };
      let convertData2 = function (originData) {
        const res = [];
        let data = JSON.parse(JSON.stringify(originData));
        for (let i = 0; i < data.length; i++) {
          const geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord
                .concat(parseInt(data[i].confirmed))
                .concat(parseInt(data[i].cured)),
            });
          }
        }
        return res;
      };
      let showCard = (obj) => {
        if (!this.data.provinceArray) return "";
        //console.log(obj)
        if (obj === "南海诸岛")
          return (
            '<div style="font-weight: 700; font-size: 17px; padding: 0 8px;">' +
            obj +
            "</div>"
          );
        //console.log(obj)
        obj = this.data.provinceArray[obj];
        let div =
          '<div style="min-width: 150px; text-align:center">\n' +
          '                <div style="font-weight: 700; font-size: 18px; padding: 0 8px;">' +
          obj.name +
          "</div>\n" +
          '                <div style="padding: 0 8px; text-align: center; opacity: .66; font-weight: 500; font-size: 12px;">' +
          countryName +
          "</div>\n" +
          '                <table style="margin-top: 8px; font-size: 12px; font-family: serif">\n' +
          "                    <tbody>\n" +
          "                        <tr>\n" +
          '                            <td style="min-width: 80px; text-align: left; padding-left: 8px">新增病例</td>\n' +
          (obj.today.confirm === 0
            ? '                            <td style="min-width: 80px; text-align: right; padding-right: 8px">' +
              obj.today.confirm +
              "</td>\n"
            : '                            <td style="color: red;font-weight: 700;min-width: 80px; text-align: right; padding-right: 8px">' +
              obj.today.confirm +
              "</td>\n") +
          "                        </tr>\n" +
          "                        <tr>\n" +
          '                            <td style="min-width: 80px; text-align: left; padding-left: 8px">确诊总数</td>\n' +
          '                            <td style="min-width: 80px; text-align: right; padding-right: 8px">' +
          obj.total.confirm +
          "</td>\n" +
          "                        </tr>\n" +
          "                        <tr>\n" +
          '                            <td style="min-width: 80px; text-align: left; padding-left: 8px">治愈总数</td>\n' +
          '                            <td style="min-width: 80px; text-align: right; padding-right: 8px">' +
          obj.total.heal +
          "</td>\n" +
          "                        </tr>\n" +
          "                        <tr>\n" +
          '                            <td style="min-width: 80px; text-align: left; padding-left: 8px">死亡总数</td>\n' +
          '                            <td style="min-width: 80px; text-align: right; padding-right: 8px">' +
          obj.total.dead +
          "</td>\n" +
          "                        </tr>\n" +
          "                    </tbody>\n" +
          "                </table>\n" +
          "            </div>";
        return div;
      };
      echarts.registerMap("china", this.mapType);
      this.myChart = echarts.init(document.getElementById("mapContainer"));
      //每次窗口大小改变的时候都会触发onresize事件，这个时候我们将echarts对象的尺寸赋值给窗口的大小这个属性，从而实现图表对象与窗口对象的尺寸一致的情况
      window.onresize = this.myChart.resize;
      this.myOption = {
        backgroundColor: "rgb(138, 180, 248)",
        title: {
          show: false,
          top: 15,
          left: 15,
          text: "国内疫情地图",
          x: "left",
          textStyle: {
            color: "#232323",
          },
        },
        legend: {
          show: true,
          orient: "vertical",
          x: "right",
          y: "bottom",
          data: ["用户当前定位", "累计总确诊数", "中高风险地区"],
          textStyle: {
            color: "#000",
          },
        },
        tooltip: {
          trigger: "item",
        },
        //布局
        grid: [
          {
            x: "-1%",
            y: "-1%",
            width: "100%",
            height: "90%",
          },
        ],
        xAxis: [
          {
            gridIndex: 0,
            type: "value",
            axisLabel: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            type: "category",
            axisLabel: {
              show: false,
              textStyle: {
                color: "#000",
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
          },
        ],
        geo: {
          show: true,
          map: "china",
          scaleLimit: {
            min: 0.5,
            max: 6,
          },
          center: this.startCoordinate,
          zoom: this.startZoom,
          label: {
            normal: {
              show: false,
              textStyle: {
                color: "#B0C4DE",
              },
            },
            emphasis: {
              show: false,
              textStyle: {
                color: "#000" /* 选中省份后省份标签颜色 */,
              },
              fontSize: "25px" /* 选中省份后省份标签文字大小 */,
            },
          },
          roam: true, //是否开启鼠标缩放和平移漫游
          // 改变地图颜色等
          itemStyle: {
            normal: {
              areaColor: "rgb(238,238,238)",
              // areaColor: "rgb(251,248,243)",
              borderWidth: 1,
            },
            emphasis: {
              areaColor: "rgba(218, 220, 224, 1)",
              color: "#000",
              // borderColor: "rgb(25, 103, 210)",
            },
          },
          tooltip: {
            formatter: (val) => showCard(val.name),
          },
        },
        //调整显示级别
        layoutCenter: ["50%", "40%"],
        layoutSize: 800,
        series: [
          {
            name: "用户当前定位",
            type: "scatter",
            symbol: "pin",
            coordinateSystem: "geo",
            data: handleLocation(this.location),
            symbolSize: 32,
            itemStyle: {
              color: "rgb(120,144,156)",
              //color: '#6470ea'
            },
            tooltip: {
              formatter: (val) => {
                return (
                  '<div style="min-width: 150px; text-align: left">' +
                  '<div style="opacity: .66; font-weight: 500; font-size: 18px; color: #21D514; padding-left: 5px">当前位置</div>' +
                  '<div style="margin-top: 8px; font-size: 13px; font-family: serif; padding-left: 5px">省份：' +
                  val.data.value[2] +
                  "</div>" +
                  (val.data.value[3]
                    ? '<div style="font-size: 13px; font-family: serif; padding-left: 5px">城市：' +
                      val.data.value[3] +
                      "</div>"
                    : "") +
                  (val.data.value[4]
                    ? '<div style="font-size: 13px; font-family: serif; padding-left: 5px">具体地址：' +
                      val.data.value[4] +
                      "</div>"
                    : "") +
                  "</div>"
                );
              },
            },
            zlevel: 1,
          },
          {
            name: "累计总确诊数",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData2(this.provinceData),
            symbolSize: (val) => Math.sqrt(val[2] / 10),
            label: {
              color: "black",
              formatter: "{b}",
              position: "bottom",
              show: true,
            },
            itemStyle: {
              color: "rgba(100,112,234,0.7)",
              //color: '#6470ea'
            },
          },
          {
            name: "中高风险地区",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(midHighLevel),
            symbol: "triangle",
            symbolSize: (val) => val[2] * 20,
            tooltip: {
              formatter: (val) => {
                return (
                  '<div style="min-width: 150px; text-align: left">' +
                  '<div style="opacity: .66; font-weight: 500; font-size: 18px; color: red; padding-left: 5px">' +
                  (val.value[2] === 1 ? "中风险地区" : "高风险地区") +
                  "</div>" +
                  '<div style="margin-top: 8px; font-size: 13px; font-family: serif; padding-left: 5px">省份：' +
                  val.value[3] +
                  "</div>" +
                  '<div style="font-size: 13px; font-family: serif; padding-left: 5px">城市：' +
                  val.value[4] +
                  "</div>" +
                  '<div style="font-size: 13px; font-family: serif; padding-left: 5px">具体地址：' +
                  val.value[5] +
                  "</div>" +
                  "</div>"
                );
              },
            },
            itemStyle: {
              color: "rgb(215,8,25)" /*(val) => {
                if (val.data.value[2] === 2) return "rgb(215,8,25)";
                else return "rgb(229,68,21)";
              },*/,
            },
          },
        ],
      };
      this.myChart.setOption(this.myOption);
      this.myChart.on("click", (component) => {
        let param = component.name;
        param = param === "香港特别行政区" ? "中国香港" : param;
        this.$emit("getProvince", param);
      });
      // this.myChart.on("georoam", () => {
      //   //console.log(this.myChart.getOption().geo[0].zoom);
      //   if (this.myChart.getOption().geo[0].zoom < 1) {
      //     this.$emit("getProvince", "全国");
      //   }
      // });
      this.myChart.getZr().on("click", (param) => {
        if (!param.target) {
          this.$emit("getProvince", "全国");
        }
      });
    },
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>