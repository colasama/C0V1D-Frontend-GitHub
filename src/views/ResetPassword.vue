<template>
  <div class="welcome">
    <a-row>
        <a-card style="width:360px;margin:220px auto;text-align:center">
          <h1 style="margin-top:20px;margin-left:5px;font-size:38px;float:left">
            <b>忘记密码？</b>
          </h1>
          <a-input
            size="large"
            placeholder="您的电子邮箱"
            ref="emailInput"
            v-model="email"
            style="margin-top:20px"
          >
            <a-icon slot="prefix" type="mail" />
          </a-input>
          <div style="text-align: right; margin-top: 24px">
            <a-button size="large" type="primary" @click="submit">重置密码</a-button>
          </div>
          <div style="text-align:center" />
        </a-card>
    </a-row>
  </div>
</template>

<style>
.welcome {
}

.logo {
  width: 40px;
  height: 40px;
  float: center;
}

#particles-js{
  width: 100%;
  height: calc(100% - 100px);
  position: absolute;    
}
</style>


<script>
// @ is an alias to /src
// import Vue from "vue";

export default {
  name: "ResetPassword",
  components: {},
  data() {
    return {
      email: "",
      password: "",
      token: "",
      count: "",
      errorLogin: false,
    };
  },
  methods: {
    submit(){
      const that = this;
      if(this.email == ""){
        this.$message.error("表单不得为空");
        return;
      }
      else{
        this.$axios({
          method: "post",
          url: "https://w3jiyrdu.lc-cn-n1-shared.com/1.1/requestPasswordReset",
          data: {
            mail: that.email
          },
          headers: {
            'Content-Type': 'application/json',
            'X-LC-Id': 'W3JIYrdUqKzubsf8Umli3Roc-gzGzoHsz',
            'X-LC-Key': 'fE6LeyXMPU8rvtcYdkjVT0mH'
          },
        })
          .then((res) => {
            console.log("Success: "+res);
          })
          .catch((res) => {
            this.$message.error(res);
          });

          
        }
    },
    toRegister(){
      this.$router.push({ path: "/register" });
    },
  },
  
  created() {
    this.$store.state.showNav = false;
  },
  destroyed() {
    this.$store.state.showNav = true;
  },
};
</script>