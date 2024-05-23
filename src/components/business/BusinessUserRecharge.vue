<template>
  <div>


    <div>
      &nbsp;&nbsp;&nbsp;
      <div class="ss">
        <el-input v-model="input" placeholder="请输入用户账号"></el-input>
      </div>
      &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
      <el-button type="primary" @click="searchDish">查询用户</el-button>


    </div>
    <el-table :data="records" style="width: 100%">
      <el-table-column prop="userId" label="userId" width="180" v-if="false"></el-table-column>
      <el-table-column prop="name" label="用户名称"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column label="手机号码" prop="phoneNumber"></el-table-column>
      <el-table-column label="余额" prop="money"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">

          <el-button type="text" @click="openDialog(scope.row)">充值</el-button>
          <el-dialog title="充值" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="充值金额" :label-width="'120px'">
                <el-input v-model="form.addmoney" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" :label-width="'120px'">
                <el-input v-model="form.pd" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
          </el-dialog>


        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px;">
      <el-pagination :current-page="currentPage" :page-size="pageSize" @current-change="changePage" layout="total"
        :total="total"></el-pagination>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    data () {
      return {
        newImg: null,
        options: [{
          value: 2,
          label: '全部'
        }, {
          value: 1,
          label: '正在售卖'
        }, {
          value: 0,
          label: '停止售卖'
        },
        ],
        value: '',
        input: '',
        //////
        total: null,
        records: [],
        currentPage: 1, // 当前页码  
        pageSize: 10, // 每页显示的条目数  
        dialogFormVisible: false,
        dialogFormVisibleAdd: false,
        form: {
          userId: "",
          addmoney: null,
          pd: ""
        },
        fileList: []
      };
    },
    methods: {

      searchDish () {
        axios({
          url: '/api/business/user/page',
          method: 'get',
          headers: {
            "token": localStorage.getItem('token')
          },
          params: {
            account: this.input,
          }
        }).then(res => {
          console.log(res.data)
          if (res.data.msg == "NOT_LOGIN") {
            this.$router.push('/business/login')
            return;
          }
          console.log(res.data.data)
          this.total = res.data.data.total
          this.records = res.data.data.records
        }).catch(err => {
          console.log(err.data.msg)
        })
      },
      ///////////////
      submitForm () {
        this.dialogFormVisible = false
        console.log(this.form.id)
        if (this.form.pd != localStorage.getItem("pd")) {
          alert("密码错误")
          return;
        }
        axios({
          url: '/api/business/user/recharge',
          method: 'get',
          headers: {
            "token": localStorage.getItem('token')
          },
          params: {
            addmoney: this.form.addmoney.slice(1),
            money: this.form.money.slice(1),
            userId: this.form.userId
          }
        }).then(res => {
          console.log(res.data)
          if (res.data.msg == "NOT_LOGIN") {
            this.$router.push('/business/login')
            return;
          }
          console.log(res.data);
          this.form.pd = "";
          location.reload();
        }).catch(err => {
          console.log(err.data.msg)
        })

      },



      openDialog (row) {
        this.dialogFormVisible = true
        this.form.userId = row.userId
        this.form.money = row.money
        this.form.addmoney = "￥0.00";
      },

      changePage () {
        axios({
          url: '/api/business/user/page',
          method: 'get',
          headers: {
            "token": localStorage.getItem('token')
          },
          params: {
            account: null,
          }
        }).then(res => {
          console.log(res.data)
          if (res.data.msg == "NOT_LOGIN") {
            this.$router.push('/business/login')
            return;
          }
          console.log(res.data.data)
          this.total = res.data.data.total
          this.records = res.data.data.records
        }).catch(err => {
          console.log(err.data.msg)
        })
      }
    },
    mounted () {
      this.changePage()
    },

  }
</script>

<style>
  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 20;
    }
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .ss {
    display: inline-block
  }

  #right {
    display: inline-block;
    float: right;
  }
</style>