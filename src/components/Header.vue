<template>
  <div class="re-header">
    <div @click="toIndex" class="header-top-logo" />

    <a-menu
      class="header-menu"
      style="background-color: #5971c9; border-color: #5971c9"
      mode="horizontal"
      v-model="current"
      :style="{ lineHeight: '64px' }"
    >
      <a-menu-item
        class="site-header-nav-item"
        @mouseover="overChangeStyle(item)"
        @mouseout="outChangeStyle(item)"
        v-for="item in items"
        :key="item.key"
        @click="item.onClick"
        v-bind:style="item.style"
        >{{ item.message }}</a-menu-item
      >

      <a-popover
        v-model="registerVisible"
        trigger="click"
        placement="bottomRight"
      >
        <Register @closePop="onRegister" slot="content" />
        <a-button
          v-if="this.$store.state.showLogin"
          style="margin-right: 16px; border-radius: 3px"
          >注册</a-button
        >
      </a-popover>
      <a-popover v-model="loginVisible" trigger="click" placement="bottomRight">
        <Login @closePop="onLogin" v-model="loginVisible" slot="content" />
        <a-button
          v-if="this.$store.state.showLogin"
          style="margin-right: 32px; border-radius: 3px"
          >登录</a-button
        >
      </a-popover>
      <a-dropdown v-if="!this.$store.state.showLogin">
        <a-menu style="margin-top: 4px" slot="overlay">
          <a-menu-item key="1">
            <a-popover
              v-model="changeVisible"
              trigger="click"
              placement="bottomRight"
            >
              <ChangeCode slot="content" @closePop= "onChangeCode" />
              修改密码
            </a-popover>
          </a-menu-item>
          <a-menu-item key="2" @click="exit">退出</a-menu-item>
        </a-menu>
        <a-button type="link" style="color: #666666">
          <a-avatar style="margin-right: 12px; background-color: #2b3775">{{
            this.$store.state.username[0].toUpperCase()
          }}</a-avatar>
          <span style="margin-bottom: 6px; font-size: 18px; color: #fff">
            {{ this.$store.state.username }}</span
          >
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </a-menu>
  </div>
</template>

<style>
.header-top-logo {
  cursor: pointer;
  width: 158px;
  height: 46px;
  background: url("../assets/logo.png");
  margin: 12px 32px 0px 32px;
  float: left;
  z-index: 2;
}

.search {
  cursor: pointer;
  height: 40px;
  margin: 0px 0px 0px calc(50vw - 300px);
  float: left;
}

.re-header {
  background: #2c2e3b;
  height: 64px;
  text-align: center;
  z-index: 10;
}

.header-menu {
  text-align: right;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>



<script>
import ChangeCode from "./users/ChangeCode.vue";
import Login from "./users/Login.vue";
import Register from "./users/Register.vue";
// import Vue from 'vue';
const moveOutColor = "#fff";
const moveOverColor = "rgb(159,234,249)";

export default {
  components: {
    Login,
    Register,
    ChangeCode,
  },
  data() {
    return {
      loginVisible: false,
      registerVisible: false,
      changeVisible: false,
      current: ["index"],
      items: [
        {
          key: "index",
          onClick: this.toIndex,
          style: {
            color: moveOutColor,
          },
          message: "疫情数据",
        },
        {
          key: "forum",
          onClick: this.toForum,
          style: {
            color: moveOutColor,
          },
          message: "防控知识",
        },
        {
          key: "qahelper",
          onClick: this.openHelper,
          style: {
            color: moveOutColor,
          },
          message: "政策问答",
        },
      ],
    };
  },
  created: function () {},
  computed: {},
  mounted: function () {},
  watch: {},
  methods: {
    openHelper() {
      if (this.$store.state.isChatOpen == true)
        this.$store.state.isChatOpen = false;
      else this.$store.state.isChatOpen = true;
    },
    toIndex() {
      this.$router.push({ path: "/" });
    },
    toForum() {
      this.$router.push({ path: "/knowledge/index" });
    },
    onLogin() {
      this.loginVisible = false;
    },
    onChangeCode() {
      this.changeVisible = false;
      this.exit();
    },
    toChangepw() {
      this.$router.push({ path: "/changepassword/" });
    },
    onRegister() {
      this.registerVisible = false;
    },

    exit() {
      this.$AV.User.logOut();
      this.$store.state.token = null;
      this.$store.state.username = null;
      this.$store.state.userid = null;
      this.$store.state.subscribedArea = [];
      window.localStorage.clear();
      window.location.reload();
    },

    overChangeStyle(item) {
      item.style.color = moveOverColor;
      if (item.style["border-color"]) {
        item.style["border-color"] = moveOverColor;
      }
    },
    outChangeStyle(item) {
      item.style.color = moveOutColor;
      if (item.style["border-color"]) {
        item.style["border-color"] = moveOutColor;
      }
    },
  },
};
</script>