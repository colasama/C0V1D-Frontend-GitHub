<template>
  <div>
    <div class="newsCard">
      <div>
        <div style="text-align: left">
          <a-row style="border: solid 1.5px rgb(221, 0, 27); border-radius: 8px">
            <a-col :span="6" style="margin: auto; text-align: center; background-color: rgb(221, 0, 27); border-radius: 0px; height: 100%">
              <div style="color: white; font-size: 16px; font-weight: 600">
              风险等级
              </div>
              <div style="font-weight: 700; font-size: 32px; color: white">
                高
              </div>
            </a-col>
            <a-col :span="18" style="margin: 0 auto; text-align: center">
              <a-list :data-source="data">
                <a-skeleton v-if="loading" active />
                <a-list-item slot="renderItem" slot-scope="item">
                  <div style="margin: 0 auto; text-align: center">
                    <div
                      style="text-align: left"
                      v-if="item.attributes.level == 2"
                    >
                      <div style="font-size: 16px; font-weight: 600">
                        {{ item.attributes.province + item.attributes.city }}
                        <a-row type="flex" :gutter="64">
                          <a-col>
                            {{ item.attributes.location }}
                          </a-col>
                          <a-col>
                            <a-tag color="red">高风险</a-tag>
                          </a-col>
                        </a-row>
                      </div>
                    </div>
                  </div>
                </a-list-item>
              </a-list>
            </a-col>
            </a-row>
            <a-row style="border: solid 1.5px orange; border-radius: 8px; margin-top: 12px">
              <a-col :span="6" style="margin: auto; text-align: center; background-color: orange; border-radius: 0px; height: 100%">
                <div style="color: white; font-size: 16px; font-weight: 600">
                风险等级
                </div>
                <div style="font-weight: 700; font-size: 32px; color: white">
                  中
                </div>
              </a-col>
              <a-col :span="18" style="margin: 0 auto; text-align: center">
              <a-list :data-source="data">
                <a-skeleton v-if="loading" active />
                <a-list-item slot="renderItem" slot-scope="item">
                  <div style="margin: 0 auto; text-align: center">
                    <div
                      style="text-align: left"
                      v-if="item.attributes.level == 1"
                    >
                      <div style="font-size: 16px; font-weight: 600">
                        {{ item.attributes.province + item.attributes.city }}
                        <a-row type="flex" :gutter="64">
                          <a-col>
                            {{ item.attributes.location }}
                          </a-col>
                          <a-col>
                            <a-tag color="orange">中风险</a-tag>
                          </a-col>
                        </a-row>
                      </div>
                    </div>

                    <div style="font-size: 16px; font-weight: 600; margin-top: 12px">暂无中风险地区</div>
                  </div>
                </a-list-item>
              </a-list>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: ["data"],
  computed: {
    loading() {
      if (this.data == undefined) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    //this.refreshData();
  },
  watch: {},
  methods: {},
};
</script>