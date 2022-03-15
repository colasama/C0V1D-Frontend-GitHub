
<template>
  <div style="width: 340px; text-align: center">
    <div v-if="!success">
      <h1
        style="margin-top: 20px; margin-left: 5px; font-size: 38px; float: left"
      >
        <b>注册账户</b>
      </h1>
      <a-input
        size="large"
        placeholder="用户名"
        v-model="username"
        style="margin-top: 20px"
      >
        <a-icon slot="prefix" type="user" />
      </a-input>
      <a-input
        size="large"
        placeholder="邮箱"
        v-model="email"
        style="margin-top: 30px"
      >
        <a-icon slot="prefix" type="mail" />
      </a-input>
      <a-input-password
        size="large"
        placeholder="密码"
        v-model="password"
        style="margin-top: 30px"
      >
        <a-icon slot="prefix" type="info-circle" />
      </a-input-password>
      <a-input-password
        size="large"
        placeholder="重复密码"
        v-model="repassword"
        style="margin-top: 30px; margin-bottom: 8px"
      >
        <a-icon slot="prefix" type="info-circle" />
      </a-input-password>
      <!--a-input size="large" placeholder="手机号" v-model="phone" style="margin-top:30px">
            <a-icon slot="prefix" type="phone" />
          </a-input>
          <a-input-search
            style="margin-top:30px;margin-bottom:15px"
            placeholder="邮箱验证码"
            size="large"
            @search="sendMail"
            v-model="authcode"
          >
            <a-button v-if="count==0" slot="enterButton">获取验证码</a-button>
            <a-button v-else disabled slot="enterButton">{{count}}秒后重试</a-button>
          </a-input-search-->
      <div v-if="errorLogin" style="color: red">用户名或密码错误！</div>
      <a-button
        size="large"
        type="primary"
        style="margin-top: 15px; margin-bottom: 15px"
        block
        @click="submit"
        >注册</a-button
      >
    </div>
    <a-result
      v-if="success"
      status="success"
      title="注册成功!"
      sub-title="现在您可以使用您的账号登录."
    >
      <template #extra>
        <a-button key="console" type="primary" @click="onOK"> 好的 </a-button>
      </template>
    </a-result>
  </div>
</template>
<style>
.logo {
  width: 40px;
  height: 40px;
  float: top;
}

#particles-js {
  width: 100%;
  height: calc(100% - 100px);
  position: absolute;
}
</style>

<script>
// @ is an alias to /src

export default {
  name: "Login",
  components: {},
  data() {
    return {
      username: "",
      email: "",
      password: "",
      phone: "",
      repassword: "",
      token: "",
      authcode: "",
      timer: null,
      count: 0,
      errorLogin: false,
      success: false,
    };
  },
  methods: {
    onOK() {
      this.$emit("closePop");
    },
    submit() {
      const that = this;
      if (this.username == "" || this.password == "" || this.email == "") {
        this.$message.error("信息要填写完整哦~");
        return;
      } else if (this.password != this.repassword) {
        this.$message.error("两次密码填写不一致");
        return;
      } else if (this.password.length <= 6) {
        this.$message.error("密码过短，请设置高于6位的密码");
      } else {
        const user = new this.$AV.User();
        user.setUsername(this.username);
        user.setPassword(this.password);
        user.setEmail(this.email);

        user.signUp().then(
          () => {
            this.success = true;
          },
          (error) => {
            console.log(error);
            if (error.toString().indexOf("The email address was invalid") != -1)
              that.$message.error("该邮箱地址无效");
            else if (error.toString().indexOf("此电子邮箱已经被占用") != -1)
              that.$message.error("该电子邮箱已存在");
            else if (
              error.toString().indexOf("Username has already been taken") != -1
            )
              that.$message.error("该用户名已存在");
            else that.$message.error(error.message);
          }
        );
      }
    },
    startTimer() {
      this.count -= 1;
      if (this.count == 0) {
        clearInterval(this.timer);
      }
    },
  },
};
</script>
