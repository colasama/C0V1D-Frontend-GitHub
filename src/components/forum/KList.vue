<template>
  <a-list v-if="isDataLoaded" item-layout="vertical" size="large" :pagination="pagination" :data-source="knowledges"
    :split="false" style="padding: 12px 0">
    <a-list-item slot="renderItem" slot-scope="items" style="padding: 0 ">
      <a-collapse accordion>
        <a-collapse-panel v-for="item in items" :key='item.id' style="background-color: #fff">
          <span slot="header" style="font-size: 18px">
            <b>{{ item.question }}</b>
            <a-tag color="purple" v-if="item.tag">{{ item.tag }}</a-tag>
          </span>
          <p>{{ item.answer }}</p>
        </a-collapse-panel>
      </a-collapse>
    </a-list-item>
  </a-list>
</template>

<style scoped>
</style>

<script>
export default {
  data() {
    return {
      pagination: {
        onChange: () => {
        },
        pageSize: 1,
      },
    };
  },
  props: {
    data: Array,
  },
  computed: {
    isDataLoaded() {
      return this.data != undefined;
    },
    knowledges() {
      const res = [];
      for (let i = 0; i < this.data.length; i += 10) {
        res.push(this.data.slice(i, i + 10));
      }
      return res;
    },
  },
  methods: {},
};
</script>