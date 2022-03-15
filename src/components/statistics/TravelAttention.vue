<template>
  <div>
    <a-card class="dataCard">
      <h2 style="margin-bottom: 16px">确诊患者同程信息</h2>
      <a-table
        :columns="columnsForTravel"
        :data-source="dataForTravel"
        :pagination="false"
        :scroll="{ y: 400 }"
      >
      </a-table>
    </a-card>
  </div>
</template>

<script>
const columnsForTravel = [
  {
    title: "日期",
    dataIndex: "date",
    key: "date",
    scopedSlots: { customRender: "date" },
    sorter: (a, b) => a.date.localeCompare(b.date),
  },
  {
    title: "航班号",
    dataIndex: "number",
    key: "number",
    scopedSlots: { customRender: "number" },
  },
  {
    title: "始发地",
    dataIndex: "src_city",
    key: "src_city",
    scopedSlots: { coustomRender: "srcCity" },
    sorter: (a, b) => a.src_city.localeCompare(b.src_city),
  },
  {
    title: "终点",
    dataIndex: "dest_city",
    key: "dest_city",
    scopedSlots: { coustomRender: "dest_city" },
    sorter: (a, b) => a.dest_city.localeCompare(b.dest_city),
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    scopedSlots: { coustomRender: "type" },
    sorter: (a, b) => a.type.localeCompare(b.type),
  },
];

export default {
  name: "TravelAttentions",
  props: {
    data: Array,
  },
  data() {
    return {
      columnsForTravel,
    };
  },
  computed: {
    dataForTravel() {
      if (this.data == null) {
        return [];
      }
      return this.data.map((val) => {
        if (val.attributes.type == 'flight') {
          val.attributes.type = "航班";
        }
        if (val.attributes.type == 'train') {
          val.attributes.type = "列车";
        }
        return val.attributes;
      });
    }
  },
};
</script>