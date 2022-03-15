<template>
  <div class="rightFunction">
      <a-button @click="toForum" type="link" style="color: #232323; margin-right: 8px">防控知识</a-button>
    <div v-if="!this.$store.state.username">
      <a-button @click="toRegister" style="margin-right: 8px">注册</a-button>
      <a-button @click="toLogin">登录</a-button>
    </div>
    <a-dropdown v-if="this.$store.state.username">
      <a-menu style="margin-top:4px" slot="overlay">
        <a-menu-item key="4" @click="changePw">修改密码</a-menu-item>
        <a-menu-item key="4" @click="exit">退出</a-menu-item>
      </a-menu>
      <a-button type="link" style="color:#666666" v-if="$store.state.token!=null">
        <a-avatar style="margin-right: 12px;backgroundColor: #7265E6">{{this.$store.state.username[0].toUpperCase()}}</a-avatar> 
        <span style="margin-bottom:6px;font-size:18px;color: #232323;"> {{this.$store.state.username}}</span>
        <a-icon type="down" />
      </a-button>
    </a-dropdown>
  </div>
</template>

<style>

.top-logo {
  cursor: pointer;
  width: 200px;
  height: 46px;
  /*background: url("../assets/logo.png");*/
  margin: 16px 48px 0px 48px;
  float: left;
}

.rightFunction {
  position: absolute;
  right: 32px;
  z-index: 2;
  top: 32px;
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
// import Vue from 'vue';

export default {
  components: {
  },
  data() {
    return {
      current:0,
    }
  },
  created: function () {
    
  },
  computed: {},
  mounted: function () {

  },
  watch: {},
  methods: {
    toForum() {
      this.$router.push({ path: "/knowledge/" });
    },
    toLogin() {
      this.$router.push({ path: "/login/" });
    },
    changePw() {
      this.$router.push({ path: "/changepassword/" });
    },
    toRegister(){
      this.$router.push({ path: "/register/" });
    },
    exit() {
      this.$AV.User.logOut();
      this.$store.state.token = "";
      this.$store.state.username = "";
      this.$store.state.useravatar = null;
      this.$store.state.email = "";
      this.$store.state.location = "";
      this.$store.state.introduction = "";
      this.$store.state.name = "";
      this.$store.state.subscribedArea = []
      window.localStorage.clear();
      window.location.reload();
    },
    toForeignMap() {
      this.$router.push({ path: "/map" });
    }
  },
};
</script>