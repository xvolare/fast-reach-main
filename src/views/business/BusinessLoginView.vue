<template>
  <div id="topLogin">
    <div id="login">
      <div id="topic">登录</div>
      <el-form :model="form" label-width="auto" label-position="right" style="max-width: 600px">
        <el-form-item label="账号">
          <el-input v-model="form.account" placeholder="Please input" clearable />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="Please input" clearable show-password />
        </el-form-item>
        <el-form-item id="button">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button>注册</el-button>
        </el-form-item>
      </el-form>
      <div id="mention">{{msg}}</div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        form: {
          account: '',
          password: ''
        },
        msg: ''
      }
    },
    methods: {
      login () {
        axios({
          url: '/api/business/employee/login',
          method: 'post',
          data: {
            account: this.form.account,
            password: this.form.password
          }
        }).then(res => {
          if (res.data.code == 1) {
            localStorage.setItem('id', res.data.data.id)
            localStorage.setItem('token', res.data.data.token)
            localStorage.setItem('name', res.data.data.name)
            localStorage.setItem('permission', res.data.data.permission)
            localStorage.setItem("pd", this.form.password)
            this.$notify({
              title: '登录提醒',
              message: ('登录成功'),
            });
            this.$router.push('/business/manage')
          }
          else {
            this.$notify({
              title: '登录提醒',
              message: ('登录失败'),
            });
            this.msg = res.data.msg
          }
        }).catch(err => {
          console.log(err.data.msg)
        })
      }
    }
  }
</script>

<style>
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
    font-family: "Hiragino Sans GB"
  }

  #topLogin {
    margin-top: 0px;
    background: url("../../assets/background1.jpg");
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
  }

  body {
    margin: 0;
    padding: 0;
    border: 0
  }

  #mention {
    color: red;
    line-height: 60px;
  }
</style>