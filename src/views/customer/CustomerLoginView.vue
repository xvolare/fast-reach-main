<template>
  <div id="topLogin">
    <div id="login">
      <div id="topic">登录</div>
      <el-form :model="form" label-width="auto" label-position="right" style="max-width: 600px">
        <el-form-item label="账号">
          <el-input v-model="form.account" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.password" placeholder="请输入密码" clearable show-password />
        </el-form-item>
        <el-form-item id="button">
          <el-button type="primary" @click="login">登录</el-button>
          <!-- 修改注册按钮的点击事件 -->
          <el-button @click="goToRegister">注册</el-button>
        </el-form-item>
      </el-form>
      <div id="mention">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        account: '',
        password: ''
      },
      msg: ''
    };
  },
  methods: {
    async login() {
      try {
        const res = await axios.post('/api/customer/user/login', {
          account: this.form.account,
          password: this.form.password
        });

        if (res.data.code === 1) {
          const { id, phone, token } = res.data.data;
          localStorage.setItem('id', id);
          localStorage.setItem('phone', phone);
          localStorage.setItem('token', token);
          this.$notify({
            title: '登录提醒',
            message: `登录成功, 欢迎您 ${res.data.data.name || ''}`,
            type: 'success'
          });
          this.$router.push('/customer/manage');
        } else {
          this.$notify({
            title: '登录提醒',
            message: '登录失败',
            type: 'error'
          });
          this.msg = res.data.msg;
        }
      } catch (err) {
        console.error('登录失败:', err);
        this.msg = '登录失败: ' + (err.response?.data?.msg || '请稍后重试');
        this.$notify({
          title: '登录提醒',
          message: '登录失败',
          type: 'error'
        });
      }
    },
    // 新增方法用于跳转到注册页面
    goToRegister() {
      // 使用编程式导航跳转到注册页面
      this.$router.push('/customer/register');
    }
  }
};
</script>

<style scoped>
#login {
  width: 350px;
  padding-left: 60px;
  padding-right: 40px;
  border-radius: 10px;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#topic {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 60px;
  font-size: 20px;
  font-family: "Hiragino Sans GB";
}

#topLogin {
  margin-top: 0;
  background: url("../../assets/background1.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

body {
  margin: 0;
  padding: 0;
  border: 0;
}

#mention {
  color: red;
  line-height: 60px;
}
</style>
