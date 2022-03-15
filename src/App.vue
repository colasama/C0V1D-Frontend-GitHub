<template>
  <div id="app" style="display:flex;flex-direction:column;">
    <AppHeader style="min-width:100%" v-if="this.$store.state.showNav"></AppHeader>
    <router-view style="text-align: center;flex:1;min-width:100%" :key="$route.path" v-if="isRouterActive"/>
    <Chat style="z-index: 100" />
  </div>
</template>

<style>
html,body,#app{
  height: 100%;
  min-height: 100%;
  width: 100%;
  margin: 0;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import AppHeader from './components/Header.vue';
import Chat from "./components/Chat.vue";

export default {
  provide(){
    return{
      reload: this.reload
    }
  },
  components:{
    AppHeader,
    Chat
  },
  data() {
    return {
      isRouterActive: true
    }
  },
  created: function(){
    document.title = this.$route.meta.title || this.$route.meta.pathName
  },
  watch:{
    $route(){
      document.title = this.$route.meta.title || this.$route.meta.pathName
    }
  },
  methods: {
    reload(){
      this.isRouterActive = false;
      this.$nextTick(function () {
        this.isRouterActive = true;
      })
    }
  }
};
</script>
