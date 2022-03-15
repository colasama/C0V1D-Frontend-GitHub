<template>
  <div style="height: 480px" id="mapContainer"></div>
</template>

<script>
import * as echarts from "echarts";

import worldJson from "../assets/world.json";
import ISO2Name from "../assets/iso2name.json";
import worldGeo from "../assets/world_coordinate.json";
import flag from "../assets/flag.json";
export default {
  name: "NativeMap",
  components: {},
  props: {
    data: Object,
    highLevelCountry: Array,
    mapOptions: Object,
    flightData: Array,
  },
  data() {
    return {
      chart: null,
      myChart: undefined,
      mapType: worldJson,
    };
  },
  created() {
    //this.refreshData();
  },
  mounted() {
    this.drawMultiChart();
  },
  watch: {
    data() {
      //this.refreshData();
      //this.handleData();
      this.drawMultiChart();
    },
  },
  methods: {
    change(Pmode) {
      this.mode = Pmode;
    },
    drawMultiChart() {
      let convertData = function (originData) {
        const res = [];
        for (const key in worldGeo) {
          res.push({
            name: key,
            value: worldGeo[key]
              .concat(originData[key] ? originData[key].total_cases : 500)
              .concat(
                originData[key]
                  ? originData[key].total_vaccinations
                    ? originData[key].total_vaccinations
                    : 500
                  : 500
              ),
          });
        }
        //console.log(res)
        return res;
      };
      echarts.registerMap("world", this.mapType);
      const myChart = echarts.init(document.getElementById("mapContainer"));
      //每次窗口大小改变的时候都会触发onresize事件，这个时候我们将echarts对象的尺寸赋值给窗口的大小这个属性，从而实现图表对象与窗口对象的尺寸一致的情况
      window.onresize = myChart.resize;
      let option = {
        backgroundColor: "rgba(138, 180, 248, 1)",
        title: {
          top: 20,
          left: 20,
          text: "",
          x: "left",
          textStyle: {
            color: "#ccc",
          },
        },
        legend: {
          show: true,
          orient: "vertical",
          x: "right",
          y: "bottom",
          data: ["确诊数", "接种疫苗数"],
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
            x: "0%",
            y: "0%",
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
          map: "world",
          // 限制了缩放大小
          zoom: 2,
          scaleLimit: {
            min: 1,
            max: 6,
          },
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
              areaColor: "rgb(218, 220, 224)",
              color: "#000",
              // borderColor: "rgb(25, 103, 210)",
            },
          },
          tooltip: {
            formatter: (obj) => {
              //console.log(obj.name);
              return (
                '<div style="min-width: 150px; text-align:center">\n' +
                '                <div style="font-weight: 700; font-size: 18px; padding: 0 8px;">' +
                (ISO2Name[obj.name] ? ISO2Name[obj.name] : "争议地区") +
                (flag[obj.name]
                  ? '<span style="width: 60px;height: 40px;display: inline-block;margin: -9px -15px -14px;' +
                    "transform: scale(.4);background-image: url(/img/flags.460f345a.png);" +
                    flag[obj.name === "TWN" ? "CN" : obj.name] +
                    '"></span>'
                  : "") +
                "</div>\n" +
                '                <div style="padding: 0 8px; text-align: center; opacity: .66; font-weight: 500; font-size: 12px;">' +
                "" +
                "</div>\n" +
                '                <table style="margin-top: 8px; font-size: 12px; font-family: serif">\n' +
                "                    <tbody>\n" +
                "                        <tr>\n" +
                '                            <td style="min-width: 80px; text-align: left; padding-left: 8px">新增确诊</td>\n' +
                (this.data[obj.name]
                  ? this.data[obj.name].new_cases !== undefined
                    ? this.data[obj.name].new_cases === 0
                      ? '                            <td style="min-width: 80px; text-align: right; padding-right: 8px">' +
                        this.data[obj.name].new_cases +
                        "</td>"
                      : '                            <td style="color: red;min-width: 80px; text-align: right; padding-right: 8px">' +
                        this.data[obj.name].new_cases +
                        "</td>"
                    : '                            <td style="min-width: 80px; text-align: right; padding-right: 8px">暂无数据</td>'
                  : '                            <td style="min-width: 80px; text-align: right; padding-right: 8px">暂无数据</td>') +
                "                        <tr>\n" +
                '                            <td style="min-width: 80px; text-align: left; padding-left: 8px">确诊总数</td>\n' +
                '                            <td style="min-width: 80px; text-align: right; padding-right: 8px">' +
                (this.data[obj.name]
                  ? this.data[obj.name].total_cases
                    ? this.data[obj.name].total_cases
                    : "暂无数据"
                  : "暂无数据") +
                "</td>\n" +
                "                        </tr>\n" +
                "                        <tr>\n" +
                '                            <td style="min-width: 80px; text-align: left; padding-left: 8px">死亡总数</td>\n' +
                '                            <td style="min-width: 80px; text-align: right; padding-right: 8px">' +
                (this.data[obj.name]
                  ? this.data[obj.name].total_deaths
                    ? this.data[obj.name].total_deaths
                    : "暂无数据"
                  : "暂无数据") +
                "</td>\n" +
                "                        </tr>\n" +
                "                        <tr>\n" +
                '                            <td style="min-width: 80px; text-align: left; padding-left: 8px">疫苗接种</td>\n' +
                '                            <td style="min-width: 80px; text-align: right; padding-right: 8px">' +
                (this.data[obj.name]
                  ? !this.data[obj.name].total_vaccinations
                    ? "暂无数据"
                    : this.data[obj.name].total_vaccinations
                  : "暂无数据") +
                "</td>\n" +
                "                        </tr>\n" +
                "                    </tbody>\n" +
                "                </table>\n" +
                "            </div>"
              );
            },
          },
        },
        //调整显示级别
        layoutCenter: ["50%", "50%"],
        layoutSize: 1200,
        series: [
          {
            name: "确诊数",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(this.data),
            symbolSize: (val) => Math.sqrt(val[2]) / 100,
            label: {
              formatter: (val) => {
                return ISO2Name[val.name];
              },
              color: "black",
              position: "bottom",
              show: true,
            },
            itemStyle: {
              color: "rgba(100,112,234,0.7)",
            },
            zlevel: 1,
          },
          {
            name: "接种疫苗数",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(this.data),
            symbolSize: (val) => Math.sqrt(val[3] / 3) / 100,
            itemStyle: {
              color: "rgba(21,182,107,0.7)",
            },
          },
        ],
      };
      myChart.setOption(option);
      myChart.off("click");
      myChart.on("click", (component) => {
        if (
          component.name === "CHN" ||
          component.name === "TWN" ||
          component.name === "HKG" ||
          component.name === "MAC"
        ) {
          this.$notification.open({
            message: "小提示",
            description:
              "检测到您这边点击了中国区域，需要帮您切换到国内地图板块吗？",
            icon: <a-icon type="bulb" theme="filled" style="color: #F67504" />,
            duration: 2,
            btn: (h) => {
              return h(
                "a-button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  on: {
                    click: () => this.$emit("showModal", false),
                  },
                },
                "好的"
              );
            },
          });
        }
        this.$emit("getCountrySearch", component.name);
      });
      myChart.getZr().on("click", (param) => {
        if (!param.target) {
          this.$emit("getCountrySearch", "OWID_WRL");
        }
      });
      /*myChart.on('georoam', ()=>{
        let option = myChart.getOption();
        let zoom = myChart.getOption().geo[0].zoom;
        let show = option.geo[0].label.show;
        if (zoom < 1 && show) {
          //console.log(option)
          option.geo[0].label.show = false;
          myChart.setOption(option);
        }
        if (zoom > 1 && !show) {
          option.geo[0].label.show = true;
          myChart.setOption(option);
        }
      });*/
    },
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>