<template>
  <div class="register-container">
    <h1>注册账号</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="account">账号：</label>
        <input type="text" id="account" v-model="form.account" required>
      </div>
      <div class="form-group">
        <label for="password">密码：</label>
        <input type="password" id="password" v-model="form.password" required>
      </div>
      <div class="form-group">
        <label for="phone">电话：</label>
        <input type="tel" id="phone" v-model="form.phone" required>
      </div>
      <button type="submit" :disabled="isSubmitting">注册</button>
    </form>
    <p v-if="msg" class="message">{{ msg }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        account: '',
        password: '',
        phone: ''
      },
      msg: '',
      isSubmitting: false
    }
  },
  methods: {
    async register() {
      this.isSubmitting = true;
      this.msg = '';
      try {
        const response = await axios.post('/api/customer/register/add', {
          account: this.form.account,
          password: this.form.password,
          phone: this.form.phone
        }, {
          headers: {
            "token": localStorage.getItem("token")
          }
        });

        if (response.data.msg === "NOT_LOGIN") {
          this.$router.push('/customer/login');
          return;
        } else {
          this.msg = response.data.msg;
        }
      } catch (error) {
        console.error('注册失败:', error);
        this.msg = '注册失败: ' + (error.response?.data?.msg || '请稍后重试');
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #218838;
}

.message {
  margin-top: 15px;
  color: red;
}
</style>
