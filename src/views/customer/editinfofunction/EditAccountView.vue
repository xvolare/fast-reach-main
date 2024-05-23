<template>
  <div>
    <h1>修改个人信息</h1>
    <el-form :model="form" ref="form" label-width="100px">
      <el-form-item label="用户名" prop="name" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone" :rules="[{ required: true, message: '请输入电话', trigger: 'blur' }]">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <p v-if="msg" class="message">{{ msg }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        name: '',
        password: '',
        phone: ''
      },
      msg: '',
      isSubmitting: false,
      id: localStorage.getItem('id') // 假设用户ID存储在本地存储中
    };
  },
  methods: {
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.isSubmitting = true;
          this.msg = '';
          try {
            const response = await axios.post('/api/customer/manage/editinfo', {
              id: this.id, // 传递用户ID
              name: this.form.name,
              password: this.form.password,
              phone: this.form.phone
            }, {
              headers: {
                "token": localStorage.getItem("token")
              }
            });

            if (response.data.code === 1) {
              this.msg = '修改成功';
              this.$notify({
                title: '修改成功',
                message: '信息已更新',
                type: 'success'
              });
            } else {
              this.msg = response.data.msg || '修改失败';
              this.$notify({
                title: '修改失败',
                message: this.msg,
                type: 'error'
              });
            }
          } catch (error) {
            console.error('修改失败:', error);
            this.msg = '修改失败: ' + (error.response?.data?.msg || '请稍后重试');
            this.$notify({
              title: '修改失败',
              message: this.msg,
              type: 'error'
            });
          } finally {
            this.isSubmitting = false;
          }
        } else {
          this.msg = '请检查表单填写';
        }
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    }
  },
  mounted() {
    // 确保从本地存储中获取用户ID
    this.id = localStorage.getItem('id');
    if (!this.id) {
      this.$router.push('/customer/login');
    }
  }
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
.el-form {
  max-width: 600px;
  margin: auto;
}
.el-form-item {
  margin-bottom: 20px;
}
.message {
  margin-top: 15px;
  color: red;
}
</style>
