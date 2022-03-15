<template>
  <div style="width: 360px; text-align: center">
    <h1
      style="margin-top: 20px; margin-left: 5px; font-size: 38px; float: left"
    >
      <b>登录账户</b>
    </h1>
    <a-input
      size="large"
      placeholder="用户名"
      ref="usernameInput"
      v-model="username"
      style="margin-top: 20px"
    >
      <a-icon slot="prefix" type="user" />
    </a-input>
    <a-input-password
      size="large"
      placeholder="密码"
      ref="passwordInput"
      v-model="password"
      style="margin-top: 30px; margin-bottom: 12px"
    >
      <a-icon slot="prefix" type="info-circle" />
    </a-input-password>
    <!--a href="#/resetpassword">忘记密码？点击这里重置</a-->
    <div v-if="errorLogin" style="color: red">用户名或密码错误！</div>
    <a-row
      type="flex"
      justify="center"
      style="margin-top: 12px; margin-bottom: 30px"
    >
      <a-col :span="24">
        <a-button size="large" type="primary" block @click="submit"
          >登录</a-button
        >
      </a-col>
    </a-row>
    <div style="text-align: center" />
  </div>
</template>

<style>
</style>

<script>
// @ is an alias to /src
// import Vue from "vue";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      username: "",
      password: "",
      token: "",
      count: "",
      errorLogin: false,
    };
  },
  methods: {
    submit() {
      const that = this;
      if (this.username == "" || this.password == "") {
        this.$message.error("表单不得为空");
        return;
      } else {
        this.$AV.User.logIn(this.username, this.password).then(
          (loginedUser) => {
            that.$store.state.username = loginedUser.attributes.username;
            that.$store.state.userid = loginedUser.id;
            that.$store.state.token = loginedUser._sessionToken;

            window.localStorage.setItem("token", loginedUser._sessionToken);
            window.localStorage.setItem(
              "username",
              loginedUser.attributes.username
            );
            window.localStorage.setItem("userid", loginedUser.id);
            // window.localStorage.setItem('showAdd', true);
            
            that.$message.success("登陆成功", 1).then(() => { 
              that.$store.state.showLogin = false;
              window.location.reload();
             });
          },
          (error) => {
            console.log(error);
            that.$message.error("用户名和密码不匹配");
            this.password = null;
          }
        );
      }
      this.$emit("closePop");
    },
  },
};
</script>