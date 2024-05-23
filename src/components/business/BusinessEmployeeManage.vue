<template>
  <div class="employee-management">
    <h1>商家端管理员工</h1>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchEmployees">查询</el-button>
        <el-button @click="clearSearch">清空</el-button>
      </el-form-item>
    </el-form>
    <el-button type="danger" @click="deleteSelectedEmployees">批量删除</el-button>
    <el-button type="primary" @click="addEmployee">新增员工</el-button>
    <el-table :data="records" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="gender" label="性别"></el-table-column>
      <el-table-column prop="phoneNumber" label="电话"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="permission" label="权限"></el-table-column>
      <el-table-column prop="registrationTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editEmployee(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteEmployee(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @current-change="handlePageChange" :current-page="currentPage" :page-size="pageSize"
      layout="prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import axios from 'axios';
  import { mapActions } from 'vuex';

  export default {
    data () {
      return {
        searchForm: {
          name: '', // 用于存储搜索框的值
        },
        total: 0,
        records: [],
        currentPage: 1,
        pageSize: 10,
        form: {
          id: null,
          name: '',
          sex: '',
          phoneNumber: '',
          account: '',
          permission: '',
          registrationTime: '',
          updateTime: '',
        },
      };
    },
    methods: {
      ...mapActions(['deleteEmployeeAction']),
      searchEmployees () {
        // 这里实现搜索员工的逻辑
        this.fetchEmployees({
          name: this.searchForm.name,
          page: this.currentPage,
          pageSize: this.pageSize,
        });
      },
      clearSearch () {
        this.searchForm.name = '';
        this.fetchEmployees({
          page: this.currentPage,
          pageSize: this.pageSize,
        });
      },
      addEmployee () {
        // 跳转到新增员工界面
        this.$router.push('/path/to/AddEmployeeView'); // 替换为实际的路由路径
      },
      editEmployee (employee) {
        // 跳转到编辑员工界面，并携带员工信息
        this.$router.push({
          path: '/path/to/EditEmployeeView', // 替换为实际的路由路径
          query: { id: employee.id },
        });
      },
      deleteEmployee (employee) {
        // 调用删除员工的API，并执行删除操作
        this.deleteEmployeeAction(employee.id).then(() => {
          this.fetchEmployees({
            page: this.currentPage,
            pageSize: this.pageSize,
          });
        });
      },
      deleteSelectedEmployees () {
        // 实现批量删除员工的逻辑
        // 注意：这里需要实现选择逻辑，目前未提供
      },
      handlePageChange (newPage) {
        this.currentPage = newPage;
        this.fetchEmployees({
          page: this.currentPage,
          pageSize: this.pageSize,
        });
      },
      fetchEmployees (params) {
        axios({
          url: '/api/business/employee/page',
          method: 'get',
          headers: {
            "token": localStorage.getItem('token')
          },
          params, // 使用params代替data，因为GET请求使用URL查询字符串传递参数
        }).then(res => {
          console.log(res)
          this.total = res.data.data.total;
          this.records = res.data.data.records;
        }).catch(err => {
          console.log(err.response.data.msg);
        });
      },
    },
    mounted () {
      this.fetchEmployees({
        page: this.currentPage,
        pageSize: this.pageSize,
      });
    },
  };
</script>

<style>
  .employee-management {
    margin: 30px;
  }
</style>